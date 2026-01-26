import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsDateString,
  IsUUID,
  IsNumber,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'ID khách hàng không được để trống' })
  @IsUUID('4', { message: 'ID khách hàng không hợp lệ' })
  customerId: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID dịch vụ không hợp lệ' })
  serviceId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID liệu trình không hợp lệ' })
  treatmentId?: string;

  @IsOptional()
  @IsArray({ message: 'Danh sách ID nhân viên phải là mảng' })
  @IsUUID('4', { each: true, message: 'ID nhân viên không hợp lệ' })
  @ArrayMaxSize(10, { message: 'Số lượng nhân viên tối đa là 10' })
  employeeIds?: string[];

  @IsNotEmpty({ message: 'Ngày đặt lịch không được để trống' })
  @IsDateString({}, { message: 'Ngày đặt lịch không hợp lệ' })
  bookingDate: string;

  @IsNotEmpty({ message: 'ID khung giờ không được để trống' })
  @IsUUID('4', { message: 'ID khung giờ không hợp lệ' })
  timeSlotId: string;

  @IsNotEmpty({ message: 'Số lượng khách không được để trống' })
  @IsInt({ message: 'Số lượng khách phải là số nguyên' })
  @Min(1, { message: 'Số lượng khách phải lớn hơn 0' })
  numberOfGuests: number;

  @IsNotEmpty({ message: 'Tổng giá không được để trống' })
  @IsNumber({}, { message: 'Tổng giá phải là số' })
  @Min(0, { message: 'Tổng giá phải lớn hơn hoặc bằng 0' })
  totalPrice: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
