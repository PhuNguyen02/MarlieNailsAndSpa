import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { dataSourceOptions } from '../config/typeorm.config';

async function seed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  console.log('🌱 Seeding database...');

  try {
    // 1. Seed Admin
    console.log('Creating admin...');
    const adminRepository = dataSource.getRepository('Admin');

    let admin = await adminRepository.findOne({
      where: [{ username: 'admin' }, { email: 'admin@spa.com' }],
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await adminRepository.save({
        username: 'admin',
        email: 'admin@spa.com',
        password: hashedPassword,
        fullName: 'Admin Spa',
        phone: '0123456789',
        isActive: true,
      });
      console.log('✅ Admin created:', admin.email);
    } else {
      console.log('⏭️  Admin already exists, skipping...');
    }

    // 2. Seed Time Slots (9:00 AM - 9:00 PM, mỗi khung 1 giờ)
    console.log('\nCreating time slots...');
    const timeSlotRepository = dataSource.getRepository('TimeSlot');
    let timeSlots: any[] = await timeSlotRepository.find();

    if (timeSlots.length === 0) {
      for (let hour = 9; hour <= 20; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00:00`;

        const slot = await timeSlotRepository.save({
          startTime,
          endTime,
          maxCapacity: 5,
          currentBookings: 0,
          isActive: true,
        });
        timeSlots.push(slot);
        console.log(`✅ Time slot created: ${startTime} - ${endTime}`);
      }
    } else {
      console.log(`⏭️  Time slots already exist (${timeSlots.length} slots), skipping...`);
    }

    // 3. Seed Services from Marlie Nails & Spa CSV data
    console.log('\nCreating services...');
    const serviceRepository = dataSource.getRepository('Service');
    let savedServices: any[] = await serviceRepository.find();

    if (savedServices.length === 0) {
      const services = [
        // GỘI ĐẦU DƯỠNG SINH
        {
          name: 'Combo 1',
          category: 'Gội Đầu Dưỡng Sinh',
          priceType: 'single',
          singlePrice: 79000,
          duration: '35 phút',
          steps: [
            'Khai thông kinh lạc',
            'Tẩy trang rửa mặt',
            'Gội 2 nước',
            'Ủ xả tóc (massage đầu)',
            'Massage CVG ngửa',
            'Sấy tóc',
            'Máy massage chân',
          ],
          isActive: true,
        },
        {
          name: 'Combo 2',
          category: 'Gội Đầu Dưỡng Sinh',
          priceType: 'single',
          singlePrice: 179000,
          duration: '55 phút',
          steps: [
            'Khai thông kinh lạc',
            'Tẩy trang rửa mặt',
            'Massage mặt nâng cơ',
            'Đắp mặt nạ',
            'Gội 2 nước',
            'Ủ xả tóc (massage đầu)',
            'Ngâm chân thảo dược',
            'Massage CVG tay',
            'Xông nến tai',
            'Sấy tóc',
            'Máy massage chân',
          ],
          isActive: true,
        },
        {
          name: 'Combo 3',
          category: 'Gội Đầu Dưỡng Sinh',
          priceType: 'single',
          singlePrice: 229000,
          duration: '70 phút',
          steps: [
            'Khai thông kinh lạc',
            'Tẩy trang rửa mặt',
            'Tẩy tế bào chết da mặt',
            'Massage mặt chuyên sâu',
            'Đắp mặt nạ',
            'Tẩy tế bào chết da đầu',
            'Massage CVG-tay-chân',
            'Gội 2 nước',
            'Ủ xả tóc (massage đầu)',
            'Sấy tóc',
            'Máy massage chân',
          ],
          isActive: true,
        },
        {
          name: 'Combo 4',
          category: 'Gội Đầu Dưỡng Sinh',
          priceType: 'single',
          singlePrice: 329000,
          duration: '90 phút',
          steps: [
            'Khai thông kinh lạc',
            'Tẩy trang rửa mặt',
            'Tẩy tế bào chết da mặt',
            'Tẩy tế bào chết da đầu',
            'Massage mặt chuyên sâu (đá ngọc thạch)',
            'Đắp mặt nạ',
            'Massage CVG-tay-chân',
            'Gội 2 nước',
            'Ủ xả tóc (massage đầu)',
            'Rửa bọt tai (massage tai)',
            'Sấy tóc',
            'Máy massage chân',
          ],
          isActive: true,
        },

        // TRIỆT LÔNG
        {
          name: 'Triệt Lông Nách',
          category: 'Triệt Lông',
          zone: 'Nách',
          priceType: 'package',
          singlePrice: 129000,
          packagePrice: 899000,
          packageSessions: 10,
          isActive: true,
        },
        {
          name: 'Triệt Lông Mép',
          category: 'Triệt Lông',
          zone: 'Mép',
          priceType: 'package',
          singlePrice: 129000,
          packagePrice: 899000,
          packageSessions: 10,
          isActive: true,
        },
        {
          name: 'Triệt Lông Bụng',
          category: 'Triệt Lông',
          zone: 'Bụng',
          priceType: 'package',
          singlePrice: 179000,
          packagePrice: 1399000,
          packageSessions: 10,
          isActive: true,
        },
        {
          name: 'Triệt Lông Mặt',
          category: 'Triệt Lông',
          zone: 'Mặt',
          priceType: 'package',
          singlePrice: 229000,
          packagePrice: 1799000,
          packageSessions: 10,
          isActive: true,
        },
        {
          name: 'Triệt Lông Tay 1/2',
          category: 'Triệt Lông',
          zone: 'Tay 1/2',
          priceType: 'package',
          singlePrice: 299000,
          packagePrice: 2399000,
          packageSessions: 10,
          isActive: true,
        },
        {
          name: 'Triệt Lông Lưng',
          category: 'Triệt Lông',
          zone: 'Lưng',
          priceType: 'package',
          singlePrice: 349000,
          packagePrice: 2799000,
          packageSessions: 10,
          isActive: true,
        },
        {
          name: 'Triệt Lông Bikini',
          category: 'Triệt Lông',
          zone: 'Bikini',
          priceType: 'package',
          singlePrice: 349000,
          packagePrice: 2799000,
          packageSessions: 10,
          isActive: true,
        },
        {
          name: 'Triệt Lông Chân 1/2',
          category: 'Triệt Lông',
          zone: 'Chân 1/2',
          priceType: 'package',
          singlePrice: 349000,
          packagePrice: 2799000,
          packageSessions: 10,
          isActive: true,
        },
        {
          name: 'Triệt Lông Full Tay',
          category: 'Triệt Lông',
          zone: 'Full Tay',
          priceType: 'package',
          singlePrice: 399000,
          packagePrice: 3199000,
          packageSessions: 10,
          isActive: true,
        },
        {
          name: 'Triệt Lông Full Chân',
          category: 'Triệt Lông',
          zone: 'Full Chân',
          priceType: 'package',
          singlePrice: 449000,
          packagePrice: 3599000,
          packageSessions: 10,
          isActive: true,
        },
        {
          name: 'Triệt Lông Full Body',
          category: 'Triệt Lông',
          zone: 'Full Body',
          priceType: 'package',
          singlePrice: 1799000,
          packagePrice: 13999000,
          packageSessions: 10,
          isActive: true,
        },

        // MI
        {
          name: 'Tháo Mi',
          category: 'Mi',
          priceType: 'single',
          singlePrice: 40000,
          isActive: true,
        },
        {
          name: 'Mĩ Mi Nhuộm',
          category: 'Mi',
          priceType: 'range',
          priceRangeMin: 30000,
          priceRangeMax: 100000,
          isActive: true,
        },
        {
          name: 'Nối Mi dưới',
          category: 'Mi',
          priceType: 'single',
          singlePrice: 150000,
          isActive: true,
        },
        {
          name: 'Uốn Mi',
          category: 'Mi',
          priceType: 'single',
          singlePrice: 200000,
          isActive: true,
        },
        {
          name: 'Uốn Mi + Nhuộm',
          category: 'Mi',
          priceType: 'single',
          singlePrice: 250000,
          isActive: true,
        },
        {
          name: 'Nối Mi Classic',
          category: 'Mi',
          priceType: 'single',
          singlePrice: 300000,
          isActive: true,
        },
        {
          name: 'Nối Mi Anime baby',
          category: 'Mi',
          priceType: 'single',
          singlePrice: 300000,
          isActive: true,
        },
        {
          name: 'Nối Mi Molum',
          category: 'Mi',
          priceType: 'single',
          singlePrice: 350000,
          isActive: true,
        },
        {
          name: 'Nối Mi Katun',
          category: 'Mi',
          priceType: 'single',
          singlePrice: 350000,
          isActive: true,
        },
        {
          name: 'Nối Mi Đuôi cá',
          category: 'Mi',
          priceType: 'single',
          singlePrice: 350000,
          isActive: true,
        },
        {
          name: 'Nối Mi Lông Chồn - Lông Thỏ',
          category: 'Mi',
          priceType: 'single',
          singlePrice: 400000,
          isActive: true,
        },
        {
          name: 'Mi Nâu',
          category: 'Mi',
          priceType: 'single',
          singlePrice: 400000,
          isActive: true,
        },
        {
          name: 'Các Loại Mi Thiết Kế',
          category: 'Mi',
          priceType: 'single',
          singlePrice: 450000,
          hasCustomDesign: true,
          isActive: true,
        },

        // DỊCH VỤ KHÁC (Mua 5 tặng 1)
        {
          name: 'Các loại mặt nạ',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 30000,
          description: 'Mua 5 tặng 1',
          isActive: true,
        },
        {
          name: 'Máy thải độc trị đau chân',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 60000,
          description: 'Mua 5 tặng 1',
          isActive: true,
        },
        {
          name: 'Bắn tàn nhang - nốt ruồi',
          category: 'Dịch Vụ Khác',
          priceType: 'range',
          priceRangeMin: 30000,
          priceRangeMax: 300000,
          description: 'Mua 5 tặng 1',
          isActive: true,
        },
        {
          name: 'Tẩy tế bào chết da đầu',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 35000,
          description: 'Mua 5 tặng 1',
          isActive: true,
        },
        {
          name: 'Tẩy tế bào chết da mặt',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 35000,
          description: 'Mua 5 tặng 1',
          isActive: true,
        },
        {
          name: 'Xông nến tai',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 35000,
          description: 'Mua 5 tặng 1',
          isActive: true,
        },
        {
          name: 'Ngâm chân thảo dược - massage chân',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 149000,
          description: 'Mua 5 tặng 1',
          isActive: true,
        },
        {
          name: 'Chà gót chân + massage chân',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 200000,
          description: 'Mua 5 tặng 1',
          isActive: true,
        },
        {
          name: 'Massage mặt chuyên sâu nâng cơ (30p)',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 99000,
          duration: '30 phút',
          description: 'Mua 5 tặng 1',
          isActive: true,
        },
        {
          name: 'Đá ngọc thạch',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 40000,
          description: 'Mua 5 tặng 1 - Dịch vụ bổ sung',
          isActive: true,
        },
        {
          name: 'Massage body 30 phút',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 189000,
          duration: '30 phút',
          description: 'Mua 5 tặng 1',
          isActive: true,
        },
        {
          name: 'Massage body 60 phút',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 355000,
          duration: '60 phút',
          description: 'Mua 5 tặng 1',
          isActive: true,
        },
        {
          name: 'Massage body 90 phút',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 499000,
          duration: '90 phút',
          description: 'Mua 5 tặng 1',
          isActive: true,
        },
        {
          name: 'Đá nóng',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 40000,
          description: 'Mua 5 tặng 1 - Dịch vụ bổ sung',
          isActive: true,
        },
        {
          name: 'Tắm trắng máy hấp',
          category: 'Dịch Vụ Khác',
          priceType: 'single',
          singlePrice: 450000,
          description: 'Mua 5 tặng 1',
          isActive: true,
        },

        // CHĂM SÓC DA
        {
          name: 'Lấy Nhân Mụn Cơ bản',
          category: 'Chăm Sóc Da',
          priceType: 'single',
          singlePrice: 200000,
          stepsCount: 13,
          steps: [
            'Soi da',
            'Tẩy trang',
            'Rửa mặt',
            'Tẩy tế bào chết',
            'Massage mặt',
            'Xông hơi',
            'Cà sũi',
            'Hút bã nhờn',
            'Sát khuẩn lần 1',
            'Lấy nhân mụn',
            'Sát khuẩn lần 2',
            'Điện tím',
            'Đắp mặt nạ + Chiếu đèn sinh học + Massage đầu',
          ],
          isActive: true,
        },
        {
          name: 'Lấy Nhân Mụn Cấp Độ 2',
          category: 'Chăm Sóc Da',
          priceType: 'single',
          singlePrice: 250000,
          stepsCount: 14,
          steps: [
            'Soi da',
            'Tẩy trang',
            'Rửa mặt',
            'Tẩy tế bào chết',
            'Massage mặt',
            'Xông hơi',
            'Cà sũi',
            'Ủ mụn',
            'Hút bã nhờn',
            'Sát khuẩn lần 1',
            'Lấy nhân mụn',
            'Sát khuẩn lần 2',
            'Điện tím',
            'Đắp mặt nạ + Chiếu đèn + Massage đầu',
          ],
          isActive: true,
        },
        {
          name: 'Thải Lọc Da',
          category: 'Chăm Sóc Da',
          priceType: 'single',
          singlePrice: 250000,
          stepsCount: 12,
          steps: [
            'Soi da',
            'Tẩy trang',
            'Rửa mặt',
            'Tẩy tế bào chết',
            'Massage mặt nâng cơ',
            'Xông hơi',
            'Cà sũi',
            'Aqua Peel',
            'Đắp mask',
            'Chiếu đèn sinh học',
            'Massage đầu',
            'Thoa Serum + Điện di',
          ],
          isActive: true,
        },
        {
          name: 'Cấy trắng NANO',
          category: 'Chăm Sóc Da',
          priceType: 'single',
          singlePrice: 350000,
          stepsCount: 13,
          steps: [
            'Tẩy trang',
            'Rửa mặt',
            'Tẩy tế bào chết',
            'Massage mặt',
            'Xông hơi',
            'Cà sũi',
            'Phun Toner',
            'Cấy trắng bằng máy DOSTERPEN',
            'Chiếu ánh sáng',
            'Đắp mask',
            'Massage đầu',
            'Thoa Serum + Điện di',
            'Thoa kem chống nắng',
          ],
          isActive: true,
        },
        {
          name: 'Lấy nhân mụn chuyên sâu',
          category: 'Chăm Sóc Da',
          priceType: 'single',
          singlePrice: 350000,
          stepsCount: 16,
          steps: [
            'Soi da',
            'Tẩy trang',
            'Rửa mặt',
            'Tẩy tế bào chết',
            'Massage mặt',
            'Xông hơi',
            'Cà sũi',
            'Ủ mụn',
            'Hút bã nhờn',
            'Sát khuẩn lần 1',
            'Lấy nhân mụn',
            'Sát khuẩn lần 2',
            'Đắp mặt nạ + Chiếu đèn',
            'Điện di tinh chất',
            'Búa nóng lạnh + Massage đầu',
            'Điện tím',
          ],
          isActive: true,
        },
        {
          name: 'Thải Độc CO2',
          category: 'Chăm Sóc Da',
          priceType: 'single',
          singlePrice: 450000,
          stepsCount: 18,
          steps: [
            'Soi da',
            'Tẩy trang',
            'Rửa mặt',
            'Tẩy tế bào chết',
            'Massage mặt',
            'Xông hơi',
            'Cà sũi',
            'Hút bã nhờn',
            'Sát khuẩn lần 1',
            'Lấy nhân mụn (nếu có ít)',
            'Sát khuẩn lần 2',
            'Điện tím',
            'Thải độc CO2',
            'Chiếu đèn sinh học',
            'Massage đầu',
            'Đắp mask',
            'Thoa Serum + Điện di',
            'Thoa kem chống nắng',
          ],
          isActive: true,
        },
        {
          name: 'PEEL DA',
          category: 'Chăm Sóc Da',
          priceType: 'single',
          singlePrice: 590000,
          stepsCount: 12,
          steps: [
            'Soi da',
            'Tẩy trang',
            'Rửa mặt',
            'Tẩy tế bào chết',
            'Xông hơi',
            'Cà sũi',
            'Hút bã nhờn',
            'Sát khuẩn lần 1',
            'Lấy nhân mụn (nếu có ít)',
            'Sát khuẩn lần 2',
            'Điện tím',
            'Peel da + Điện di',
          ],
          isActive: true,
        },

        // NAIL - GEL POLISH
        {
          name: 'Cắt da tay chân',
          category: 'Nail - Gel Polish',
          priceType: 'single',
          singlePrice: 50000,
          isActive: true,
        },
        {
          name: 'Tháo sơn gel',
          category: 'Nail - Gel Polish',
          priceType: 'single',
          singlePrice: 30000,
          isActive: true,
        },
        {
          name: 'Tháo Úp móng',
          category: 'Nail - Gel Polish',
          priceType: 'single',
          singlePrice: 50000,
          isActive: true,
        },
        {
          name: 'Sơn gel Đài',
          category: 'Nail - Gel Polish',
          priceType: 'single',
          singlePrice: 100000,
          isActive: true,
        },
        {
          name: 'Sơn gel Hàn cao cấp',
          category: 'Nail - Gel Polish',
          priceType: 'single',
          singlePrice: 50000,
          isActive: true,
        },
        {
          name: 'Sơn gel thạch',
          category: 'Nail - Gel Polish',
          priceType: 'range',
          priceRangeMin: 120000,
          priceRangeMax: 150000,
          isActive: true,
        },
        {
          name: 'Sơn mắt mèo (chưa bao gồm nền)',
          category: 'Nail - Gel Polish',
          priceType: 'single',
          singlePrice: 100000,
          isActive: true,
        },
        {
          name: 'Sơn từ 3 màu trở lên',
          category: 'Nail - Gel Polish',
          priceType: 'single',
          singlePrice: 20000,
          description: 'Phụ thu',
          isActive: true,
        },
        {
          name: 'Sơn gel nhũ flash',
          category: 'Nail - Gel Polish',
          priceType: 'range',
          priceRangeMin: 120000,
          priceRangeMax: 150000,
          isActive: true,
        },
        {
          name: 'Sơn gel ngọc trai',
          category: 'Nail - Gel Polish',
          priceType: 'single',
          singlePrice: 120000,
          isActive: true,
        },
        {
          name: 'Sơn xà cừ ngọc trai',
          category: 'Nail - Gel Polish',
          priceType: 'single',
          singlePrice: 200000,
          isActive: true,
        },

        // NAIL - FILLING & EXTENSION
        {
          name: 'Sử lý móng mẻ (xước/gãy)',
          category: 'Nail - Filling & Extension',
          priceType: 'range',
          priceRangeMin: 20000,
          priceRangeMax: 30000,
          isActive: true,
        },
        {
          name: 'Tạo cầu móng Hàn Quốc',
          category: 'Nail - Filling & Extension',
          priceType: 'single',
          singlePrice: 50000,
          isActive: true,
        },
        {
          name: 'Cứng móng',
          category: 'Nail - Filling & Extension',
          priceType: 'single',
          singlePrice: 50000,
          isActive: true,
        },
        {
          name: 'Fill (Gel)',
          category: 'Nail - Filling & Extension',
          priceType: 'single',
          singlePrice: 120000,
          isActive: true,
        },
        {
          name: 'Úp móng gel (bét)',
          category: 'Nail - Filling & Extension',
          priceType: 'single',
          singlePrice: 150000,
          isActive: true,
        },
        {
          name: 'Nối móng đắp bột',
          category: 'Nail - Filling & Extension',
          priceType: 'single',
          singlePrice: 180000,
          isActive: true,
        },
        {
          name: 'Fill (Bột)',
          category: 'Nail - Filling & Extension',
          priceType: 'single',
          singlePrice: 200000,
          isActive: true,
        },
        {
          name: 'Nối móng đắp gel',
          category: 'Nail - Filling & Extension',
          priceType: 'single',
          singlePrice: 250000,
          isActive: true,
        },

        // NAIL - DESIGN
        {
          name: 'Sơn phủ trang trí',
          category: 'Nail - Design',
          priceType: 'custom',
          description: 'Theo yêu cầu',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Vẽ gel',
          category: 'Nail - Design',
          priceType: 'custom',
          description: 'Theo yêu cầu',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Vẽ nổi',
          category: 'Nail - Design',
          priceType: 'custom',
          description: 'Theo yêu cầu',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'French đầu móng',
          category: 'Nail - Design',
          priceType: 'custom',
          description: 'Theo yêu cầu',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Ombere, loang, tráng gương',
          category: 'Nail - Design',
          priceType: 'custom',
          description: 'Theo yêu cầu',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Ẩn xà cừ, hoa khô, kim tuyến',
          category: 'Nail - Design',
          priceType: 'custom',
          description: 'Theo yêu cầu',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Đính đá',
          category: 'Nail - Design',
          priceType: 'custom',
          description: 'Theo yêu cầu',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Sticker',
          category: 'Nail - Design',
          priceType: 'custom',
          description: 'Theo yêu cầu',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Phụ kiện nhỏ',
          category: 'Nail - Design',
          priceType: 'custom',
          description: 'Theo yêu cầu',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Vẽ theo yêu cầu',
          category: 'Nail - Design',
          priceType: 'custom',
          description: 'Liên hệ trước',
          hasCustomDesign: true,
          isActive: true,
        },
      ];

      savedServices = [];
      for (const service of services) {
        const saved = await serviceRepository.save(service);
        savedServices.push(saved);
        console.log(`✅ Service created: ${saved.name} (${saved.category})`);
      }
      console.log(`\n📊 Total services created: ${savedServices.length}`);
      console.log(`   - Gội Đầu Dưỡng Sinh: 4`);
      console.log(`   - Triệt Lông: 11`);
      console.log(`   - Mi: 13`);
      console.log(`   - Dịch Vụ Khác: 15`);
      console.log(`   - Chăm Sóc Da: 7`);
      console.log(`   - Nail (Gel Polish): 11`);
      console.log(`   - Nail (Filling & Extension): 8`);
      console.log(`   - Nail (Design): 10`);
    } else {
      console.log(`⏭️  Services already exist (${savedServices.length} services), skipping...`);
    }

    // 4. Seed Employees
    console.log('\nCreating employees...');
    const employeeRepository = dataSource.getRepository('Employee');
    let savedEmployees: any[] = await employeeRepository.find();

    if (savedEmployees.length === 0) {
      const employees = [
        {
          fullName: 'Nguyễn Thị Hoa',
          email: 'hoa@spa.com',
          phone: '0901234567',
          role: 'therapist',
          specialization: 'Chăm Sóc Da, Gội Đầu',
          isActive: true,
          hireDate: new Date('2023-01-15'),
        },
        {
          fullName: 'Trần Văn Nam',
          email: 'nam@spa.com',
          phone: '0902234567',
          role: 'therapist',
          specialization: 'Nail, Triệt Lông',
          isActive: true,
          hireDate: new Date('2023-03-20'),
        },
        {
          fullName: 'Lê Thị Mai',
          email: 'mai@spa.com',
          phone: '0903234567',
          role: 'therapist',
          specialization: 'Mi, Massage',
          isActive: true,
          hireDate: new Date('2023-05-10'),
        },
        {
          fullName: 'Phạm Văn Bình',
          email: 'binh@spa.com',
          phone: '0904234567',
          role: 'therapist',
          specialization: 'Massage, Gội Đầu',
          isActive: true,
          hireDate: new Date('2023-06-01'),
        },
        {
          fullName: 'Võ Thị Hương',
          email: 'huongvo@spa.com',
          phone: '0905234567',
          role: 'therapist',
          specialization: 'Chăm Sóc Da, Nail',
          isActive: true,
          hireDate: new Date('2023-07-15'),
        },
        {
          fullName: 'Đặng Thị Thu',
          email: 'thu@spa.com',
          phone: '0906234567',
          role: 'receptionist',
          specialization: null,
          isActive: true,
          hireDate: new Date('2023-08-01'),
        },
      ];

      savedEmployees = [];
      for (const employee of employees) {
        const saved = await employeeRepository.save(employee);
        savedEmployees.push(saved);
        console.log(`✅ Employee created: ${saved.fullName} (${saved.role})`);
      }
    } else {
      console.log(`⏭️  Employees already exist (${savedEmployees.length} employees), skipping...`);
    }

    // 4.5 Seed Employee Schedules (lịch làm việc hàng tuần)
    console.log('\nCreating employee schedules...');
    const scheduleRepository = dataSource.getRepository('EmployeeSchedule');
    const existingSchedules = await scheduleRepository.find();

    if (existingSchedules.length === 0 && savedEmployees.length > 0) {
      // Lịch mặc định cho therapists: T2-T7 (9:00-18:00), nghỉ CN
      // Receptionist: T2-T6 (8:30-17:30), nghỉ T7+CN
      const daysOfWeek = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ];

      for (const employee of savedEmployees) {
        const isTherapist = (employee as any).role === 'therapist';
        const isReceptionist = (employee as any).role === 'receptionist';

        for (const day of daysOfWeek) {
          let scheduleData: any;

          if (isTherapist) {
            if (day === 'sunday') {
              // CN nghỉ
              scheduleData = {
                employeeId: (employee as any).id,
                dayOfWeek: day,
                startTime: '00:00',
                endTime: '00:00',
                isDayOff: true,
                note: 'Nghỉ Chủ Nhật',
              };
            } else if (day === 'saturday') {
              // T7 làm nửa ngày
              scheduleData = {
                employeeId: (employee as any).id,
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '15:00',
                breakStartTime: '12:00',
                breakEndTime: '12:30',
                isDayOff: false,
                note: 'Thứ 7 làm nửa ngày',
              };
            } else {
              // T2-T6 full day
              scheduleData = {
                employeeId: (employee as any).id,
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '18:00',
                breakStartTime: '12:00',
                breakEndTime: '13:00',
                isDayOff: false,
                note: null,
              };
            }
          } else if (isReceptionist) {
            if (day === 'saturday' || day === 'sunday') {
              // T7+CN nghỉ
              scheduleData = {
                employeeId: (employee as any).id,
                dayOfWeek: day,
                startTime: '00:00',
                endTime: '00:00',
                isDayOff: true,
                note: day === 'saturday' ? 'Nghỉ Thứ 7' : 'Nghỉ Chủ Nhật',
              };
            } else {
              // T2-T6
              scheduleData = {
                employeeId: (employee as any).id,
                dayOfWeek: day,
                startTime: '08:30',
                endTime: '17:30',
                breakStartTime: '12:00',
                breakEndTime: '13:00',
                isDayOff: false,
                note: null,
              };
            }
          } else {
            // Manager hoặc role khác: T2-T6
            if (day === 'saturday' || day === 'sunday') {
              scheduleData = {
                employeeId: (employee as any).id,
                dayOfWeek: day,
                startTime: '00:00',
                endTime: '00:00',
                isDayOff: true,
                note: 'Nghỉ cuối tuần',
              };
            } else {
              scheduleData = {
                employeeId: (employee as any).id,
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '18:00',
                breakStartTime: '12:00',
                breakEndTime: '13:00',
                isDayOff: false,
                note: null,
              };
            }
          }

          await scheduleRepository.save(scheduleData);
        }
        console.log(`✅ Schedule created for: ${(employee as any).fullName} (${(employee as any).role})`);
      }

      // Thêm vài ngày nghỉ riêng (specificDate) làm ví dụ
      const therapists = savedEmployees.filter((e: any) => e.role === 'therapist');
      if (therapists.length >= 2) {
        // Nhân viên 1 nghỉ phép ngày 2026-02-14
        await scheduleRepository.save({
          employeeId: (therapists[0] as any).id,
          specificDate: new Date('2026-02-14'),
          startTime: '00:00',
          endTime: '00:00',
          isDayOff: true,
          note: 'Nghỉ phép - Valentine',
        });
        console.log(`✅ Day-off created for ${(therapists[0] as any).fullName} on 2026-02-14`);

        // Nhân viên 2 làm thêm Chủ Nhật 2026-02-15
        await scheduleRepository.save({
          employeeId: (therapists[1] as any).id,
          specificDate: new Date('2026-02-15'),
          startTime: '10:00',
          endTime: '16:00',
          isDayOff: false,
          note: 'Làm thêm cuối tuần',
        });
        console.log(`✅ Extra schedule created for ${(therapists[1] as any).fullName} on 2026-02-15`);
      }
    } else if (existingSchedules.length > 0) {
      console.log(`⏭️  Schedules already exist (${existingSchedules.length} records), skipping...`);
    } else {
      console.log('⚠️  Skipping schedules: No employees found');
    }

    // 5. Seed Customers
    console.log('\nCreating customers...');
    const customerRepository = dataSource.getRepository('Customer');
    let savedCustomers: any[] = await customerRepository.find();

    if (savedCustomers.length === 0) {
      const customers = [
        {
          fullName: 'Phạm Thị Lan',
          email: 'lan@gmail.com',
          phone: '0911234567',
          dateOfBirth: new Date('1990-05-15'),
          address: '123 Nguyễn Huệ, Q.1, TP.HCM',
          totalVisits: 0,
          totalSpent: 0,
        },
        {
          fullName: 'Hoàng Văn Minh',
          email: 'minh@gmail.com',
          phone: '0912234567',
          dateOfBirth: new Date('1985-08-20'),
          address: '456 Lê Lợi, Q.1, TP.HCM',
          totalVisits: 0,
          totalSpent: 0,
        },
        {
          fullName: 'Võ Thị Hương',
          email: 'huong@gmail.com',
          phone: '0913234567',
          dateOfBirth: new Date('1995-03-10'),
          address: '789 Hai Bà Trưng, Q.3, TP.HCM',
          totalVisits: 0,
          totalSpent: 0,
        },
      ];

      savedCustomers = [];
      for (const customer of customers) {
        const saved = await customerRepository.save(customer);
        savedCustomers.push(saved);
        console.log(`✅ Customer created: ${saved.fullName}`);
      }
    } else {
      console.log(`⏭️  Customers already exist (${savedCustomers.length} customers), skipping...`);
    }

    // 6. Seed Sample Bookings with Multiple Employees
    console.log('\nCreating sample bookings...');
    const bookingRepository = dataSource.getRepository('Booking');
    const bookingEmployeeRepository = dataSource.getRepository('BookingEmployee');
    const existingBookings = await bookingRepository.find();

    if (
      existingBookings.length === 0 &&
      savedServices.length > 0 &&
      savedEmployees.length > 0 &&
      savedCustomers.length > 0
    ) {
      // Tìm services theo category
      const combo2Service = savedServices.find((s) => s.name === 'Combo 2');
      const chamSocDaService = savedServices.find((s) => s.name === 'Lấy Nhân Mụn Cơ bản');
      const nailService = savedServices.find((s) => s.name === 'Sơn gel Hàn cao cấp');

      // Booking 1: Customer 1 books Combo 2 (Gội đầu) với 2 guests
      if (combo2Service) {
        const booking1 = await bookingRepository.save({
          customerId: savedCustomers[0].id,
          serviceId: combo2Service.id,
          treatmentId: null,
          timeSlotId: timeSlots[2].id, // 11:00-12:00
          bookingDate: new Date('2026-01-27'),
          numberOfGuests: 2,
          status: 'confirmed',
          totalPrice: combo2Service.singlePrice * 2,
          notes: 'Khách VIP, yêu cầu phòng riêng',
        });

        await bookingEmployeeRepository.save([
          { bookingId: booking1.id, employeeId: savedEmployees[0].id }, // Nguyễn Thị Hoa
          { bookingId: booking1.id, employeeId: savedEmployees[3].id }, // Phạm Văn Bình
        ]);
        console.log(`✅ Booking created: ${booking1.id} - Combo 2 with 2 employees`);
      }

      // Booking 2: Customer 2 books Chăm sóc da với 1 guest
      if (chamSocDaService) {
        const booking2 = await bookingRepository.save({
          customerId: savedCustomers[1].id,
          serviceId: chamSocDaService.id,
          treatmentId: null,
          timeSlotId: timeSlots[3].id, // 12:00-13:00
          bookingDate: new Date('2026-01-27'),
          numberOfGuests: 1,
          status: 'pending',
          totalPrice: chamSocDaService.singlePrice,
          notes: 'Khách mới, cần tư vấn',
        });

        await bookingEmployeeRepository.save([
          { bookingId: booking2.id, employeeId: savedEmployees[0].id }, // Nguyễn Thị Hoa
        ]);
        console.log(`✅ Booking created: ${booking2.id} - Chăm sóc da with 1 employee`);
      }

      // Booking 3: Customer 3 books Nail với 1 guest
      if (nailService) {
        const booking3 = await bookingRepository.save({
          customerId: savedCustomers[2].id,
          serviceId: nailService.id,
          treatmentId: null,
          timeSlotId: timeSlots[4].id, // 13:00-14:00
          bookingDate: new Date('2026-01-28'),
          numberOfGuests: 1,
          status: 'confirmed',
          totalPrice: nailService.singlePrice,
          notes: 'Khách quen',
        });

        await bookingEmployeeRepository.save([
          { bookingId: booking3.id, employeeId: savedEmployees[1].id }, // Trần Văn Nam
        ]);
        console.log(`✅ Booking created: ${booking3.id} - Nail with 1 employee`);
      }

      // Update time slot current bookings
      timeSlots[2].currentBookings = 2;
      timeSlots[3].currentBookings = 1;
      timeSlots[4].currentBookings = 1;
      await timeSlotRepository.save([timeSlots[2], timeSlots[3], timeSlots[4]]);
      console.log('✅ Time slots updated with current bookings');
    } else if (existingBookings.length > 0) {
      console.log(`⏭️  Bookings already exist (${existingBookings.length} bookings), skipping...`);
    } else {
      console.log(
        '⚠️  Skipping bookings creation: Missing required data (services, employees, or customers)',
      );
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📝 Default admin credentials:');
    console.log('   Email: admin@spa.com');
    console.log('   Password: admin123');
    console.log('\n📊 Database statistics:');
    console.log(`   - Time Slots: ${timeSlots.length}`);
    console.log(`   - Services: ${savedServices.length}`);
    console.log(
      `   - Employees: ${savedEmployees.length} (${savedEmployees.filter((e) => e.role === 'therapist').length} therapists)`,
    );
    console.log(`   - Employee Schedules: ${(await scheduleRepository.find()).length} records`);
    console.log(`   - Customers: ${savedCustomers.length}`);
    console.log(`   - Sample Bookings: 3`);
    console.log('\n💡 Service Categories:');
    console.log('   - Gội Đầu Dưỡng Sinh (4 combos)');
    console.log('   - Triệt Lông (11 zones)');
    console.log('   - Mi (13 services)');
    console.log('   - Chăm Sóc Da (7 services)');
    console.log('   - Nail - Gel Polish (11 services)');
    console.log('   - Nail - Filling & Extension (8 services)');
    console.log('   - Nail - Design (10 services)');
    console.log('   - Dịch Vụ Khác (15 services)');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
