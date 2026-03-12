import { IsString, IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  subject: string;

  @IsString()
  @MinLength(10)
  message: string;
}
