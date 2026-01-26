import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { EmployeeRole } from '../../../entities/employee.entity';

export class CreateEmployeeDto {
  @IsNotEmpty({ message: 'Tên nhân viên không được để trống' })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString()
  @MaxLength(20)
  phone: string;

  @IsOptional()
  @IsEnum(EmployeeRole, { message: 'Vai trò không hợp lệ' })
  role?: EmployeeRole;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  workSchedule?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày thuê không hợp lệ' })
  hireDate?: string;
}
