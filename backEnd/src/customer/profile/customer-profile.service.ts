import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../entities/customer.entity';
import { Booking } from '../../entities/booking.entity';

@Injectable()
export class CustomerProfileService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async getProfile(customerId: string) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');
    return {
      status: 200,
      data: customer,
      message: 'Lấy thông tin cá nhân thành công',
    };
  }

  async updateProfile(customerId: string, updateData: any) {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');

    // Không cho phép sửa số điện thoại để đảm bảo tính duy nhất và đồng bộ
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { phone, ...allowedData } = updateData;

    Object.assign(customer, allowedData);
    const saved = await this.customerRepository.save(customer);

    return {
      status: 200,
      data: saved,
      message: 'Cập nhật thông tin thành công',
    };
  }

  async getMyBookings(customerId: string, status?: string) {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('booking.employee', 'employee')
      .leftJoinAndSelect('booking.timeSlot', 'timeSlot')
      .where('booking.customerId = :customerId', { customerId });

    if (status) {
      query.andWhere('booking.status = :status', { status });
    }

    const bookings = await query
      .orderBy('booking.bookingDate', 'DESC')
      .addOrderBy('timeSlot.startTime', 'DESC')
      .getMany();

    return {
      status: 200,
      data: bookings,
      message: 'Lấy lịch sử lịch hẹn thành công',
    };
  }
}
