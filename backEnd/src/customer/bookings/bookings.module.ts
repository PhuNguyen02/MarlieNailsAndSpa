import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from '../../entities/booking.entity';
import { BookingNotification } from '../../entities/booking-notification.entity';
import { BookingEmployee } from '../../entities/booking-employee.entity';
import { Employee } from '../../entities/employee.entity';
import { TimeSlotsModule } from '../../admin/time-slots/time-slots.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingNotification, BookingEmployee, Employee]),
    TimeSlotsModule,
    CustomersModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
