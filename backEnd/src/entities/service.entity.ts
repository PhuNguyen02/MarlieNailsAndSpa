import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Treatment } from './treatment.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  category: string; // Ví dụ: Gội Đầu Dưỡng Sinh, Nail, Chăm Sóc Da, Triệt Lông, Mi

  // Pricing structure
  @Column({
    type: 'enum',
    enum: ['single', 'range', 'package', 'custom'],
    default: 'single',
  })
  priceType: 'single' | 'range' | 'package' | 'custom';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  singlePrice: number; // Giá đơn lẻ (VD: 129.000đ)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceRangeMin: number; // Giá từ (VD: 120.000đ trong khoảng 120K-150K)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceRangeMax: number; // Giá đến (VD: 150.000đ)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  packagePrice: number; // Giá gói (VD: gói 10 lần)

  @Column({ type: 'int', nullable: true })
  packageSessions: number; // Số buổi trong gói (VD: 10 lần)

  // Legacy fields (kept for backward compatibility)
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  basePrice: number;

  @Column({ type: 'int', nullable: true })
  durationMinutes: number; // Thời lượng dịch vụ (phút) - for backward compatibility

  // Duration as string (VD: "35 phút", "55 phút")
  @Column({ length: 50, nullable: true })
  duration: string;

  // Service details
  @Column({ type: 'json', nullable: true })
  steps: string[]; // Các bước thực hiện dịch vụ (combo gội đầu, chăm sóc da)

  @Column({ type: 'int', nullable: true })
  stepsCount: number; // Số bước (VD: 13 bước, 14 bước)

  @Column({ length: 100, nullable: true })
  zone: string; // Vùng triệt lông (VD: Nách, Bikini, Full Body)

  @Column({ default: false })
  hasCustomDesign: boolean; // Có thiết kế tùy chỉnh (nail design)

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @OneToMany(() => Treatment, (treatment) => treatment.service)
  treatments: Treatment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
