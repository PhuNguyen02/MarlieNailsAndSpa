import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    // Check if email already exists
    const existingEmployee = await this.employeeRepository.findOne({
      where: { email: createEmployeeDto.email },
    });

    if (existingEmployee) {
      throw new ConflictException('Email đã tồn tại');
    }

    const employeeData: any = {
      ...createEmployeeDto,
    };

    if (createEmployeeDto.hireDate) {
      employeeData.hireDate = new Date(createEmployeeDto.hireDate);
    }

    const employee = this.employeeRepository.create(employeeData);

    const saved = await this.employeeRepository.save(employee);
    return {
      status: 200,
      data: saved,
      message: 'Tạo nhân viên thành công',
    };
  }

  async findAll(filters?: { role?: string; isActive?: boolean }) {
    const query = this.employeeRepository.createQueryBuilder('employee');

    if (filters?.role) {
      query.andWhere('employee.role = :role', { role: filters.role });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('employee.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    const employees = await query.orderBy('employee.fullName', 'ASC').getMany();
    return {
      status: 200,
      data: employees,
      message: 'Lấy danh sách nhân viên thành công',
    };
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['bookings'],
    });

    if (!employee) {
      throw new NotFoundException(`Nhân viên với ID ${id} không tồn tại`);
    }

    return employee;
  }

  async findOneFormatted(id: string) {
    const employee = await this.findOne(id);
    return {
      status: 200,
      data: employee,
      message: 'Lấy thông tin nhân viên thành công',
    };
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);

    // Check if email is being updated and if it already exists
    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const existingEmployee = await this.employeeRepository.findOne({
        where: { email: updateEmployeeDto.email },
      });

      if (existingEmployee) {
        throw new ConflictException('Email đã tồn tại');
      }
    }

    Object.assign(employee, updateEmployeeDto);

    if (updateEmployeeDto.hireDate) {
      employee.hireDate = new Date(updateEmployeeDto.hireDate);
    }

    const updated = await this.employeeRepository.save(employee);
    return {
      status: 200,
      data: updated,
      message: 'Cập nhật nhân viên thành công',
    };
  }

  async remove(id: string) {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
    return {
      status: 200,
      data: {},
      message: 'Xóa nhân viên thành công',
    };
  }
}
