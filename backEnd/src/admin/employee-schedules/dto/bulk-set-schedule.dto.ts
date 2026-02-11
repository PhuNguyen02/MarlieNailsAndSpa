import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsBoolean,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayOfWeek } from '../../../entities/employee-schedule.entity';

export class ScheduleItemDto {
  @IsEnum(DayOfWeek, { message: 'Ngày trong tuần không hợp lệ' })
  dayOfWeek: DayOfWeek;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Giờ bắt đầu phải có định dạng HH:mm',
  })
  startTime: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Giờ kết thúc phải có định dạng HH:mm',
  })
  endTime: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  breakStartTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  breakEndTime?: string;

  @IsOptional()
  @IsBoolean()
  isDayOff?: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}

export class BulkSetScheduleDto {
  @IsNotEmpty({ message: 'Employee ID không được để trống' })
  @IsString()
  employeeId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleItemDto)
  schedules: ScheduleItemDto[];
}
