import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, Not } from 'typeorm';
import { Booking, BookingStatus } from '../../entities/booking.entity';
import { Customer } from '../../entities/customer.entity';
import { TimeSlot } from '../../entities/time-slot.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(TimeSlot)
    private readonly timeSlotRepository: Repository<TimeSlot>,
  ) {}

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Today's Bookings
    const todayBookingsCount = await this.bookingRepository.count({
      where: {
        bookingDate: Between(today, tomorrow),
        status: Not(BookingStatus.CANCELLED),
      },
    });

    // 2. Total Revenue (Completed Bookings)
    const completedBookings = await this.bookingRepository.find({
      where: { status: BookingStatus.COMPLETED },
      select: ['totalPrice'],
    });
    const totalRevenue = completedBookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);

    // 3. New Customers (Registered in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCustomersCount = await this.customerRepository.count({
      where: { createdAt: MoreThanOrEqual(thirtyDaysAgo) },
    });

    // 4. Current Capacity (Occupancy rate for today)
    const totalSlots = await this.timeSlotRepository.count({ where: { isActive: true } });
    const occupancyRate = totalSlots > 0 ? (todayBookingsCount / totalSlots) * 100 : 0;

    // 5. Recent Activities
    const recentBookings = await this.bookingRepository.find({
      relations: ['customer', 'service'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      todayBookings: todayBookingsCount,
      totalRevenue: totalRevenue,
      newCustomers: newCustomersCount,
      occupancyRate: Math.round(occupancyRate),
      recentActivities: recentBookings.map(b => ({
        id: b.id,
        customerName: b.customer?.fullName || 'Khách',
        serviceName: b.service?.name || 'Dịch vụ',
        status: b.status,
        createdAt: b.createdAt,
      })),
    };
  }
}
