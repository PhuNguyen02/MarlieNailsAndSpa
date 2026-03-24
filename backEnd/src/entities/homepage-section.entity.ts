import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SectionType {
  HERO = 'hero',
  SERVICES = 'services',
  USP = 'usp',
  PROMOTION = 'promotion',
  BLOG = 'blog',
  ABOUT = 'about',
  WELLNESS = 'wellness',
  WORKING_HOURS = 'working_hours',
  PRICING = 'pricing',
  TESTIMONIALS = 'testimonials',
  CUSTOM = 'custom',
}

@Entity('homepage_sections')
export class HomepageSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SectionType,
  })
  type: SectionType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  subtitle: string;

  @Column({ type: 'longtext', nullable: true })
  content: string; // HTML content from text editor

  @Column({ length: 255, nullable: true })
  imageUrl: string;

  @Column({ type: 'json', nullable: true })
  config: any; // Extra configuration (colors, button links, etc.)

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
