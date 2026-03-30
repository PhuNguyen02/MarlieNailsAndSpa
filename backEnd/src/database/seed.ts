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
        // ========================
        // DESIGN (Nail Art)
        // ========================
        {
          name: 'Sơn phủ trong trang trí',
          description: 'Sơn phủ bóng bảo vệ lớp trang trí nail, giữ màu bền lâu.',
          singlePrice: 10000,
          priceType: 'single',
          duration: '10 phút',
          durationMinutes: 10,
          category: 'Design',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Vẽ gel',
          description: 'Vẽ gel nghệ thuật trên móng, tạo hoa văn, họa tiết tinh tế.',
          priceType: 'range',
          priceRangeMin: 5000,
          priceRangeMax: 50000,
          duration: '15-30 phút',
          durationMinutes: 30,
          category: 'Design',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Vẽ nổi',
          description: 'Vẽ nổi 3D trên móng, tạo hiệu ứng hoa, lá, hình nghệ thuật nổi bật.',
          priceType: 'range',
          priceRangeMin: 20000,
          priceRangeMax: 40000,
          duration: '20-30 phút',
          durationMinutes: 30,
          category: 'Design',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'French đầu móng',
          description: 'Vẽ French tip cổ điển hoặc biến tấu trên đầu móng.',
          priceType: 'range',
          priceRangeMin: 10000,
          priceRangeMax: 20000,
          duration: '15-20 phút',
          durationMinutes: 20,
          category: 'Design',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Ombre, loang, tráng gương',
          description: 'Kỹ thuật ombre chuyển màu, loang nghệ thuật hoặc tráng gương bóng sáng trên móng.',
          priceType: 'range',
          priceRangeMin: 15000,
          priceRangeMax: 30000,
          duration: '20-30 phút',
          durationMinutes: 30,
          category: 'Design',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Ấn xà cừ, hoa khô, kim tuyến',
          description: 'Đắp phụ kiện hoa khô, xà cừ, kim tuyến lên móng tạo điểm nhấn.',
          priceType: 'range',
          priceRangeMin: 20000,
          priceRangeMax: 50000,
          duration: '15-20 phút',
          durationMinutes: 20,
          category: 'Design',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Đính đá',
          description: 'Đính đá pha lê, đá quý lên móng tạo vẻ sang trọng, lấp lánh.',
          priceType: 'range',
          priceRangeMin: 10000,
          priceRangeMax: 100000,
          duration: '15-30 phút',
          durationMinutes: 30,
          category: 'Design',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Sticker',
          description: 'Dán sticker trang trí móng với nhiều mẫu mã đa dạng.',
          priceType: 'range',
          priceRangeMin: 10000,
          priceRangeMax: 30000,
          duration: '10 phút',
          durationMinutes: 10,
          category: 'Design',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Phụ kiện nhỏ',
          description: 'Gắn phụ kiện nhỏ trang trí móng (vui lòng liên hệ trước, giá sẽ phụ thuộc chi tiết của hình vẽ).',
          priceType: 'range',
          priceRangeMin: 5000,
          priceRangeMax: 15000,
          duration: '10-20 phút',
          durationMinutes: 20,
          category: 'Design',
          hasCustomDesign: true,
          isActive: true,
        },
        {
          name: 'Vẽ theo yêu cầu',
          description: 'Vẽ nail theo yêu cầu riêng của khách (vui lòng liên hệ trước, giá sẽ phụ thuộc chi tiết của hình vẽ).',
          priceType: 'custom',
          duration: '30-60 phút',
          durationMinutes: 60,
          category: 'Design',
          hasCustomDesign: true,
          isActive: true,
        },

        // ========================
        // EYE LASH (Nối mi)
        // ========================
        {
          name: 'Nối mi classic',
          description: 'Nối mi classic 1:1 tự nhiên, phù hợp với mọi phong cách.',
          singlePrice: 300000,
          priceType: 'single',
          duration: '60-90 phút',
          durationMinutes: 90,
          category: 'Eye Lash',
          isActive: true,
        },
        {
          name: 'Nối mi volume',
          description: 'Nối mi volume dày, bồng bềnh, tạo đôi mắt cuốn hút.',
          priceType: 'range',
          priceRangeMin: 250000,
          priceRangeMax: 350000,
          duration: '90-120 phút',
          durationMinutes: 120,
          category: 'Eye Lash',
          isActive: true,
        },
        {
          name: 'Nối mi katun',
          description: 'Nối mi katun (cotton) mềm mại, nhẹ nhàng, giữ lâu.',
          priceType: 'range',
          priceRangeMin: 250000,
          priceRangeMax: 350000,
          duration: '90-120 phút',
          durationMinutes: 120,
          category: 'Eye Lash',
          isActive: true,
        },
        {
          name: 'Nối mi Ani me baby',
          description: 'Nối mi Ani me baby tự nhiên, nhẹ nhàng phù hợp cho người mới.',
          singlePrice: 250000,
          priceType: 'single',
          duration: '60-90 phút',
          durationMinutes: 90,
          category: 'Eye Lash',
          isActive: true,
        },
        {
          name: 'Nối mi đuôi cá',
          description: 'Nối mi đuôi cá tạo hiệu ứng mắt cáo, quyến rũ.',
          singlePrice: 250000,
          priceType: 'single',
          duration: '90 phút',
          durationMinutes: 90,
          category: 'Eye Lash',
          isActive: true,
        },
        {
          name: 'Nối mi thiết kế',
          description: 'Nối mi thiết kế theo yêu cầu, tạo kiểu mắt riêng biệt.',
          priceType: 'range',
          priceRangeMin: 350000,
          priceRangeMax: 450000,
          duration: '90-120 phút',
          durationMinutes: 120,
          category: 'Eye Lash',
          isActive: true,
        },
        {
          name: 'Nối mi lông chồn',
          description: 'Nối mi lông chồn cao cấp, mềm mại, bền đẹp tự nhiên.',
          singlePrice: 350000,
          priceType: 'single',
          duration: '90-120 phút',
          durationMinutes: 120,
          category: 'Eye Lash',
          isActive: true,
        },
        {
          name: 'Mi nâu',
          description: 'Nối mi màu nâu tự nhiên, tạo phong cách nhẹ nhàng.',
          priceType: 'range',
          priceRangeMin: 230000,
          priceRangeMax: 350000,
          duration: '90 phút',
          durationMinutes: 90,
          category: 'Eye Lash',
          isActive: true,
        },
        {
          name: 'Tháo mi',
          description: 'Tháo mi nối an toàn, nhẹ nhàng không làm hỏng mi thật.',
          singlePrice: 40000,
          priceType: 'single',
          duration: '20-30 phút',
          durationMinutes: 30,
          category: 'Eye Lash',
          isActive: true,
        },
        {
          name: 'Uốn mi',
          description: 'Uốn mi cong tự nhiên, giúp mắt to tròn hơn.',
          singlePrice: 200000,
          priceType: 'single',
          duration: '30-45 phút',
          durationMinutes: 45,
          category: 'Eye Lash',
          isActive: true,
        },
        {
          name: 'Nối mi dưới',
          description: 'Nối mi dưới tạo đôi mắt búp bê, thêm chiều sâu cho ánh nhìn.',
          priceType: 'range',
          priceRangeMin: 50000,
          priceRangeMax: 100000,
          duration: '45-60 phút',
          durationMinutes: 60,
          category: 'Eye Lash',
          isActive: true,
        },
        {
          name: 'Mix mi màu',
          description: 'Mix kết hợp mi màu sắc đa dạng, tạo điểm nhấn cho đôi mắt.',
          priceType: 'range',
          priceRangeMin: 30000,
          priceRangeMax: 100000,
          duration: '90-120 phút',
          durationMinutes: 120,
          category: 'Eye Lash',
          isActive: true,
        },

        // ========================
        // GỘI ĐẦU DƯỠNG SINH
        // ========================
        {
          name: 'Gội Đầu Dưỡng Sinh - Combo 1',
          description: 'Combo gội đầu dưỡng sinh cơ bản 7 bước, thư giãn nhẹ nhàng.',
          category: 'Gội Đầu Dưỡng Sinh',
          priceType: 'single',
          singlePrice: 79000,
          duration: '35 phút',
          durationMinutes: 35,
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
          isActive: true,
        },
        {
          name: 'Gội Đầu Dưỡng Sinh - Combo 2',
          description: 'Combo gội đầu dưỡng sinh nâng cao 12 bước, kết hợp massage mặt và ngâm chân thảo dược.',
          category: 'Gội Đầu Dưỡng Sinh',
          priceType: 'single',
          singlePrice: 179000,
          duration: '55 phút',
          durationMinutes: 55,
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
          isActive: true,
        },
        {
          name: 'Gội Đầu Dưỡng Sinh - Combo 3',
          description: 'Combo gội đầu dưỡng sinh cao cấp 10 bước, kết hợp tẩy tế bào chết da mặt và massage chuyên sâu.',
          category: 'Gội Đầu Dưỡng Sinh',
          priceType: 'single',
          singlePrice: 229000,
          duration: '70 phút',
          durationMinutes: 70,
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
          isActive: true,
        },
        {
          name: 'Gội Đầu Dưỡng Sinh - Combo 4',
          description: 'Combo gội đầu dưỡng sinh VIP 12 bước, trọn gói massage đá ngọc thạch và rửa bọt tai.',
          category: 'Gội Đầu Dưỡng Sinh',
          priceType: 'single',
          singlePrice: 329000,
          duration: '90 phút',
          durationMinutes: 90,
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
          isActive: true,
        },

        // ========================
        // CHĂM SÓC DA
        // ========================
        {
          name: 'Chăm Sóc Da',
          description: 'Liệu trình chăm sóc da mặt chuyên sâu, làm sạch sâu, lấy mụn và dưỡng da toàn diện.',
          singlePrice: 349000,
          priceType: 'single',
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
          isActive: true,
        },

        // ========================
        // DỊCH VỤ DA
        // ========================
        {
          name: 'Hút chì thải độc',
          description: 'Hút chì thải độc da mặt, giúp da sáng mịn, loại bỏ độc tố tích tụ.',
          singlePrice: 200000,
          priceType: 'single',
          duration: '45 phút',
          durationMinutes: 45,
          category: 'Dịch Vụ Da',
          isActive: true,
        },
        {
          name: 'Cấy tảo, collagen, phấn',
          description: 'Cấy tảo xoắn, collagen và phấn vào da, giúp da căng mịn, trẻ hóa.',
          singlePrice: 200000,
          priceType: 'single',
          duration: '45 phút',
          durationMinutes: 45,
          category: 'Dịch Vụ Da',
          isActive: true,
        },

        // ========================
        // DỊCH VỤ LẺ (Tất cả các dịch vụ Mua 5 tặng 1)
        // ========================
        {
          name: 'Tắm trắng mỡ hộp',
          description: 'Tắm trắng toàn thân bằng mỡ hộp, giúp da trắng sáng đều màu. Mua 5 tặng 1.',
          singlePrice: 450000,
          priceType: 'single',
          duration: '60 phút',
          durationMinutes: 60,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Tắm trắng nhung, nổi ruồi',
          description: 'Tắm trắng nhung hoặc nổi ruồi, giá tùy theo diện tích vùng da. Mua 5 tặng 1.',
          priceType: 'range',
          priceRangeMin: 30000,
          priceRangeMax: 300000,
          duration: '30-60 phút',
          durationMinutes: 60,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Tẩy tế bào chết da đầu',
          description: 'Tẩy tế bào chết da đầu, giúp da đầu sạch gàu, thông thoáng và khỏe mạnh. Mua 5 tặng 1.',
          singlePrice: 35000,
          priceType: 'single',
          duration: '15 phút',
          durationMinutes: 15,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Tẩy tế bào chết da mặt',
          description: 'Tẩy tế bào chết da mặt, giúp da mịn màng và hấp thu dưỡng chất tốt hơn. Mua 5 tặng 1.',
          singlePrice: 35000,
          priceType: 'single',
          duration: '15 phút',
          durationMinutes: 15,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Xông tiên tai',
          description: 'Xông tiên tai thảo dược, giúp thư giãn và thải độc. Mua 5 tặng 1.',
          singlePrice: 35000,
          priceType: 'single',
          duration: '15 phút',
          durationMinutes: 15,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Massage mặt chuyên sâu nâng cơ',
          description: 'Massage mặt chuyên sâu nâng cơ, giúp da săn chắc, trẻ trung hơn. Mua 5 tặng 1.',
          singlePrice: 99000,
          priceType: 'single',
          duration: '30 phút',
          durationMinutes: 30,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Đá ngọc thạch',
          description: 'Massage bằng đá ngọc thạch, giúp cân bằng năng lượng và thư giãn. Phụ thu khi kết hợp dịch vụ khác. Mua 5 tặng 1.',
          singlePrice: 40000,
          priceType: 'single',
          duration: '30 phút',
          durationMinutes: 30,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Massage body',
          description: 'Massage toàn thân giúp thư giãn cơ bắp, giảm căng thẳng và tăng cường tuần hoàn máu. Mua 5 tặng 1.',
          priceType: 'custom',
          duration: '60-90 phút',
          durationMinutes: 90,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Massage thạch',
          description: 'Massage bằng đá thạch anh, giúp cân bằng năng lượng và thư giãn sâu. Mua 5 tặng 1.',
          priceType: 'custom',
          duration: '60 phút',
          durationMinutes: 60,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Đá nóng',
          description: 'Massage đá nóng, giúp thư giãn cơ bắp và tăng tuần hoàn máu. Phụ thu thêm khi kết hợp dịch vụ khác. Mua 5 tặng 1.',
          singlePrice: 40000,
          priceType: 'single',
          duration: '30 phút',
          durationMinutes: 30,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Ngâm chân thảo dược + massage chân',
          description: 'Ngâm chân thảo dược kết hợp massage chân, giúp lưu thông máu và thư giãn. Mua 5 tặng 1.',
          singlePrice: 40000,
          priceType: 'single',
          duration: '30 phút',
          durationMinutes: 30,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Chà gót chân + massage chân',
          description: 'Chà gót chân sạch da chết kết hợp massage chân thư giãn. Mua 5 tặng 1.',
          singlePrice: 149000,
          priceType: 'single',
          duration: '40 phút',
          durationMinutes: 40,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Máy thải độc trị đau chân',
          description: 'Sử dụng máy thải độc chuyên dụng giúp giảm đau chân, thải độc tố qua bàn chân. Mua 5 tặng 1.',
          singlePrice: 60000,
          priceType: 'single',
          duration: '30 phút',
          durationMinutes: 30,
          category: 'Dịch Vụ Lẻ',
          isActive: true,
        },
        {
          name: 'Các loại mặt nạ',
          description: 'Đắp mặt nạ dưỡng da với nhiều loại: collagen, hyaluronic, trà xanh, than hoạt tính... Mua 5 tặng 1.',
          singlePrice: 30000,
          priceType: 'single',
          duration: '20 phút',
          durationMinutes: 20,
          category: 'Dịch Vụ Lẻ',
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
      ];

      savedServices = [];
      for (const service of services) {
        const saved = await serviceRepository.save(service);
        savedServices.push(saved);
        console.log(`✅ Service created: ${saved.name} (${saved.category})`);
      }
      console.log(`\n📊 Total services created: ${savedServices.length}`);
      console.log(`   - Design: 10`);
      console.log(`   - Eye Lash: 12`);
      console.log(`   - Gội Đầu Dưỡng Sinh: 4`);
      console.log(`   - Chăm Sóc Da: 1`);
      console.log(`   - Dịch Vụ Da: 2`);
      console.log(`   - Dịch Vụ Lẻ: 14`);
      console.log(`   - Triệt Lông: 11`);
      console.log(`   - Nail - Gel Polish: 11`);
      console.log(`   - Nail - Filling & Extension: 8`);
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
      const combo2Service = savedServices.find((s) => s.name === 'Gội Đầu Dưỡng Sinh - Combo 2');
      const chamSocDaService = savedServices.find((s) => s.name === 'Chăm Sóc Da');
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
    console.log('   - Design (10 services)');
    console.log('   - Eye Lash (12 services)');
    console.log('   - Gội Đầu Dưỡng Sinh (4 combos)');
    console.log('   - Chăm Sóc Da (1 service)');
    console.log('   - Dịch Vụ Da (2 services)');
    console.log('   - Dịch Vụ Lẻ (14 services)');
    console.log('   - Triệt Lông (11 zones)');
    console.log('   - Nail - Gel Polish (11 services)');
    console.log('   - Nail - Filling & Extension (8 services)');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
