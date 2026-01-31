import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from './booking.entity';

@Entity('time_slots')
export class TimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'time' })
  startTime: string; // Ví dụ: '09:00:00'

  @Column({ type: 'time' })
  endTime: string; // Ví dụ: '10:00:00'

  @Column({ type: 'int', default: 5 })
  maxCapacity: number; // Số lượng khách tối đa trong 1 khung giờ

  @Column({ default: true })
  isActive: boolean; // Có thể đặt false để tắt khung giờ

  @OneToMany(() => Booking, (booking) => booking.timeSlot)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
