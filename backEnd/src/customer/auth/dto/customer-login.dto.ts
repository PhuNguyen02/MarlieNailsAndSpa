import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CustomerLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @Matches(/^(84|0[35789])[0-9]{8}$/, { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}
