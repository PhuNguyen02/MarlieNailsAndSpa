import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { EmployeeSchedule, DayOfWeek } from '../../entities/employee-schedule.entity';
import { Employee } from '../../entities/employee.entity';
import { CreateEmployeeScheduleDto } from './dto/create-employee-schedule.dto';
import { UpdateEmployeeScheduleDto } from './dto/update-employee-schedule.dto';
import { BulkSetScheduleDto } from './dto/bulk-set-schedule.dto';

@Injectable()
export class EmployeeSchedulesService {
  constructor(
    @InjectRepository(EmployeeSchedule)
    private scheduleRepository: Repository<EmployeeSchedule>,

    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  // Tạo 1 schedule record
  async create(dto: CreateEmployeeScheduleDto) {
    const employee = await this.employeeRepository.findOne({
      where: { id: dto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Nhân viên với ID ${dto.employeeId} không tồn tại`);
    }

    if (!dto.dayOfWeek && !dto.specificDate) {
      throw new BadRequestException('Phải có dayOfWeek hoặc specificDate');
    }

    const scheduleData: any = {
      ...dto,
      specificDate: dto.specificDate ? new Date(dto.specificDate) : null,
      breakStartTime: dto.breakStartTime || null,
      breakEndTime: dto.breakEndTime || null,
      note: dto.note || null,
    };

    const schedule = this.scheduleRepository.create(scheduleData);
    const saved = await this.scheduleRepository.save(schedule);

    return {
      status: 200,
      data: saved,
      message: 'Tạo lịch làm việc thành công',
    };
  }

  // Set lịch tuần cho 1 nhân viên (xóa cũ, tạo mới)
  async bulkSetWeeklySchedule(dto: BulkSetScheduleDto) {
    const employee = await this.employeeRepository.findOne({
      where: { id: dto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Nhân viên với ID ${dto.employeeId} không tồn tại`);
    }

    // Xóa tất cả lịch tuần cũ (dayOfWeek-based) của nhân viên
    await this.scheduleRepository
      .createQueryBuilder()
      .delete()
      .where('employeeId = :employeeId', { employeeId: dto.employeeId })
      .andWhere('dayOfWeek IS NOT NULL')
      .execute();

    // Tạo lịch mới
    const schedules = dto.schedules.map((item) =>
      this.scheduleRepository.create({
        employeeId: dto.employeeId,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        breakStartTime: item.breakStartTime || null,
        breakEndTime: item.breakEndTime || null,
        isDayOff: item.isDayOff || false,
        note: item.note || null,
        specificDate: null,
      }),
    );

    const saved = await this.scheduleRepository.save(schedules);

    return {
      status: 200,
      data: saved,
      message: `Đã cập nhật lịch tuần cho ${employee.fullName}`,
    };
  }

  // Lấy lịch tuần của 1 nhân viên
  async getWeeklySchedule(employeeId: string) {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Nhân viên với ID ${employeeId} không tồn tại`);
    }

    const schedules = await this.scheduleRepository.find({
      where: { employeeId, specificDate: IsNull() },
      order: {
        dayOfWeek: 'ASC',
      },
    });

    // Tạo full week map với default values
    const daysOrder = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ];

    const weeklySchedule = daysOrder.map((day) => {
      const found = schedules.find((s) => s.dayOfWeek === day);
      if (found) return found;
      return {
        dayOfWeek: day,
        employeeId,
        startTime: null,
        endTime: null,
        breakStartTime: null,
        breakEndTime: null,
        isDayOff: true,
        note: null,
      };
    });

    return {
      status: 200,
      data: {
        employee: {
          id: employee.id,
          fullName: employee.fullName,
          role: employee.role,
        },
        schedules: weeklySchedule,
      },
      message: 'Lấy lịch tuần thành công',
    };
  }

  // Lấy lịch của tất cả nhân viên
  async getAllSchedules(filters?: { isActive?: boolean }) {
    const employeeQuery = this.employeeRepository.createQueryBuilder('emp');
    if (filters?.isActive !== undefined) {
      employeeQuery.where('emp.isActive = :isActive', { isActive: filters.isActive });
    }
    const employees = await employeeQuery.orderBy('emp.fullName', 'ASC').getMany();

    const allSchedules = await this.scheduleRepository.find({
      where: { specificDate: IsNull() },
      relations: ['employee'],
      order: { dayOfWeek: 'ASC' },
    });

    const daysOrder = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ];

    const result = employees.map((employee) => {
      const empSchedules = allSchedules.filter((s) => s.employeeId === employee.id);
      const weeklySchedule = daysOrder.map((day) => {
        const found = empSchedules.find((s) => s.dayOfWeek === day);
        if (found) {
          return {
            id: found.id,
            dayOfWeek: found.dayOfWeek,
            startTime: found.startTime,
            endTime: found.endTime,
            breakStartTime: found.breakStartTime,
            breakEndTime: found.breakEndTime,
            isDayOff: found.isDayOff,
            note: found.note,
          };
        }
        return {
          dayOfWeek: day,
          startTime: null,
          endTime: null,
          breakStartTime: null,
          breakEndTime: null,
          isDayOff: true,
          note: null,
        };
      });

      return {
        employee: {
          id: employee.id,
          fullName: employee.fullName,
          role: employee.role,
          isActive: employee.isActive,
        },
        schedules: weeklySchedule,
      };
    });

    return {
      status: 200,
      data: result,
      message: 'Lấy lịch tất cả nhân viên thành công',
    };
  }

  // Lấy nhân viên available vào 1 ngày + giờ cụ thể
  async getAvailableEmployees(date: string, time: string) {
    const dayOfWeek = this.getDayOfWeekFromDate(date);

    // Tìm nhân viên có lịch làm việc vào ngày đó
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.employee', 'employee')
      .where('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere('schedule.isDayOff = :isDayOff', { isDayOff: false })
      .andWhere('employee.isActive = :isActive', { isActive: true })
      .andWhere('schedule.startTime <= :time', { time })
      .andWhere('schedule.endTime >= :time', { time })
      .getMany();

    // Lọc ra nhân viên đang nghỉ trưa
    const available = schedules.filter((s) => {
      if (s.breakStartTime && s.breakEndTime) {
        return time < s.breakStartTime || time >= s.breakEndTime;
      }
      return true;
    });

    // Check nếu có specificDate override (ngày nghỉ riêng)
    const specificDayOffs = await this.scheduleRepository.find({
      where: {
        specificDate: new Date(date),
        isDayOff: true,
      },
    });
    const dayOffEmployeeIds = specificDayOffs.map((s) => s.employeeId);

    const finalAvailable = available
      .filter((s) => !dayOffEmployeeIds.includes(s.employeeId))
      .map((s) => s.employee);

    return {
      status: 200,
      data: finalAvailable,
      message: 'Lấy danh sách nhân viên khả dụng thành công',
    };
  }

  // Update 1 schedule
  async update(id: string, dto: UpdateEmployeeScheduleDto) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule với ID ${id} không tồn tại`);
    }

    Object.assign(schedule, dto);
    if (dto.specificDate) {
      schedule.specificDate = new Date(dto.specificDate);
    }

    const updated = await this.scheduleRepository.save(schedule);
    return {
      status: 200,
      data: updated,
      message: 'Cập nhật lịch thành công',
    };
  }

  // Xóa 1 schedule
  async remove(id: string) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule với ID ${id} không tồn tại`);
    }
    await this.scheduleRepository.remove(schedule);
    return {
      status: 200,
      data: {},
      message: 'Xóa lịch thành công',
    };
  }

  // Helper: chuyển date string thành DayOfWeek
  private getDayOfWeekFromDate(dateStr: string): DayOfWeek {
    const date = new Date(dateStr);
    const dayIndex = date.getDay(); // 0=Sunday, 1=Monday...
    const mapping: Record<number, DayOfWeek> = {
      0: DayOfWeek.SUNDAY,
      1: DayOfWeek.MONDAY,
      2: DayOfWeek.TUESDAY,
      3: DayOfWeek.WEDNESDAY,
      4: DayOfWeek.THURSDAY,
      5: DayOfWeek.FRIDAY,
      6: DayOfWeek.SATURDAY,
    };
    return mapping[dayIndex];
  }
}
