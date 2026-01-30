import { DataSource } from 'typeorm';
import { Service } from '../../entities/service.entity';
import { Employee, EmployeeRole } from '../../entities/employee.entity';
import { TimeSlot } from '../../entities/time-slot.entity';

export const seedInitialData = async (dataSource: DataSource) => {
  console.log('🌱 Bắt đầu seeding dữ liệu mẫu...');

  const serviceRepo = dataSource.getRepository(Service);
  const employeeRepo = dataSource.getRepository(Employee);
  const timeSlotRepo = dataSource.getRepository(TimeSlot);

  // 1. Seed Services
  const services = [
    {
      name: 'Cắt da tay/chân',
      description: 'Làm sạch da, cắt móng gọn gàng',
      singlePrice: 50000,
      priceType: 'single' as const,
      duration: '30 phút',
      durationMinutes: 30,
      category: 'Nail Care',
    },
    {
      name: 'Sơn Gel',
      description: 'Sơn gel cao cấp, bền màu',
      singlePrice: 150000,
      priceType: 'single' as const,
      duration: '45 phút',
      durationMinutes: 45,
      category: 'Nail Art',
    },
    {
      name: 'Massage Body',
      description: 'Massage toàn thân thư giãn với tinh dầu',
      singlePrice: 350000,
      priceType: 'single' as const,
      duration: '60 phút',
      durationMinutes: 60,
      category: 'Spa',
    },
    {
      name: 'Gội đầu dưỡng sinh',
      description: 'Gội đầu thảo dược kết hợp massage cổ vai gáy',
      singlePrice: 120000,
      priceType: 'single' as const,
      duration: '45 phút',
      durationMinutes: 45,
      category: 'Hair',
    },
  ];

  for (const s of services) {
    const existing = await serviceRepo.findOne({ where: { name: s.name } });
    if (!existing) {
      // @ts-ignore
      await serviceRepo.save(serviceRepo.create(s));
    }
  }
  console.log('✅ Services seeded');

  // 2. Seed Employees
  const employees = [
    {
      fullName: 'Nguyễn Thị Lan',
      email: 'lan.nguyen@example.com',
      phone: '0901234567',
      role: EmployeeRole.THERAPIST,
      specialization: 'Nail Care, Nail Art',
      isActive: true,
    },
    {
      fullName: 'Trần Văn Hùng',
      email: 'hung.tran@example.com',
      phone: '0901234568',
      role: EmployeeRole.THERAPIST,
      specialization: 'Massage, Hair',
      isActive: true,
    },
    {
      fullName: 'Lê Thị Mai',
      email: 'mai.le@example.com',
      phone: '0901234569',
      role: EmployeeRole.MANAGER,
      specialization: 'All',
      isActive: true,
    },
    {
      fullName: 'Phạm Thu Hương',
      email: 'huong.pham@example.com',
      phone: '0901234570',
      role: EmployeeRole.THERAPIST,
      specialization: 'Nail Care',
      isActive: true,
    },
    {
      fullName: 'Hoàng Văn Nam',
      email: 'nam.hoang@example.com',
      phone: '0901234571',
      role: EmployeeRole.THERAPIST,
      specialization: 'Hair',
      isActive: true,
    },
  ];

  for (const e of employees) {
    const existing = await employeeRepo.findOne({ where: { email: e.email } });
    if (!existing) {
      await employeeRepo.save(employeeRepo.create(e));
    }
  }
  console.log('✅ Employees seeded');

  // 3. Seed Time Slots (09:00 - 18:00)
  const timeSlots = [
    { startTime: '09:00:00', endTime: '10:00:00' },
    { startTime: '10:00:00', endTime: '11:00:00' },
    { startTime: '11:00:00', endTime: '12:00:00' },
    { startTime: '12:00:00', endTime: '13:00:00' },
    { startTime: '13:00:00', endTime: '14:00:00' },
    { startTime: '14:00:00', endTime: '15:00:00' },
    { startTime: '15:00:00', endTime: '16:00:00' },
    { startTime: '16:00:00', endTime: '17:00:00' },
    { startTime: '17:00:00', endTime: '18:00:00' },
  ];

  for (const ts of timeSlots) {
    const existing = await timeSlotRepo.findOne({
      where: { startTime: ts.startTime },
    });
    if (!existing) {
      await timeSlotRepo.save(
        timeSlotRepo.create({
          ...ts,
          maxCapacity: 5, // Default capacity
          isActive: true,
        }),
      );
    }
  }
  console.log('✅ TimeSlots seeded');

  console.log('🏁 Seeding hoàn tất!');
};
