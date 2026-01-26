import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateTimeSlotDto {
  @IsNotEmpty({ message: 'Thời gian bắt đầu không được để trống' })
  @IsString()
  startTime: string; // Format: 'HH:mm:ss' ví dụ: '09:00:00'

  @IsNotEmpty({ message: 'Thời gian kết thúc không được để trống' })
  @IsString()
  endTime: string; // Format: 'HH:mm:ss' ví dụ: '10:00:00'

  @IsInt({ message: 'Số lượng khách tối đa phải là số nguyên' })
  @Min(1, { message: 'Số lượng khách tối đa phải lớn hơn 0' })
  maxCapacity: number;
}
