import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, In, DataSource } from 'typeorm';
import { Booking, BookingStatus } from '../../entities/booking.entity';
import { Employee } from '../../entities/employee.entity';
import { BookingEmployee } from '../../entities/booking-employee.entity';
import { Service as ServiceEntity } from '../../entities/service.entity';
import {
  BookingNotification,
  NotificationType,
  NotificationStatus,
} from '../../entities/booking-notification.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { TimeSlotsService } from '../../admin/time-slots/time-slots.service';
import { CustomersService } from '../customers/customers.service';
import { EmployeeSchedulesService } from '../../admin/employee-schedules/employee-schedules.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(BookingNotification)
    private notificationRepository: Repository<BookingNotification>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(BookingEmployee)
    private bookingEmployeeRepository: Repository<BookingEmployee>,
    @InjectRepository(ServiceEntity)
    private serviceRepository: Repository<ServiceEntity>,
    private timeSlotsService: TimeSlotsService,
    private customersService: CustomersService,
    private employeeSchedulesService: EmployeeSchedulesService,
    private dataSource: DataSource,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const {
      timeSlotId,
      numberOfGuests,
      customerId,
      bookingDate,
      totalPrice,
      employeeIds,
      ...rest
    } = createBookingDto;

    // Use transaction to handle race conditions
    return this.dataSource.transaction(async (manager) => {
      // 1. Lock employees to prevent race conditions (Pessimistic Write Lock)
      // Any other request trying to book these employees will wait here until this transaction finishes
      if (employeeIds && employeeIds.length > 0) {
        await manager
          .createQueryBuilder(Employee, 'employee')
          .setLock('pessimistic_write')
          .whereInIds(employeeIds)
          .getMany();
      }

      // Check if customer exists
      await this.customersService.findOne(customerId);

      // Check time slot availability (Capacity check)
      const availability = await this.checkAvailability(bookingDate, timeSlotId);

      if (!availability.data.isAvailable || availability.data.availableSlots < numberOfGuests) {
        throw new ConflictException(
          `Chỉ còn ${availability.data.availableSlots} chỗ trống, không đủ cho ${numberOfGuests} khách`,
        );
      }

      // Validate employeeIds
      if (employeeIds && employeeIds.length > 0) {
        // Số lượng nhân viên chọn không được vượt quá số lượng khách
        if (employeeIds.length > numberOfGuests) {
          throw new BadRequestException(
            `Số lượng nhân viên (${employeeIds.length}) không được vượt quá số lượng khách (${numberOfGuests})`,
          );
        }

        // Kiểm tra trùng lặp trong danh sách
        const uniqueEmployeeIds = [...new Set(employeeIds)];
        if (uniqueEmployeeIds.length !== employeeIds.length) {
          throw new BadRequestException('Danh sách nhân viên có ID trùng lặp');
        }

        // Kiểm tra nhân viên có đi làm ngày đó không (lịch làm việc)
        const timeSlot = await this.timeSlotsService.findOne(timeSlotId);
        const slotStartTime = timeSlot.startTime; // HH:mm:ss
        const scheduleAvailable = await this.employeeSchedulesService.getAvailableEmployees(
          bookingDate,
          typeof slotStartTime === 'string' ? slotStartTime.substring(0, 5) : slotStartTime,
        );
        const availableEmpIds = scheduleAvailable.data.map((emp: any) => emp.id);

        for (const empId of employeeIds) {
          if (!availableEmpIds.includes(empId)) {
            const emp = await this.employeeRepository.findOne({ where: { id: empId } });
            throw new BadRequestException(
              `Nhân viên ${emp?.fullName || empId} không làm việc vào ngày/giờ này`,
            );
          }
        }

        // IMPORTANT: Re-check employee availability INSIDE the transaction
        // Since we locked the employees, this check is now thread-safe
        const start = new Date(bookingDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(bookingDate);
        end.setHours(23, 59, 59, 999);

        // Find conflicting bookings for these employees in this time slot
        const conflictingBookings = await manager.find(BookingEmployee, {
          where: {
            employeeId: In(employeeIds),
            booking: {
              bookingDate: Between(start, end),
              timeSlotId: timeSlotId,
              status: In([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
            },
          },
          relations: ['booking', 'employee'],
        });

        if (conflictingBookings.length > 0) {
          const busyEmployeeName = conflictingBookings[0].employee.fullName;
          throw new ConflictException(
            `Nhân viên ${busyEmployeeName} vừa được đặt bởi khách hàng khác. Vui lòng chọn nhân viên khác.`,
          );
        }
      }

      // Check for double booking (same customer, same date, same time slot)
      const existingBooking = await manager.findOne(Booking, {
        where: {
          customerId,
          bookingDate: new Date(bookingDate),
          timeSlotId,
          status: BookingStatus.CONFIRMED,
        },
      });

      if (existingBooking) {
        throw new ConflictException('Khách hàng đã có lịch đặt trong khung giờ này');
      }

      // Create booking using Transaction Manager
      const booking = manager.create(Booking, {
        ...rest,
        customerId,
        bookingDate: new Date(bookingDate),
        timeSlotId,
        numberOfGuests,
        totalPrice,
        status: BookingStatus.CONFIRMED,
      });

      const savedBooking = await manager.save(Booking, booking);

      // Tạo quan hệ booking-employee using Transaction Manager
      if (employeeIds && employeeIds.length > 0) {
        for (const empId of employeeIds) {
          const bookingEmployee = manager.create(BookingEmployee, {
            bookingId: savedBooking.id,
            employeeId: empId,
          });
          await manager.save(BookingEmployee, bookingEmployee);
        }
      }

      // Create notification
      // Note: We can keep notification creation outside or inside. Inside is better for consistency.
      const customer = await this.customersService.findOne(customerId);
      const notification = manager.create(BookingNotification, {
        bookingId: savedBooking.id,
        type: NotificationType.BOOKING_CREATED,
        title: 'Đặt lịch thành công',
        message: `Bạn đã đặt lịch thành công cho ${numberOfGuests} người vào ngày ${bookingDate}`,
        recipientEmail: customer.email,
        status: NotificationStatus.PENDING,
      });
      await manager.save(BookingNotification, notification);

      const result = await manager.findOne(Booking, {
        where: { id: savedBooking.id },
        relations: [
          'customer',
          'service',
          'treatment',
          'employee', // Legacy relation
          'timeSlot',
          'notifications',
          'bookingEmployees',
          'bookingEmployees.employee',
        ],
      });

      return {
        status: 200,
        data: result,
        message: 'Tạo booking thành công',
      };
    });
  }

  async findAll(filters?: {
    status?: BookingStatus;
    date?: string;
    startDate?: string;
    endDate?: string;
    customerId?: string;
  }) {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('booking.treatment', 'treatment')
      .leftJoinAndSelect('booking.employee', 'employee')
      .leftJoinAndSelect('booking.timeSlot', 'timeSlot')
      .leftJoinAndSelect('booking.bookingEmployees', 'bookingEmployees')
      .leftJoinAndSelect('bookingEmployees.employee', 'bookingEmployee')
      .orderBy('booking.bookingDate', 'DESC')
      .addOrderBy('timeSlot.startTime', 'ASC');

    if (filters?.status) {
      query.andWhere('booking.status = :status', { status: filters.status });
    }

    if (filters?.startDate && filters?.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      // Ensure end date includes the entire day
      end.setHours(23, 59, 59, 999);

      query.andWhere('booking.bookingDate BETWEEN :start AND :end', { start, end });
    } else if (filters?.date) {
      const date = new Date(filters.date);
      // Create range for that specific day
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.andWhere('booking.bookingDate BETWEEN :start AND :end', { start, end });
    }

    if (filters?.customerId) {
      query.andWhere('booking.customerId = :customerId', {
        customerId: filters.customerId,
      });
    }

    const bookings = await query.getMany();
    return {
      status: 200,
      data: bookings,
      message: 'Lấy danh sách booking thành công',
    };
  }

  async findOne(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: [
        'customer',
        'service',
        'treatment',
        'employee',
        'timeSlot',
        'notifications',
        'bookingEmployees',
        'bookingEmployees.employee',
      ],
    });

    if (!booking) {
      throw new NotFoundException(`Booking với ID ${id} không tồn tại`);
    }

    return booking;
  }

  async findOneFormatted(id: string) {
    const booking = await this.findOne(id);
    return {
      status: 200,
      data: booking,
      message: 'Lấy thông tin booking thành công',
    };
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);

    // If cancelling booking, free up the time slot
    if (
      updateBookingDto.status === BookingStatus.CANCELLED &&
      booking.status !== BookingStatus.CANCELLED
    ) {
      // Decrement booking logic removed as we calculate dynamically now
      // await this.timeSlotsService.decrementBookings(booking.timeSlotId, booking.numberOfGuests);

      booking.cancelledAt = new Date();

      // Create cancellation notification
      await this.createNotification(
        booking.id,
        NotificationType.BOOKING_CANCELLED,
        'Đặt lịch đã bị hủy',
        `Lịch đặt của bạn đã bị hủy. Lý do: ${updateBookingDto.cancellationReason || 'Không có'}`,
      );
    }

    // If confirming booking
    if (
      updateBookingDto.status === BookingStatus.CONFIRMED &&
      booking.status === BookingStatus.PENDING
    ) {
      await this.createNotification(
        booking.id,
        NotificationType.BOOKING_CONFIRMED,
        'Đặt lịch đã được xác nhận',
        `Lịch đặt của bạn đã được xác nhận`,
      );
    }

    // If completing booking
    if (
      updateBookingDto.status === BookingStatus.COMPLETED &&
      booking.status !== BookingStatus.COMPLETED
    ) {
      // Update customer stats
      await this.customersService.updateStats(booking.customerId, booking.totalPrice);

      await this.createNotification(
        booking.id,
        NotificationType.BOOKING_COMPLETED,
        'Dịch vụ hoàn thành',
        `Dịch vụ của bạn đã hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ!`,
      );
    }

    Object.assign(booking, updateBookingDto);
    const updated = await this.bookingRepository.save(booking);
    return {
      status: 200,
      data: updated,
      message: 'Cập nhật booking thành công',
    };
  }

  async remove(id: string) {
    const booking = await this.findOne(id);

    // Free up time slot if booking was confirmed
    if (booking.status === BookingStatus.CONFIRMED) {
      // Decrement logic removed
      // await this.timeSlotsService.decrementBookings(booking.timeSlotId, booking.numberOfGuests);
    }

    await this.bookingRepository.remove(booking);
    return {
      status: 200,
      data: {},
      message: 'Xóa booking thành công',
    };
  }

  // Check availability for a specific date and time slot
  async checkAvailability(date: string, timeSlotId: string) {
    const timeSlot = await this.timeSlotsService.findOne(timeSlotId);

    // Create range for that specific day
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // Get bookings for this date and time slot
    const bookings = await this.bookingRepository.find({
      where: {
        bookingDate: Between(start, end),
        timeSlotId,
        status: In([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
      },
    });

    const totalGuests = bookings.reduce((sum, booking) => sum + booking.numberOfGuests, 0);
    const availableSlots = timeSlot.maxCapacity - totalGuests;

    return {
      status: 200,
      data: {
        date,
        timeSlot,
        availableSlots,
        maxCapacity: timeSlot.maxCapacity,
        currentBookings: totalGuests,
        isAvailable: availableSlots > 0 && timeSlot.isActive,
      },
      message: 'Kiểm tra availability thành công',
    };
  }

  // Get active employees for booking
  async getActiveEmployees() {
    const employees = await this.employeeRepository.find({
      where: { isActive: true },
      order: { fullName: 'ASC' },
    });
    return {
      status: 200,
      data: employees,
      message: 'Lấy danh sách nhân viên thành công',
    };
  }

  // Get available time slots for a specific date
  async getAvailableTimeSlots(date: string, serviceId?: string, employeeId?: string) {
    const allTimeSlots = await this.timeSlotsService.findActive();

    let serviceCategory: string | undefined;
    if (serviceId) {
      const service = await this.serviceRepository.findOne({ where: { id: serviceId } });
      serviceCategory = service?.category?.toLowerCase();
    }

    // Nếu có employeeId, lấy danh sách các slot mà nhân viên đó ĐÃ CÓ booking
    let employeeBusySlots: string[] = [];
    if (employeeId) {
      const bookings = await this.bookingRepository.find({
        where: {
          bookingDate: new Date(date),
          status: In([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
          bookingEmployees: {
            employeeId: employeeId,
          },
        },
        relations: ['bookingEmployees'], // Cần join để filter
      });
      // Đoạn trên query hơi sai vì TypeORM find relations lồng nhau.
      // Dùng bookingEmployeeRepos sẽ chuẩn hơn.
    }

    // Query lại logic employeeBusySlots chuẩn hơn bằng bookingEmployeeRepository
    if (employeeId) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      const busy = await this.bookingEmployeeRepository.find({
        where: {
          employeeId,
          booking: {
            bookingDate: Between(start, end),
            status: In([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
          },
        },
        relations: ['booking'],
      });
      employeeBusySlots = busy.map((b) => b.booking.timeSlotId);
    }

    const availability = await Promise.all(
      allTimeSlots.map(async (slot) => {
        const avail = await this.checkAvailability(date, slot.id);

        // Check Employee specific availability
        if (employeeId) {
          if (employeeBusySlots.includes(slot.id)) {
            avail.data.isAvailable = false;
            // Có thể thêm message "Nhân viên bận" nếu cần
          }
          // Vẫn phải check checkAvailability (global capacity) bên trên.
          // Nếu global full -> false.
          // Nếu global ok mà employee bận -> false.
        } else if (avail.data.isAvailable && serviceCategory) {
          // Logic cũ: Nếu không chọn Employee trước, kiểm tra có ÍT NHẤT 1 employee phù hợp rảnh k
          const employeesRes = await this.getAvailableEmployees(date, slot.id);
          const hasSpecialized = employeesRes.data.availableEmployees.some((emp) => {
            if (!emp.specialization) return true;
            const specs = emp.specialization
              .toLowerCase()
              .split(',')
              .map((s: string) => s.trim());
            return specs.some((spec: string) => serviceCategory.includes(spec));
          });

          if (!hasSpecialized) {
            avail.data.isAvailable = false;
          }
        }

        return avail.data;
      }),
    );

    // Trả về tất cả các slot (bao gồm cả slot không available) để frontend hiển thị trạng thái disabled
    const resultSlots = availability.map((a) => a);
    // Hoặc đơn giản là return availability;
    return {
      status: 200,
      data: availability,
      message: 'Lấy danh sách khung giờ thành công',
    };
  }

  // Create notification
  private async createNotification(
    bookingId: string,
    type: NotificationType,
    title: string,
    message: string,
  ) {
    const booking = await this.findOne(bookingId);

    const notification = this.notificationRepository.create({
      bookingId,
      type,
      title,
      message,
      recipientEmail: booking.customer.email,
      status: NotificationStatus.PENDING,
    });

    return this.notificationRepository.save(notification);
  }

  // Get notifications for a booking
  async getNotifications(bookingId: string) {
    const notifications = await this.notificationRepository.find({
      where: { bookingId },
      order: { createdAt: 'DESC' },
    });
    return {
      status: 200,
      data: notifications,
      message: 'Lấy danh sách thông báo thành công',
    };
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification không tồn tại');
    }

    notification.status = NotificationStatus.READ;
    notification.readAt = new Date();

    const updated = await this.notificationRepository.save(notification);
    return {
      status: 200,
      data: updated,
      message: 'Đánh dấu đã đọc thành công',
    };
  }

  // Get all pending notifications
  async getPendingNotifications() {
    const notifications = await this.notificationRepository.find({
      where: { status: NotificationStatus.PENDING },
      relations: ['booking', 'booking.customer'],
      order: { createdAt: 'ASC' },
    });
    return {
      status: 200,
      data: notifications,
      message: 'Lấy danh sách thông báo chưa đọc thành công',
    };
  }

  // Get available employees for a specific date and time slot
  // Kết hợp cả lịch làm việc (employee_schedules) và lịch đặt hẹn (bookings)
  async getAvailableEmployees(date: string, timeSlotId: string) {
    // 1. Lấy thông tin time slot để biết giờ bắt đầu
    const timeSlot = await this.timeSlotsService.findOne(timeSlotId);
    const slotStartTime =
      typeof timeSlot.startTime === 'string'
        ? timeSlot.startTime.substring(0, 5)
        : timeSlot.startTime;

    // 2. Lấy nhân viên đang làm việc vào ngày/giờ đó (từ employee_schedules)
    const scheduleResult = await this.employeeSchedulesService.getAvailableEmployees(
      date,
      slotStartTime,
    );
    const workingEmployees = scheduleResult.data; // Nhân viên có lịch làm việc
    const workingEmployeeIds = workingEmployees.map((emp: any) => emp.id);

    // 3. Lấy nhân viên đã có booking trong khung giờ này
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const bookedBookingEmployees = await this.bookingEmployeeRepository.find({
      where: {
        booking: {
          bookingDate: Between(start, end),
          timeSlotId,
          status: BookingStatus.CONFIRMED,
        },
      },
      relations: ['booking', 'employee'],
    });
    const bookedEmployeeIds = bookedBookingEmployees.map((be) => be.employeeId);

    // 4. Kết hợp: Nhân viên phải CÓ lịch làm việc VÀ chưa có booking
    const availableEmployees = workingEmployees.filter(
      (emp: any) => !bookedEmployeeIds.includes(emp.id),
    );

    // Lấy tất cả nhân viên active để tính tổng
    const allEmployees = await this.employeeRepository.find({ where: { isActive: true } });

    return {
      status: 200,
      data: {
        date,
        timeSlotId,
        totalEmployees: allEmployees.length,
        workingEmployees: workingEmployeeIds.length,
        bookedEmployees: bookedEmployeeIds.length,
        availableEmployees: availableEmployees.map((emp: any) => ({
          id: emp.id,
          fullName: emp.fullName,
          email: emp.email,
          role: emp.role,
          specialization: emp.specialization,
        })),
      },
      message: 'Lấy danh sách nhân viên khả dụng thành công',
    };
  }
}
