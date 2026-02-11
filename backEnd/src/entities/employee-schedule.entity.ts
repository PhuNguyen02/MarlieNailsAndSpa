import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Employee } from './employee.entity';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Entity('employee_schedules')
@Unique(['employeeId', 'dayOfWeek', 'specificDate'])
export class EmployeeSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employee, (employee) => employee.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: string;

  // Ngày trong tuần (cho lịch lặp lại hàng tuần)
  @Column({
    type: 'enum',
    enum: DayOfWeek,
    nullable: true,
  })
  dayOfWeek: DayOfWeek | null;

  // Ngày cụ thể (cho lịch đặc biệt / ngày nghỉ riêng)
  @Column({ type: 'date', nullable: true })
  specificDate: Date | null;

  // Giờ bắt đầu làm việc
  @Column({ type: 'time' })
  startTime: string; // VD: '09:00'

  // Giờ kết thúc làm việc
  @Column({ type: 'time' })
  endTime: string; // VD: '18:00'

  // Nghỉ trưa / break
  @Column({ type: 'time', nullable: true })
  breakStartTime: string | null; // VD: '12:00'

  @Column({ type: 'time', nullable: true })
  breakEndTime: string | null; // VD: '13:00'

  // Ngày nghỉ (nếu true, nhân viên nghỉ ngày này)
  @Column({ default: false })
  isDayOff: boolean;

  // Ghi chú
  @Column({ type: 'text', nullable: true })
  note: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
