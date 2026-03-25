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
      name: 'DỊCH VỤ NAIL',
      description: 'Sơn gel cao cấp, nối móng và tạo form theo phong cách Hàn Quốc, mang đến vẻ đẹp hoàn hảo cho đôi tay.',
      singlePrice: 200000,
      priceType: 'single' as const,
      duration: '60 phút',
      durationMinutes: 60,
      category: 'Nail Art',
    },
    {
      name: 'MASSAGE BODY',
      description: 'Massage toàn thân giúp thư giãn cơ bắp, giảm căng thẳng và tăng cường tuần hoàn máu.',
      singlePrice: 350000,
      priceType: 'single' as const,
      duration: '60 phút',
      durationMinutes: 60,
      category: 'Spa',
    },
    {
      name: 'GỘI ĐẦU DƯỠNG SINH',
      description: 'Chăm sóc tóc và da đầu với các liệu pháp thảo dược tự nhiên, giúp thư giãn và phục hồi sức sống cho mái tóc.',
      singlePrice: 120000,
      priceType: 'single' as const,
      duration: '45 phút',
      durationMinutes: 45,
      category: 'Hair',
    },
    {
      name: 'CHĂM SÓC DA',
      description: 'Các liệu trình chăm sóc da chuyên sâu, từ lấy nhân mụn đến thải độc và làm trắng da bằng công nghệ hiện đại.',
      singlePrice: 400000,
      priceType: 'single' as const,
      duration: '60 phút',
      durationMinutes: 60,
      category: 'Skincare',
    },
    {
      name: 'TRIỆT LÔNG',
      description: 'Dịch vụ triệt lông chuyên nghiệp với công nghệ tiên tiến, an toàn và hiệu quả cho mọi vùng da.',
      singlePrice: 500000,
      priceType: 'single' as const,
      duration: '30 phút',
      durationMinutes: 30,
      category: 'Hair Removal',
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
