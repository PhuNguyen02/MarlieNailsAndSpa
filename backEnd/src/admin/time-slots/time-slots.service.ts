import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from '../../entities/time-slot.entity';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
  ) {}

  async create(createTimeSlotDto: CreateTimeSlotDto) {
    const timeSlot = this.timeSlotRepository.create(createTimeSlotDto);
    const saved = await this.timeSlotRepository.save(timeSlot);
    return {
      status: 200,
      data: saved,
      message: 'Tạo khung giờ thành công',
    };
  }

  async findAll() {
    const timeSlots = await this.timeSlotRepository.find({
      order: { startTime: 'ASC' },
    });
    return {
      status: 200,
      data: timeSlots,
      message: 'Lấy danh sách khung giờ thành công',
    };
  }

  async findActive() {
    return this.timeSlotRepository.find({
      where: { isActive: true },
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: string) {
    const timeSlot = await this.timeSlotRepository.findOne({
      where: { id },
    });

    if (!timeSlot) {
      throw new NotFoundException(`TimeSlot với ID ${id} không tồn tại`);
    }

    return timeSlot;
  }

  async findOneFormatted(id: string) {
    const timeSlot = await this.findOne(id);
    return {
      status: 200,
      data: timeSlot,
      message: 'Lấy thông tin khung giờ thành công',
    };
  }

  async update(id: string, updateTimeSlotDto: UpdateTimeSlotDto) {
    const timeSlot = await this.findOne(id);
    Object.assign(timeSlot, updateTimeSlotDto);
    const updated = await this.timeSlotRepository.save(timeSlot);
    return {
      status: 200,
      data: updated,
      message: 'Cập nhật khung giờ thành công',
    };
  }

  async remove(id: string) {
    const timeSlot = await this.findOne(id);
    await this.timeSlotRepository.remove(timeSlot);
    return {
      status: 200,
      data: {},
      message: 'Xóa khung giờ thành công',
    };
  }

  // Check if time slot is available for booking
  async checkAvailability(timeSlotId: string, numberOfGuests: number) {
    const timeSlot = await this.findOne(timeSlotId);

    if (!timeSlot.isActive) {
      return {
        available: false,
        message: 'Khung giờ này hiện không hoạt động',
      };
    }

    const availableSlots = timeSlot.maxCapacity - timeSlot.currentBookings;

    if (availableSlots >= numberOfGuests) {
      return {
        available: true,
        availableSlots,
        message: `Còn ${availableSlots} chỗ trống`,
      };
    }

    return {
      available: false,
      availableSlots,
      message: `Chỉ còn ${availableSlots} chỗ trống, không đủ cho ${numberOfGuests} khách`,
    };
  }

  // Increment current bookings
  async incrementBookings(timeSlotId: string, numberOfGuests: number) {
    const timeSlot = await this.findOne(timeSlotId);
    timeSlot.currentBookings += numberOfGuests;

    // Disable time slot if full
    if (timeSlot.currentBookings >= timeSlot.maxCapacity) {
      timeSlot.isActive = false;
    }

    return this.timeSlotRepository.save(timeSlot);
  }

  // Decrement current bookings (when booking is cancelled)
  async decrementBookings(timeSlotId: string, numberOfGuests: number) {
    const timeSlot = await this.findOne(timeSlotId);
    timeSlot.currentBookings -= numberOfGuests;

    // Re-enable time slot if it was full
    if (timeSlot.currentBookings < timeSlot.maxCapacity) {
      timeSlot.isActive = true;
    }

    return this.timeSlotRepository.save(timeSlot);
  }
}
