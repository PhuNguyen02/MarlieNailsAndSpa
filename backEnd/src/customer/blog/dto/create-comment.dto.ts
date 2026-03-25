import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MaxLength(100)
  authorName: string;

  @IsEmail()
  authorEmail: string;

  @IsString()
  @MaxLength(2000)
  content: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}
