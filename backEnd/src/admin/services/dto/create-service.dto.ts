import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsInt,
  IsEnum,
  IsArray,
  IsBoolean,
  ValidateIf,
} from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty({ message: 'Tên dịch vụ không được để trống' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  // Price Type
  @IsOptional()
  @IsEnum(['single', 'range', 'package', 'custom'], {
    message: 'Loại giá phải là: single, range, package, hoặc custom',
  })
  priceType?: 'single' | 'range' | 'package' | 'custom';

  // Single Price
  @ValidateIf((o) => o.priceType === 'single')
  @IsNumber({}, { message: 'Giá đơn lẻ phải là số' })
  @Min(0, { message: 'Giá đơn lẻ phải lớn hơn hoặc bằng 0' })
  singlePrice?: number;

  // Price Range
  @ValidateIf((o) => o.priceType === 'range')
  @IsNumber({}, { message: 'Giá tối thiểu phải là số' })
  @Min(0, { message: 'Giá tối thiểu phải lớn hơn hoặc bằng 0' })
  priceRangeMin?: number;

  @ValidateIf((o) => o.priceType === 'range')
  @IsNumber({}, { message: 'Giá tối đa phải là số' })
  @Min(0, { message: 'Giá tối đa phải lớn hơn hoặc bằng 0' })
  priceRangeMax?: number;

  // Package Price
  @ValidateIf((o) => o.priceType === 'package')
  @IsNumber({}, { message: 'Giá gói phải là số' })
  @Min(0, { message: 'Giá gói phải lớn hơn hoặc bằng 0' })
  packagePrice?: number;

  @ValidateIf((o) => o.priceType === 'package')
  @IsInt({ message: 'Số buổi trong gói phải là số nguyên' })
  @Min(1, { message: 'Số buổi trong gói phải lớn hơn 0' })
  packageSessions?: number;

  // Legacy fields (for backward compatibility)
  @IsOptional()
  @IsNumber({}, { message: 'Giá cơ bản phải là số' })
  @Min(0, { message: 'Giá cơ bản phải lớn hơn hoặc bằng 0' })
  basePrice?: number;

  @IsOptional()
  @IsInt({ message: 'Thời lượng phải là số nguyên' })
  @Min(1, { message: 'Thời lượng phải lớn hơn 0' })
  durationMinutes?: number;

  // Duration as string
  @IsOptional()
  @IsString()
  duration?: string;

  // Service details
  @IsOptional()
  @IsArray({ message: 'Các bước thực hiện phải là mảng' })
  @IsString({ each: true, message: 'Mỗi bước phải là chuỗi' })
  steps?: string[];

  @IsOptional()
  @IsInt({ message: 'Số bước phải là số nguyên' })
  @Min(1, { message: 'Số bước phải lớn hơn 0' })
  stepsCount?: number;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsBoolean()
  hasCustomDesign?: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
