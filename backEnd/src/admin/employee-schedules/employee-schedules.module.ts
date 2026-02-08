import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeSchedule } from '../../entities/employee-schedule.entity';
import { Employee } from '../../entities/employee.entity';
import { EmployeeSchedulesService } from './employee-schedules.service';
import { EmployeeSchedulesController } from './employee-schedules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeSchedule, Employee])],
  controllers: [EmployeeSchedulesController],
  providers: [EmployeeSchedulesService],
  exports: [EmployeeSchedulesService],
})
export class EmployeeSchedulesModule {}
