import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeSlotDto } from './create-time-slot.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTimeSlotDto extends PartialType(CreateTimeSlotDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
