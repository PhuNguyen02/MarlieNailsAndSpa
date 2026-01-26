import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CheckAvailabilityDto {
  @IsNotEmpty({ message: 'Ngày không được để trống' })
  @IsDateString({}, { message: 'Ngày không hợp lệ' })
  date: string;

  @IsNotEmpty({ message: 'ID khung giờ không được để trống' })
  @IsUUID('4', { message: 'ID khung giờ không hợp lệ' })
  timeSlotId: string;
}
