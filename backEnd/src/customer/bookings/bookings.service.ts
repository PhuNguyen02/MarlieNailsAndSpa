import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, In } from 'typeorm';
import { Booking, BookingStatus } from '../../entities/booking.entity';
import { Employee } from '../../entities/employee.entity';
import { BookingEmployee } from '../../entities/booking-employee.entity';
import {
  BookingNotification,
  NotificationType,
  NotificationStatus,
} from '../../entities/booking-notification.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { TimeSlotsService } from '../../admin/time-slots/time-slots.service';
import { CustomersService } from '../customers/customers.service';

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
    private timeSlotsService: TimeSlotsService,
    private customersService: CustomersService,
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

    // Check if customer exists
    await this.customersService.findOne(customerId);

    // Check time slot availability
    const availability = await this.timeSlotsService.checkAvailability(timeSlotId, numberOfGuests);

    if (!availability.available) {
      throw new ConflictException(availability.message);
    }

    // Validate employeeIds
    if (employeeIds && employeeIds.length > 0) {
      // Số lượng nhân viên chọn không được vượt quá số lượng khách
      if (employeeIds.length > numberOfGuests) {
        throw new BadRequestException(
          `Số lượng nhân viên (${employeeIds.length}) không được vượt quá số lượng khách (${numberOfGuests})`,
        );
      }

      // Kiểm tra danh sách nhân viên available
      const availableEmployeesResult = await this.getAvailableEmployees(bookingDate, timeSlotId);
      const availableEmployeeIds = availableEmployeesResult.data.availableEmployees.map(
        (emp: any) => emp.id,
      );

      // Kiểm tra xem có đủ nhân viên available không
      if (employeeIds.length > availableEmployeesResult.data.availableEmployees.length) {
        throw new ConflictException(
          `Chỉ còn ${availableEmployeesResult.data.availableEmployees.length} nhân viên trống trong khung giờ này`,
        );
      }

      // Kiểm tra từng nhân viên có available không
      for (const empId of employeeIds) {
        if (!availableEmployeeIds.includes(empId)) {
          const employee = await this.employeeRepository.findOne({ where: { id: empId } });
          throw new ConflictException(
            `Nhân viên ${employee?.fullName || empId} đã có lịch hẹn trong khung giờ này`,
          );
        }
      }

      // Kiểm tra trùng lặp trong danh sách
      const uniqueEmployeeIds = [...new Set(employeeIds)];
      if (uniqueEmployeeIds.length !== employeeIds.length) {
        throw new BadRequestException('Danh sách nhân viên có ID trùng lặp');
      }
    }

    // Check for double booking (same customer, same date, same time slot)
    const existingBooking = await this.bookingRepository.findOne({
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

    // Create booking
    const booking = this.bookingRepository.create({
      ...rest,
      customerId,
      bookingDate: new Date(bookingDate),
      timeSlotId,
      numberOfGuests,
      totalPrice,
      status: BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Tạo quan hệ booking-employee
    if (employeeIds && employeeIds.length > 0) {
      for (const empId of employeeIds) {
        const bookingEmployee = this.bookingEmployeeRepository.create({
          bookingId: savedBooking.id,
          employeeId: empId,
        });
        await this.bookingEmployeeRepository.save(bookingEmployee);
      }
    }

    // Increment time slot bookings
    await this.timeSlotsService.incrementBookings(timeSlotId, numberOfGuests);

    // Create notification
    await this.createNotification(
      savedBooking.id,
      NotificationType.BOOKING_CREATED,
      'Đặt lịch thành công',
      `Bạn đã đặt lịch thành công cho ${numberOfGuests} người vào ngày ${bookingDate}`,
    );

    const result = await this.findOne(savedBooking.id);
    return {
      status: 200,
      data: result,
      message: 'Tạo booking thành công',
    };
  }

  async findAll(filters?: { status?: BookingStatus; date?: string; customerId?: string }) {
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

    if (filters?.date) {
      const date = new Date(filters.date);
      query.andWhere('booking.bookingDate = :date', { date });
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
      await this.timeSlotsService.decrementBookings(booking.timeSlotId, booking.numberOfGuests);

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
      await this.timeSlotsService.decrementBookings(booking.timeSlotId, booking.numberOfGuests);
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

    // Get bookings for this date and time slot
    const bookings = await this.bookingRepository.find({
      where: {
        bookingDate: new Date(date),
        timeSlotId,
        status: BookingStatus.CONFIRMED,
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

  // Get available time slots for a specific date
  async getAvailableTimeSlots(date: string) {
    const allTimeSlots = await this.timeSlotsService.findActive();

    const availability = await Promise.all(
      allTimeSlots.map(async (slot) => {
        const avail = await this.checkAvailability(date, slot.id);
        return avail.data;
      }),
    );

    const availableSlots = availability.filter((a) => a.isAvailable);
    return {
      status: 200,
      data: availableSlots,
      message: 'Lấy danh sách khung giờ khả dụng thành công',
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
  async getAvailableEmployees(date: string, timeSlotId: string) {
    // Get all active employees
    const allEmployees = await this.employeeRepository.find({
      where: { isActive: true },
    });

    // Get employees already booked for this time slot and date through bookingEmployees table
    const bookedBookingEmployees = await this.bookingEmployeeRepository.find({
      where: {
        booking: {
          bookingDate: new Date(date),
          timeSlotId,
          status: BookingStatus.CONFIRMED,
        },
      },
      relations: ['booking', 'employee'],
    });

    const bookedEmployeeIds = bookedBookingEmployees.map((be) => be.employeeId);

    // Filter out booked employees
    const availableEmployees = allEmployees.filter(
      (employee) => !bookedEmployeeIds.includes(employee.id),
    );

    return {
      status: 200,
      data: {
        date,
        timeSlotId,
        totalEmployees: allEmployees.length,
        bookedEmployees: bookedEmployeeIds.length,
        availableEmployees: availableEmployees.map((emp) => ({
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
