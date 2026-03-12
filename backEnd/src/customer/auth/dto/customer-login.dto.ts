import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CustomerLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}
