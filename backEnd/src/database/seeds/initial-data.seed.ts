import { DataSource } from 'typeorm';
import { Service } from '../../entities/service.entity';
import { Employee, EmployeeRole } from '../../entities/employee.entity';
import { TimeSlot } from '../../entities/time-slot.entity';
import { EmployeeSchedule, DayOfWeek } from '../../entities/employee-schedule.entity';
import { BlogPost, PostStatus } from '../../entities/blog-post.entity';
import { BlogCategory } from '../../entities/blog-category.entity';
import { Banner } from '../../entities/banner.entity';
import { HomepageSection, SectionType } from '../../entities/homepage-section.entity';

export const seedInitialData = async (dataSource: DataSource) => {
  console.log('🌱 Bắt đầu seeding dữ liệu mẫu...');

  const serviceRepo = dataSource.getRepository(Service);
  const employeeRepo = dataSource.getRepository(Employee);
  const timeSlotRepo = dataSource.getRepository(TimeSlot);

  // 1. Seed Services
  const services = [
    // ========================
    // DESIGN (Nail Art)
    // ========================
    {
      name: 'Sơn phủ trong trang trí',
      description: 'Sơn phủ bóng bảo vệ lớp trang trí nail, giữ màu bền lâu.',
      singlePrice: 10000,
      priceType: 'single' as const,
      duration: '10 phút',
      durationMinutes: 10,
      category: 'Design',
      hasCustomDesign: true,
    },
    {
      name: 'Vẽ gel',
      description: 'Vẽ gel nghệ thuật trên móng, tạo hoa văn, họa tiết tinh tế.',
      priceType: 'range' as const,
      priceRangeMin: 5000,
      priceRangeMax: 50000,
      duration: '15-30 phút',
      durationMinutes: 30,
      category: 'Design',
      hasCustomDesign: true,
    },
    {
      name: 'Vẽ nổi',
      description: 'Vẽ nổi 3D trên móng, tạo hiệu ứng hoa, lá, hình nghệ thuật nổi bật.',
      priceType: 'range' as const,
      priceRangeMin: 20000,
      priceRangeMax: 40000,
      duration: '20-30 phút',
      durationMinutes: 30,
      category: 'Design',
      hasCustomDesign: true,
    },
    {
      name: 'French đầu móng',
      description: 'Vẽ French tip cổ điển hoặc biến tấu trên đầu móng.',
      priceType: 'range' as const,
      priceRangeMin: 10000,
      priceRangeMax: 20000,
      duration: '15-20 phút',
      durationMinutes: 20,
      category: 'Design',
      hasCustomDesign: true,
    },
    {
      name: 'Ombre, loang, tráng gương',
      description: 'Kỹ thuật ombre chuyển màu, loang nghệ thuật hoặc tráng gương bóng sáng trên móng.',
      priceType: 'range' as const,
      priceRangeMin: 15000,
      priceRangeMax: 30000,
      duration: '20-30 phút',
      durationMinutes: 30,
      category: 'Design',
      hasCustomDesign: true,
    },
    {
      name: 'Ấn mã cờ, hoa khô, kim tuyến',
      description: 'Đắp phụ kiện hoa khô, mã cờ, kim tuyến lên móng tạo điểm nhấn.',
      priceType: 'range' as const,
      priceRangeMin: 20000,
      priceRangeMax: 50000,
      duration: '15-20 phút',
      durationMinutes: 20,
      category: 'Design',
      hasCustomDesign: true,
    },
    {
      name: 'Đính đá',
      description: 'Đính đá pha lê, đá quý lên móng tạo vẻ sang trọng, lấp lánh.',
      priceType: 'range' as const,
      priceRangeMin: 10000,
      priceRangeMax: 100000,
      duration: '15-30 phút',
      durationMinutes: 30,
      category: 'Design',
      hasCustomDesign: true,
    },
    {
      name: 'Sticker',
      description: 'Dán sticker trang trí móng với nhiều mẫu mã đa dạng.',
      priceType: 'range' as const,
      priceRangeMin: 5000,
      priceRangeMax: 15000,
      duration: '10 phút',
      durationMinutes: 10,
      category: 'Design',
      hasCustomDesign: true,
    },
    {
      name: 'Phụ kiện nhỏ',
      description: 'Gắn phụ kiện nhỏ trang trí móng (vui lòng liên hệ trước, giá sẽ phụ thuộc chi tiết của hình vẽ).',
      priceType: 'custom' as const,
      duration: '10-20 phút',
      durationMinutes: 20,
      category: 'Design',
      hasCustomDesign: true,
    },
    {
      name: 'Vẽ theo yêu cầu',
      description: 'Vẽ nail theo yêu cầu riêng của khách (vui lòng liên hệ trước, giá sẽ phụ thuộc chi tiết của hình vẽ).',
      priceType: 'custom' as const,
      duration: '30-60 phút',
      durationMinutes: 60,
      category: 'Design',
      hasCustomDesign: true,
    },

    // ========================
    // EYE LASH (Nối mi)
    // ========================
    {
      name: 'Nối mi classic',
      description: 'Nối mi classic 1:1 tự nhiên, phù hợp với mọi phong cách.',
      singlePrice: 300000,
      priceType: 'single' as const,
      duration: '60-90 phút',
      durationMinutes: 90,
      category: 'Eye Lash',
    },
    {
      name: 'Nối mi volume',
      description: 'Nối mi volume dày, bồng bềnh, tạo đôi mắt cuốn hút.',
      priceType: 'range' as const,
      priceRangeMin: 250000,
      priceRangeMax: 350000,
      duration: '90-120 phút',
      durationMinutes: 120,
      category: 'Eye Lash',
    },
    {
      name: 'Nối mi kotun',
      description: 'Nối mi kotun (cotton) mềm mại, nhẹ nhàng, giữ lâu.',
      priceType: 'range' as const,
      priceRangeMin: 250000,
      priceRangeMax: 350000,
      duration: '90-120 phút',
      durationMinutes: 120,
      category: 'Eye Lash',
    },
    {
      name: 'Nối mi đuôi cá',
      description: 'Nối mi đuôi cá tạo hiệu ứng mắt cáo, quyến rũ.',
      singlePrice: 250000,
      priceType: 'single' as const,
      duration: '90 phút',
      durationMinutes: 90,
      category: 'Eye Lash',
    },
    {
      name: 'Nối mi baby',
      description: 'Nối mi baby tự nhiên, nhẹ nhàng phù hợp cho người mới.',
      priceType: 'range' as const,
      priceRangeMin: 250000,
      priceRangeMax: 350000,
      duration: '60-90 phút',
      durationMinutes: 90,
      category: 'Eye Lash',
    },
    {
      name: 'Nối mi thiết kế',
      description: 'Nối mi thiết kế theo yêu cầu, tạo kiểu mắt riêng biệt.',
      priceType: 'range' as const,
      priceRangeMin: 250000,
      priceRangeMax: 350000,
      duration: '90-120 phút',
      durationMinutes: 120,
      category: 'Eye Lash',
    },
    {
      name: 'Nối mi lông chồn',
      description: 'Nối mi lông chồn cao cấp, mềm mại, bền đẹp tự nhiên.',
      priceType: 'range' as const,
      priceRangeMin: 350000,
      priceRangeMax: 450000,
      duration: '90-120 phút',
      durationMinutes: 120,
      category: 'Eye Lash',
    },
    {
      name: 'Mi màu',
      description: 'Nối mi màu sắc nổi bật, tạo phong cách cá tính.',
      priceType: 'range' as const,
      priceRangeMin: 230000,
      priceRangeMax: 350000,
      duration: '90 phút',
      durationMinutes: 90,
      category: 'Eye Lash',
    },
    {
      name: 'Tháo mi',
      description: 'Tháo mi nối an toàn, nhẹ nhàng không làm hỏng mi thật.',
      priceType: 'range' as const,
      priceRangeMin: 50000,
      priceRangeMax: 100000,
      duration: '20-30 phút',
      durationMinutes: 30,
      category: 'Eye Lash',
    },
    {
      name: 'Uốn mi',
      description: 'Uốn mi cong tự nhiên, giúp mắt to tròn hơn.',
      singlePrice: 200000,
      priceType: 'single' as const,
      duration: '30-45 phút',
      durationMinutes: 45,
      category: 'Eye Lash',
    },
    {
      name: 'Mix mi màu',
      description: 'Mix kết hợp mi màu sắc đa dạng, tạo điểm nhấn cho đôi mắt.',
      priceType: 'range' as const,
      priceRangeMin: 30000,
      priceRangeMax: 100000,
      duration: '90-120 phút',
      durationMinutes: 120,
      category: 'Eye Lash',
    },
    {
      name: 'Nối mi dưới',
      description: 'Nối mi dưới tạo đôi mắt búp bê, thêm chiều sâu cho ánh nhìn.',
      priceType: 'custom' as const,
      duration: '45-60 phút',
      durationMinutes: 60,
      category: 'Eye Lash',
    },

    // ========================
    // GỘI ĐẦU DƯỠNG SINH
    // ========================
    {
      name: 'Gội Đầu Dưỡng Sinh - Combo 1',
      description: 'Combo gội đầu dưỡng sinh cơ bản 7 bước, thư giãn nhẹ nhàng.',
      singlePrice: 79000,
      priceType: 'single' as const,
      duration: '35 phút',
      durationMinutes: 35,
      category: 'Gội Đầu Dưỡng Sinh',
      stepsCount: 7,
      steps: [
        'Khai thông kinh lạc',
        'Tẩy trang rửa mặt',
        'Gội 2 nước',
        'Ủ sả tóc (massage đầu)',
        'Massage CVG ngực',
        'Sấy tóc',
        'Máy massage chân',
      ],
    },
    {
      name: 'Gội Đầu Dưỡng Sinh - Combo 2',
      description: 'Combo gội đầu dưỡng sinh nâng cao 12 bước, kết hợp massage mặt và ngâm chân thảo dược.',
      singlePrice: 179000,
      priceType: 'single' as const,
      duration: '55 phút',
      durationMinutes: 55,
      category: 'Gội Đầu Dưỡng Sinh',
      stepsCount: 12,
      steps: [
        'Khai thông kinh lạc',
        'Tẩy trang rửa mặt',
        'Massage mặt nạ',
        'Đắp mặt nạ',
        'Massages mặt',
        'Gội 2 nước',
        'Ủ sả tóc (massage đầu)',
        'Ngâm chân tóc thảo dược',
        'Massage cưỡng tay',
        'Xông tiên tài',
        'Sấy tóc',
        'Máy massage chân',
      ],
    },
    {
      name: 'Gội Đầu Dưỡng Sinh - Combo 3',
      description: 'Combo gội đầu dưỡng sinh cao cấp 10 bước, kết hợp tẩy tế bào chết da mặt và massage chuyên sâu.',
      singlePrice: 229000,
      priceType: 'single' as const,
      duration: '70 phút',
      durationMinutes: 70,
      category: 'Gội Đầu Dưỡng Sinh',
      stepsCount: 10,
      steps: [
        'Khai thông kinh lạc',
        'Tẩy trang rửa mặt',
        'Tẩy tế bào chết da mặt',
        'Đắp mặt nạ',
        'Massage mặt chuyên sâu',
        'Gội 2 nước',
        'Ủ sả tóc (massage đầu)',
        'Massage CVG-tay-chân up',
        'Sấy tóc',
        'Máy massage chân',
      ],
    },
    {
      name: 'Gội Đầu Dưỡng Sinh - Combo 4',
      description: 'Combo gội đầu dưỡng sinh VIP 12 bước, trọn gói massage đá ngọc thạch và rửa bọt tai.',
      singlePrice: 329000,
      priceType: 'single' as const,
      duration: '90 phút',
      durationMinutes: 90,
      category: 'Gội Đầu Dưỡng Sinh',
      stepsCount: 12,
      steps: [
        'Khai thông kinh lạc',
        'Tẩy trang rửa mặt',
        'Tẩy tế bào chết da đầu',
        'Tẩy tế bào chết da mặt',
        'Massage mặt chuyên sâu (đá ngọc thạch)',
        'Đắp mặt nạ',
        'Gội 2 nước',
        'Ủ sả tóc (massage đầu)',
        'Massage CVG-tay-chân',
        'Rửa bọt tai',
        'Sấy tóc',
        'Máy massage chân',
      ],
    },

    // ========================
    // CHĂM SÓC DA
    // ========================
    {
      name: 'Chăm Sóc Da',
      description: 'Liệu trình chăm sóc da mặt chuyên sâu, làm sạch sâu, lấy mụn và dưỡng da toàn diện.',
      singlePrice: 349000,
      priceType: 'single' as const,
      duration: '90 phút',
      durationMinutes: 90,
      category: 'Chăm Sóc Da',
      stepsCount: 13,
      steps: [
        'Tẩy trang rửa mặt',
        'Tẩy tế bào chết da',
        'Massage cổ',
        'Xông hơi',
        'Hút bã nhờn, dầu',
        'Sát khuẩn',
        'Lấy Mụn',
        'Thoa nước hoa hồng',
        'Làm sạch',
        'Massage cổ',
        'Đi bùa nóng, lạnh',
        'Đắp mặt nạ',
        'Tẩy trang rửa mặt',
      ],
    },

    // ========================
    // DỊCH VỤ DA
    // ========================
    {
      name: 'Hút chì thải độc',
      description: 'Hút chì thải độc da mặt, giúp da sáng mịn, loại bỏ độc tố tích tụ.',
      singlePrice: 200000,
      priceType: 'single' as const,
      duration: '45 phút',
      durationMinutes: 45,
      category: 'Dịch Vụ Da',
    },
    {
      name: 'Cấy tảo, collagen, phấn',
      description: 'Cấy tảo xoắn, collagen và phấn vào da, giúp da căng mịn, trẻ hóa.',
      singlePrice: 200000,
      priceType: 'single' as const,
      duration: '45 phút',
      durationMinutes: 45,
      category: 'Dịch Vụ Da',
    },

    // ========================
    // DỊCH VỤ LẺ
    // ========================
    {
      name: 'Tắm trắng mỡ hộp',
      description: 'Tắm trắng toàn thân bằng mỡ hộp, giúp da trắng sáng đều màu.',
      singlePrice: 450000,
      priceType: 'single' as const,
      duration: '60 phút',
      durationMinutes: 60,
      category: 'Dịch Vụ Lẻ',
    },
    {
      name: 'Tắm trắng nhung, nổi ruồi',
      description: 'Tắm trắng nhung hoặc nổi ruồi, giá tùy theo diện tích vùng da.',
      priceType: 'range' as const,
      priceRangeMin: 30000,
      priceRangeMax: 300000,
      duration: '30-60 phút',
      durationMinutes: 60,
      category: 'Dịch Vụ Lẻ',
    },
    {
      name: 'Tẩy tế bào chết da đầu',
      description: 'Tẩy tế bào chết da đầu, giúp da đầu sạch gàu, thông thoáng và khỏe mạnh.',
      singlePrice: 35000,
      priceType: 'single' as const,
      duration: '15 phút',
      durationMinutes: 15,
      category: 'Dịch Vụ Lẻ',
    },
    {
      name: 'Tẩy tế bào chết da mặt',
      description: 'Tẩy tế bào chết da mặt, giúp da mịn màng và hấp thu dưỡng chất tốt hơn.',
      singlePrice: 35000,
      priceType: 'single' as const,
      duration: '15 phút',
      durationMinutes: 15,
      category: 'Dịch Vụ Lẻ',
    },
    {
      name: 'Xông tiên tai',
      description: 'Xông tiên tai thảo dược, giúp thư giãn và thải độc.',
      singlePrice: 35000,
      priceType: 'single' as const,
      duration: '15 phút',
      durationMinutes: 15,
      category: 'Dịch Vụ Lẻ',
    },
    {
      name: 'Massage mặt chuyên sâu nâng cơ',
      description: 'Massage mặt chuyên sâu nâng cơ, giúp da săn chắc, trẻ trung hơn.',
      singlePrice: 99000,
      priceType: 'single' as const,
      duration: '30 phút',
      durationMinutes: 30,
      category: 'Dịch Vụ Lẻ',
    },
    {
      name: 'Đá nóng',
      description: 'Massage đá nóng, giúp thư giãn cơ bắp và tăng tuần hoàn máu. Phụ thu thêm khi kết hợp dịch vụ khác.',
      singlePrice: 40000,
      priceType: 'single' as const,
      duration: '30 phút',
      durationMinutes: 30,
      category: 'Dịch Vụ Lẻ',
    },
    {
      name: 'Massage body',
      description: 'Massage toàn thân giúp thư giãn cơ bắp, giảm căng thẳng và tăng cường tuần hoàn máu.',
      priceType: 'custom' as const,
      duration: '60-90 phút',
      durationMinutes: 90,
      category: 'Dịch Vụ Lẻ',
    },
    {
      name: 'Massage thạch',
      description: 'Massage bằng đá thạch anh, giúp cân bằng năng lượng và thư giãn sâu.',
      priceType: 'custom' as const,
      duration: '60 phút',
      durationMinutes: 60,
      category: 'Dịch Vụ Lẻ',
    },
    {
      name: 'Ngâm chân thảo dược + massage chân',
      description: 'Ngâm chân thảo dược kết hợp massage chân, giúp lưu thông máu và thư giãn.',
      singlePrice: 40000,
      priceType: 'single' as const,
      duration: '30 phút',
      durationMinutes: 30,
      category: 'Dịch Vụ Lẻ',
    },
    {
      name: 'Chà gót chân + massage chân',
      description: 'Chà gót chân sạch da chết kết hợp massage chân thư giãn.',
      singlePrice: 149000,
      priceType: 'single' as const,
      duration: '40 phút',
      durationMinutes: 40,
      category: 'Dịch Vụ Lẻ',
    },
    {
      name: 'Máy thải độc trị đau chân',
      description: 'Sử dụng máy thải độc chuyên dụng giúp giảm đau chân, thải độc tố qua bàn chân.',
      singlePrice: 60000,
      priceType: 'single' as const,
      duration: '30 phút',
      durationMinutes: 30,
      category: 'Dịch Vụ Lẻ',
    },
    {
      name: 'Các loại mặt nạ',
      description: 'Đắp mặt nạ dưỡng da với nhiều loại: collagen, hyaluronic, trà xanh, than hoạt tính...',
      singlePrice: 30000,
      priceType: 'single' as const,
      duration: '20 phút',
      durationMinutes: 20,
      category: 'Dịch Vụ Lẻ',
    },
  ];

  for (const s of services) {
    const existing = await serviceRepo.findOne({ where: { name: s.name } });
    if (!existing) {
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

  // 4. Seed Employee Schedules (lịch làm việc hàng tuần)
  const scheduleRepo = dataSource.getRepository(EmployeeSchedule);
  const existingSchedules = await scheduleRepo.find();

  if (existingSchedules.length === 0) {
    const allEmployees = await employeeRepo.find();
    const allDays = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ];

    for (const emp of allEmployees) {
      for (const day of allDays) {
        const isWeekend = day === DayOfWeek.SATURDAY || day === DayOfWeek.SUNDAY;
        const isSaturday = day === DayOfWeek.SATURDAY;

        if (emp.role === EmployeeRole.THERAPIST) {
          if (day === DayOfWeek.SUNDAY) {
            await scheduleRepo.save(
              scheduleRepo.create({
                employeeId: emp.id,
                dayOfWeek: day,
                startTime: '00:00',
                endTime: '00:00',
                isDayOff: true,
                note: 'Nghỉ Chủ Nhật',
              }),
            );
          } else if (isSaturday) {
            await scheduleRepo.save(
              scheduleRepo.create({
                employeeId: emp.id,
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '15:00',
                breakStartTime: '12:00',
                breakEndTime: '12:30',
                isDayOff: false,
                note: 'Thứ 7 nửa ngày',
              }),
            );
          } else {
            await scheduleRepo.save(
              scheduleRepo.create({
                employeeId: emp.id,
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '18:00',
                breakStartTime: '12:00',
                breakEndTime: '13:00',
                isDayOff: false,
              }),
            );
          }
        } else {
          // Receptionist / Manager: T2-T6, nghỉ T7+CN
          if (isWeekend) {
            await scheduleRepo.save(
              scheduleRepo.create({
                employeeId: emp.id,
                dayOfWeek: day,
                startTime: '00:00',
                endTime: '00:00',
                isDayOff: true,
                note: 'Nghỉ cuối tuần',
              }),
            );
          } else {
            await scheduleRepo.save(
              scheduleRepo.create({
                employeeId: emp.id,
                dayOfWeek: day,
                startTime: '08:30',
                endTime: '17:30',
                breakStartTime: '12:00',
                breakEndTime: '13:00',
                isDayOff: false,
              }),
            );
          }
        }
      }
      console.log(`✅ Schedule seeded for ${emp.fullName}`);
    }
  } else {
    console.log(`⏭️  Schedules already exist (${existingSchedules.length} records), skipping...`);
  }
  console.log('✅ Employee Schedules seeded');
  console.log('📦 Bắt đầu seed Blog...');

  // 5. Seed Blog Category
  const categoryRepo = dataSource.getRepository(BlogCategory);
  
  let massageCategory = await categoryRepo.findOne({ where: { slug: 'massage-tri-lieu' } });
  if (!massageCategory) {
    massageCategory = await categoryRepo.save(
      categoryRepo.create({
        name: 'Massage trị liệu',
        slug: 'massage-tri-lieu',
        description: 'Các bài viết về phương pháp massage trị liệu và chăm sóc sức khỏe.',
      }),
    );
  }

  let nailCategory = await categoryRepo.findOne({ where: { slug: 'lam-dep-nails' } });
  if (!nailCategory) {
    nailCategory = await categoryRepo.save(
      categoryRepo.create({
        name: 'Làm đẹp & Nails',
        slug: 'lam-dep-nails',
        description: 'Xu hướng làm đẹp, chăm sóc móng và nghệ thuật nail hiện đại.',
      }),
    );
  }
  
  console.log('✅ Blog Categories seeded');

  // 6. Seed Blog Posts
  const postRepo = dataSource.getRepository(BlogPost);

  // Post 1: Massage Lưng
  const existingPost1 = await postRepo.findOne({ where: { slug: 'massage-lung' } });
  if (!existingPost1) {
    await postRepo.save(
      postRepo.create({
        title: 'Massage lưng - Chìa khóa cho giấc ngủ ngon và thư giãn sâu',
        slug: 'massage-lung',
        excerpt: 'Massage lưng là phương pháp xoa bóp và kích thích các cơ và mô mềm trên vùng lưng giúp làm dịu cơ và khớp căng cứng, giảm mệt mỏi.',
        content: `
          <p>Massage lưng là phương pháp xoa bóp và kích thích các cơ và mô mềm trên vùng lưng. Qua việc áp lực, xoa bóp và các kỹ thuật đặc biệt, massage lưng có thể giúp làm dịu cơ và khớp căng cứng, giảm mệt mỏi, cải thiện tuần hoàn máu và thúc đẩy sự lưu thông năng lượng trong cơ thể.</p>
          <h2>1. Massage lưng mang đến những trải nghiệm mới mẻ gì cho bạn?</h2>
          <p>Massage lưng là phương pháo xoa bóp và kích thích các cơ và mô mềm trên vùng lưng. Qua việc áp lực, xoa bóp và các kỹ thuật đặc biệt...</p>
          <h2>2. Bí mật được giấu kín - những kĩ thuật Massage lưng chưa được tiết lộ</h2>
          <p>Lưng là nơi tập trung rất nhiều điểm huyệt quan trọng như: đại thùy, mệnh môn, tỳ du, thận du...</p>
          <h2>3. Bảng giá Massage lưng tại Aramsa Spa</h2>
          <ul>
            <li>Giác hơi 30 phút: 150,000đ</li>
            <li>Massage 60 mins: 450.000VND</li>
          </ul>
        `,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 124,
        readingTime: 5,
        isFeatured: true,
        thumbnailUrl: '/images/blog-placeholder-1.png',
        categories: [massageCategory],
      }),
    );
    console.log('✅ Blog Post 1 seeded');
  }

  // Post 2: Nail Trends 2026
  const existingPost2 = await postRepo.findOne({ where: { slug: '7-xu-huong-nail-2026' } });
  if (!existingPost2) {
    await postRepo.save(
      postRepo.create({
        title: '7 Xu Hướng Nail Đẹp Đang Được Yêu Thích Nhất Năm 2026',
        slug: '7-xu-huong-nail-2026',
        excerpt: 'Khám phá 7 xu hướng nail đỉnh cao từ minimalism tinh tế đến Chrome bóng bẩy cho năm 2026.',
        content: `
          <p>Trong những năm gần đây, ngành nail không chỉ dừng lại ở việc sơn móng đơn giản mà đã trở thành một phần của thời trang và phong cách cá nhân. Mỗi năm lại xuất hiện nhiều xu hướng nail mới giúp bộ móng trở nên ấn tượng và độc đáo hơn.</p>
          <p>Nếu bạn đang tìm cảm hứng cho bộ móng tiếp theo, dưới đây là 7 xu hướng nail đẹp đang được yêu thích nhất năm 2026.</p>

          <h2>1. Nail Minimalist (Nail tối giản)</h2>
          <p>Phong cách nail tối giản vẫn luôn được yêu thích vì sự tinh tế và thanh lịch.</p>
          <img src="/images/nail-minimalist.png" alt="Nail Minimalist Trend" />
          <p><strong>Đặc điểm:</strong> Màu sơn nhẹ nhàng (be, nude, trắng sữa), họa tiết đơn giản, đường line mảnh hoặc chấm nhỏ.</p>
          <p>Phong cách này phù hợp với dân văn phòng hoặc những người thích vẻ đẹp tinh tế, không quá phô trương.</p>

          <h2>2. Chrome Nail (Nail gương)</h2>
          <p>Chrome nail tạo hiệu ứng bóng gương cực kỳ bắt mắt. Khi ánh sáng chiếu vào móng, lớp chrome sẽ tạo ra hiệu ứng kim loại rất thời trang.</p>
          <img src="/images/nail-chrome.png" alt="Chrome Nail Trend" />
          <p>Các màu chrome phổ biến bao gồm bạc, hồng, xanh ngọc và vàng champagne. Đây là phong cách rất được yêu thích trong các bữa tiệc.</p>

          <h2>3. Nail French Cách Điệu</h2>
          <p>French nail truyền thống đã được biến tấu thành nhiều kiểu mới như French màu neon, viền kim tuyến hay French 2 màu nghệ thuật. Kiểu nail này vừa giữ được sự thanh lịch vừa có thêm sự sáng tạo hiện đại.</p>

          <h2>4. Nail Đá (Rhinestone Nail)</h2>
          <p>Nail đính đá mang lại vẻ sang trọng và nổi bật. Những viên đá nhỏ được sắp xếp khéo léo giúp bộ móng trở thành điểm nhấn hoàn hảo.</p>
          <p>Các kiểu đính đá phổ biến: Đính đá chân móng, hình hoa hoặc full móng sang chảnh.</p>

          <h2>5. Jelly Nail (Nail trong suốt)</h2>
          <p>Jelly nail tạo hiệu ứng móng trong suốt như thạch, mang lại cảm giác nhẹ nhàng, trẻ trung và đặc biệt hợp với mùa hè.</p>
          <img src="/images/nail-jelly.png" alt="Jelly Nail Trend" />

          <h2>6. Nail Ombre</h2>
          <p>Nail ombre là kỹ thuật chuyển màu mềm mại từ đậm sang nhạt. Một số combo đẹp: Hồng → trắng sữa, Nude → nâu sữa, Xanh baby → trắng.</p>

          <h2>7. Nail 3D Art</h2>
          <p>Nail 3D là xu hướng nail nghệ thuật cao cấp với các chi tiết hoa nổi, nơ hay hình trái tim đầy sống động.</p>
          <img src="/images/nail-3d.png" alt="3D Nail Art" />

          <h2>Kết luận</h2>
          <p>Dù bạn thích sự đơn giản, sang trọng hay nổi bật, luôn có một xu hướng nail phù hợp với bạn trong năm 2026. Hãy thử ngay để làm mới phong cách của mình!</p>
        `,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        viewCount: 450,
        readingTime: 4,
        isFeatured: true,
        thumbnailUrl: '/images/blog-nail-art_1773426891219.png', // Sử dụng ảnh đã có
        categories: [nailCategory],
      }),
    );
    console.log('✅ Blog Post 2 seeded');
  }

  // 7. Seed Banner
  const bannerRepo = dataSource.getRepository(Banner);
  const existingBanner = await bannerRepo.findOne({ where: { title: 'Marlie Nails & Spa' } });

  if (!existingBanner) {
    await bannerRepo.save(
      bannerRepo.create({
        title: 'Marlie Nails & Spa',
        subtitle: 'Nâng tầm vẻ đẹp tự nhiên của bạn với các dịch vụ chăm sóc móng và spa chuyên nghiệp. Tại Marlie, chúng tôi kết hợp nghệ thuật tinh tế cùng không gian thư giãn tuyệt đối để mang lại cho bạn trải nghiệm làm đẹp hoàn hảo nhất.',
        imageUrl: '/images/hero-lifestyle.png',
        buttonText: 'ĐẶT LỊCH NGAY',
        buttonLink: '#',
        displayOrder: 1,
        isActive: true,
      }),
    );
    console.log('✅ Banner seeded');
  }

  // 8. Seed Homepage Sections
  const sectionRepo = dataSource.getRepository(HomepageSection);
  const sections = [
    {
      type: SectionType.HERO,
      title: 'Marlie Nails & Spa',
      subtitle: 'Nâng tầm vẻ đẹp tự nhiên của bạn với các dịch vụ chăm sóc móng và spa chuyên nghiệp.',
      content: '<p>Tại Marlie, chúng tôi kết hợp nghệ thuật tinh tế cùng không gian thư giãn tuyệt đối để mang lại cho bạn trải nghiệm làm đẹp hoàn hảo nhất.</p>',
      imageUrl: '/images/hero-lifestyle.png',
      displayOrder: 1,
      isActive: true,
      config: { buttonText: 'ĐẶT LỊCH NGAY', buttonLink: '/booking' },
    },
    {
      type: SectionType.SERVICES,
      title: 'DỊCH VỤ CỦA CHÚNG TÔI',
      subtitle: 'Trải nghiệm sự chăm sóc tận tâm',
      displayOrder: 2,
      isActive: true,
    },
    {
      type: SectionType.USP,
      title: 'TẠI SAO CHỌN MARLIE?',
      subtitle: 'Sự khác biệt tạo nên thương hiệu',
      displayOrder: 3,
      isActive: true,
    },
    {
      type: SectionType.PROMOTION,
      title: 'KHUYẾN MÃI ĐANG DIỄN RA',
      subtitle: 'Khám phá các ưu đãi đặc biệt dành riêng cho bạn',
      displayOrder: 4,
      isActive: true,
    },
    {
      type: SectionType.BLOG,
      title: 'TIN TỨC & LÀM ĐẸP',
      subtitle: 'Cập nhật xu hướng và bí quyết chăm sóc sắc đẹp',
      displayOrder: 5,
      isActive: true,
    },
    {
      type: SectionType.WELLNESS,
      title: 'Wellness & Spa',
      subtitle: 'Unforgettable Experience',
      displayOrder: 6,
      isActive: true,
    },
    {
      type: SectionType.WORKING_HOURS,
      title: 'Giờ Mở Cửa',
      subtitle: 'Chào mừng bạn đến với spa của chúng tôi!',
      displayOrder: 7,
      isActive: true,
    },
    {
      type: SectionType.PRICING,
      title: 'Dịch Vụ Nổi Bật',
      subtitle: 'Khám phá các gói dịch vụ được yêu thích nhất',
      displayOrder: 8,
      isActive: true,
    },
    {
      type: SectionType.TESTIMONIALS,
      title: 'Khách Hàng Nói Gì Về Marlie',
      subtitle: 'Sự hài lòng của bạn là động lực của chúng tôi',
      displayOrder: 9,
      isActive: true,
    }
  ];

  for (const s of sections) {
    const existing = await sectionRepo.findOne({ where: { type: s.type as any } });
    if (!existing) {
      await sectionRepo.save(sectionRepo.create(s));
    }
  }
  console.log('✅ Homepage Sections seeded');

  console.log('🏁 Seeding hoàn tất!');
};
