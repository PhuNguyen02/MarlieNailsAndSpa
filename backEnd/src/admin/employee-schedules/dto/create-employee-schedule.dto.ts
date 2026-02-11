import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  Matches,
} from 'class-validator';
import { DayOfWeek } from '../../../entities/employee-schedule.entity';

export class CreateEmployeeScheduleDto {
  @IsNotEmpty({ message: 'Employee ID không được để trống' })
  @IsString()
  employeeId: string;

  @IsOptional()
  @IsEnum(DayOfWeek, { message: 'Ngày trong tuần không hợp lệ' })
  dayOfWeek?: DayOfWeek;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày cụ thể không hợp lệ' })
  specificDate?: string;

  @IsNotEmpty({ message: 'Giờ bắt đầu không được để trống' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Giờ bắt đầu phải có định dạng HH:mm',
  })
  startTime: string;

  @IsNotEmpty({ message: 'Giờ kết thúc không được để trống' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Giờ kết thúc phải có định dạng HH:mm',
  })
  endTime: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Giờ bắt đầu nghỉ phải có định dạng HH:mm',
  })
  breakStartTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Giờ kết thúc nghỉ phải có định dạng HH:mm',
  })
  breakEndTime?: string;

  @IsOptional()
  @IsBoolean()
  isDayOff?: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}
