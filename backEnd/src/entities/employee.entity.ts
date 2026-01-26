import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from './booking.entity';
import { BookingEmployee } from './booking-employee.entity';

export enum EmployeeRole {
  THERAPIST = 'therapist',
  RECEPTIONIST = 'receptionist',
  MANAGER = 'manager',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: EmployeeRole,
    default: EmployeeRole.THERAPIST,
  })
  role: EmployeeRole;

  @Column({ type: 'text', nullable: true })
  specialization: string; // Chuyên môn

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  workSchedule: string; // JSON string hoặc text mô tả lịch làm việc

  @Column({ type: 'date', nullable: true })
  hireDate: Date;

  @OneToMany(() => Booking, (booking) => booking.employee)
  bookings: Booking[];

  @OneToMany(() => BookingEmployee, (bookingEmployee) => bookingEmployee.employee)
  bookingEmployees: BookingEmployee[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
