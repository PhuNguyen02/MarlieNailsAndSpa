import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Employee } from './employee.entity';
import { Service } from './service.entity';
import { Treatment } from './treatment.entity';
import { TimeSlot } from './time-slot.entity';
import { BookingNotification } from './booking-notification.entity';
import { BookingEmployee } from './booking-employee.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Thông tin khách hàng
  @ManyToOne(() => Customer, (customer) => customer.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  // Dịch vụ
  @ManyToOne(() => Service, { nullable: true })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column({ nullable: true })
  serviceId: string;

  // Liệu trình (optional)
  @ManyToOne(() => Treatment, { nullable: true })
  @JoinColumn({ name: 'treatmentId' })
  treatment: Treatment;

  @Column({ nullable: true })
  treatmentId: string;

  // Nhân viên phụ trách (legacy - giữ lại để tương thích)
  @ManyToOne(() => Employee, (employee) => employee.bookings, {
    nullable: true,
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ nullable: true })
  employeeId: string;

  // Danh sách nhân viên phụ trách (many-to-many)
  @OneToMany(() => BookingEmployee, (bookingEmployee) => bookingEmployee.booking, {
    cascade: true,
  })
  bookingEmployees: BookingEmployee[];

  // Thông tin thời gian
  @Column({ type: 'date' })
  bookingDate: Date;

  @ManyToOne(() => TimeSlot, (timeSlot) => timeSlot.bookings)
  @JoinColumn({ name: 'timeSlotId' })
  timeSlot: TimeSlot;

  @Column()
  timeSlotId: string;

  @Column({ type: 'int', default: 1 })
  numberOfGuests: number; // Số lượng khách

  // Trạng thái
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  // Giá
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  // Ghi chú
  @Column({ type: 'text', nullable: true })
  notes: string;

  // Thông tin hủy
  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ nullable: true })
  cancelledAt: Date;

  // Thông báo
  @OneToMany(() => BookingNotification, (notification) => notification.booking)
  notifications: BookingNotification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
