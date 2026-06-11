import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from '../../entities/employee.entity';
import { Booking } from '../../entities/booking.entity';
import { BookingEmployee } from '../../entities/booking-employee.entity';
import { EmployeeSchedule } from '../../entities/employee-schedule.entity';
import { PublicEmployeesController } from '../../customer/employees/public-employees.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Booking, BookingEmployee, EmployeeSchedule])],
  providers: [EmployeesService],
  controllers: [EmployeesController, PublicEmployeesController],
  exports: [EmployeesService],
})
export class EmployeesModule {}
