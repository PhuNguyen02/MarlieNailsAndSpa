import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['percent', 'fixed', 'gift'])
  discountType?: 'percent' | 'fixed' | 'gift';

  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  badge?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdatePromotionDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['percent', 'fixed', 'gift'])
  discountType?: 'percent' | 'fixed' | 'gift';

  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  badge?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}
