import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { EmployeeSchedulesService } from './employee-schedules.service';
import { CreateEmployeeScheduleDto } from './dto/create-employee-schedule.dto';
import { UpdateEmployeeScheduleDto } from './dto/update-employee-schedule.dto';
import { BulkSetScheduleDto } from './dto/bulk-set-schedule.dto';

@Controller('admin/employee-schedules')
export class EmployeeSchedulesController {
  constructor(private readonly schedulesService: EmployeeSchedulesService) {}

  // POST /api/admin/employee-schedules
  @Post()
  create(@Body() dto: CreateEmployeeScheduleDto) {
    return this.schedulesService.create(dto);
  }

  // POST /api/admin/employee-schedules/bulk
  @Post('bulk')
  bulkSet(@Body() dto: BulkSetScheduleDto) {
    return this.schedulesService.bulkSetWeeklySchedule(dto);
  }

  // GET /api/admin/employee-schedules
  @Get()
  getAllSchedules(@Query('isActive') isActive?: string) {
    const filters: { isActive?: boolean } = {};
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    return this.schedulesService.getAllSchedules(filters);
  }

  // GET /api/admin/employee-schedules/employee/:employeeId
  @Get('employee/:employeeId')
  getByEmployee(@Param('employeeId') employeeId: string) {
    return this.schedulesService.getWeeklySchedule(employeeId);
  }

  // GET /api/admin/employee-schedules/available?date=2025-01-20&time=10:00
  @Get('available')
  getAvailable(@Query('date') date: string, @Query('time') time: string) {
    return this.schedulesService.getAvailableEmployees(date, time);
  }

  // PATCH /api/admin/employee-schedules/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeScheduleDto) {
    return this.schedulesService.update(id, dto);
  }

  // DELETE /api/admin/employee-schedules/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }
}
