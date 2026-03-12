import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from '../../entities/employee.entity';
import { PublicEmployeesController } from '../../customer/employees/public-employees.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeesService],
  controllers: [EmployeesController, PublicEmployeesController],
  exports: [EmployeesService],
})
export class EmployeesModule {}
