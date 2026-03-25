import { Controller, Get } from '@nestjs/common';
import { EmployeesService } from '../../admin/employees/employees.service';

@Controller('employees')
export class PublicEmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Get('active')
  getActive() {
    // Giả sử service có methodfindAll hoặc chúng ta sẽ thêm method getActive
    return this.service.findAll();
  }
}
