import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../config/typeorm.config';

async function seedToday() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  console.log('🌱 Seeding bookings for 2026-01-27...');

  try {
    const customerRepo = dataSource.getRepository('Customer');
    const serviceRepo = dataSource.getRepository('Service');
    const employeeRepo = dataSource.getRepository('Employee');
    const timeSlotRepo = dataSource.getRepository('TimeSlot');
    const bookingRepo = dataSource.getRepository('Booking');
    const bookingEmployeeRepo = dataSource.getRepository('BookingEmployee');

    // 1. Ensure we have data
    let customers = await customerRepo.find();
    if (customers.length === 0) {
      customers = [
        await customerRepo.save({
          fullName: 'Khách Hàng Thử Nghiệm',
          phone: '0987654321',
          email: 'test@example.com',
        }),
      ];
    }

    let services = await serviceRepo.find();
    if (services.length === 0) {
      services = [
        await serviceRepo.save({
          name: 'Gội đầu dưỡng sinh',
          category: 'Gội Đầu',
          priceType: 'single',
          singlePrice: 100000,
          isActive: true,
        }),
      ];
    }

    let employees = await employeeRepo.find({ where: { role: 'therapist', isActive: true } });
    if (employees.length === 0) {
      employees = [
        await employeeRepo.save({
          fullName: 'Nhân Viên A',
          role: 'therapist',
          isActive: true,
        }),
      ];
    }

    let timeSlots = await timeSlotRepo.find({ where: { isActive: true } });
    if (timeSlots.length === 0) {
      timeSlots = [
        await timeSlotRepo.save({
          startTime: '09:00:00',
          endTime: '10:00:00',
          maxCapacity: 5,
          currentBookings: 0,
          isActive: true,
        }),
      ];
    }

    // 2. Create 3 bookings for 2026-01-27
    const targetDate = '2026-01-27';

    // Clear existing bookings for this date to avoid duplicates if needed, or just add
    // For this task, we just add.

    for (let i = 0; i < 3; i++) {
      const customer = customers[i % customers.length];
      const service = services[i % services.length];
      const slot = timeSlots[i % timeSlots.length];
      const employee = employees[i % employees.length];

      const booking = await bookingRepo.save({
        customerId: customer.id,
        serviceId: service.id,
        timeSlotId: slot.id,
        bookingDate: targetDate,
        numberOfGuests: 1,
        totalPrice: service.singlePrice || service.priceRangeMin || 100000,
        status: i === 0 ? 'confirmed' : 'pending',
        notes: `Booking mẫu ${i + 1} cho ngày ${targetDate}`,
      });

      await bookingEmployeeRepo.save({
        bookingId: booking.id,
        employeeId: employee.id,
      });

      console.log(`✅ Created booking ${i + 1} for ${targetDate}`);
    }

    console.log("✨ Done seeding today's bookings!");
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
  }
}

seedToday();
