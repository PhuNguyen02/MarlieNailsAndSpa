# 🏥 Spa Backend - Hệ Thống Quản Lý Spa

Backend API cho hệ thống quản lý spa được xây dựng với **NestJS**, **TypeORM**, và **MySQL**.

## 🎯 Tính Năng Chính

### ✅ Authentication & Authorization

- Đăng ký/Đăng nhập admin với JWT
- Mã hóa mật khẩu với bcrypt
- Bảo vệ API với JWT Guards

### ✅ Quản Lý Booking

- **CRUD đầy đủ** cho đơn đặt lịch
- **Check availability** - Kiểm tra khung giờ còn trống
- **Multiple guests** - Đặt nhiều khách trong 1 booking
- **Time slot division** - Chia khung giờ trong ngày
- **Auto disable/enable** - Tự động quản lý khung giờ khi full/hủy
- **Double booking prevention** - Ngăn chặn đặt trùng lịch

### ✅ Hệ Thống Thông Báo

- Tự động tạo thông báo khi có booking mới
- Thông báo khi booking được xác nhận/hủy/hoàn thành
- API lấy và đánh dấu đã đọc

### ✅ Quản Lý

- **Services** - Dịch vụ spa (massage, facial, etc.)
- **Treatments** - Liệu trình chi tiết
- **Customers** - Khách hàng với lịch sử
- **Employees** - Nhân viên spa
- **Time Slots** - Khung giờ đặt lịch

## 🛠️ Tech Stack

- **Framework**: NestJS 11.x
- **Database**: MySQL 8.x + TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Password Hashing**: bcrypt
- **Language**: TypeScript

## 📦 Cài Đặt Nhanh

### 1. Clone và cài đặt dependencies

```bash
git clone <repository-url>
cd spa-backend
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=spa_db

# Application
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### 3. Tạo database

```bash
mysql -u root -p -e "CREATE DATABASE spa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 4. Chạy migrations

```bash
npm run build
npm run migration:run
```

### 5. (Optional) Seed data mẫu

```bash
npm run seed
```

### 6. Khởi động server

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Server chạy tại: **http://localhost:3000**

## 📊 Database Schema

8 bảng chính:

```
admins                  # Tài khoản admin
services                # Dịch vụ spa
treatments              # Liệu trình
employees               # Nhân viên
customers               # Khách hàng
time_slots              # Khung giờ
bookings                # Đơn đặt lịch
booking_notifications   # Thông báo
```

Xem chi tiết: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

## 📚 API Documentation

### Authentication

```bash
# Login
POST /auth/login
{
  "email": "admin@spa.com",
  "password": "admin123"
}

# Response
{
  "access_token": "eyJhbGc...",
  "admin": {...}
}
```

### Bookings

```bash
# Get available slots for date
GET /bookings/available-slots/2024-01-25

# Create booking
POST /bookings
{
  "customerId": "uuid",
  "serviceId": "uuid",
  "bookingDate": "2024-01-25",
  "timeSlotId": "uuid",
  "numberOfGuests": 2,
  "totalPrice": 1000000
}
```

Xem đầy đủ: [API_EXAMPLES.md](./API_EXAMPLES.md)

## 🔐 Sample Account (Sau khi seed)

```
Email: admin@spa.com
Password: admin123
```

## 📁 Project Structure

```
src/
├── auth/              # Authentication module
├── bookings/          # Booking management
├── customers/         # Customer management
├── services/          # Service management
├── time-slots/        # Time slot management
├── entities/          # TypeORM entities
├── config/            # Configuration
├── database/          # Seed scripts
└── migrations/        # Database migrations
```

## 🚀 Scripts

```bash
# Development
npm run start:dev      # Start with watch mode
npm run build          # Build project
npm run start:prod     # Start production

# Database
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration
npm run seed              # Seed sample data

# Testing
npm test                  # Run tests
npm run test:e2e         # E2E tests
```

## 📖 Documentation Files

- **[SETUP.md](./SETUP.md)** - Hướng dẫn cài đặt chi tiết
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Schema database với ERD
- **[API_EXAMPLES.md](./API_EXAMPLES.md)** - Examples API với Postman collection
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Tóm tắt dự án

## ✨ Highlights

### Smart Booking System

- ✅ Real-time availability check
- ✅ Automatic capacity management
- ✅ Double booking prevention
- ✅ Time slot auto enable/disable

### Security

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Input validation
- ✅ SQL injection prevention

### Business Logic

- ✅ Customer statistics tracking
- ✅ Automatic notifications
- ✅ Booking status workflow
- ✅ Cancellation handling

## 🧪 Testing

```bash
# Get available time slots
curl http://localhost:3000/bookings/available-slots/2024-01-25

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@spa.com","password":"admin123"}'

# Create booking (with token)
curl -X POST http://localhost:3000/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "uuid",
    "serviceId": "uuid",
    "bookingDate": "2024-01-25",
    "timeSlotId": "uuid",
    "numberOfGuests": 2,
    "totalPrice": 1000000
  }'
```

## 🔄 Booking Flow

```
Customer → Choose Service → Select Date → View Available Slots
→ Select Time & Guests → Check Availability → Create Booking
→ System validates & prevents double booking
→ Auto update time slot capacity → Send notification
→ Admin confirms → Update status → Customer receives notification
```

## 📈 Features Roadmap

### Phase 1 (✅ Completed)

- [x] Authentication & Authorization
- [x] Booking CRUD with validations
- [x] Time slot management
- [x] Double booking prevention
- [x] Notification system
- [x] Customer/Service management

### Phase 2 (Future)

- [ ] Email notifications
- [ ] SMS notifications
- [ ] Payment integration
- [ ] Customer portal
- [ ] Admin dashboard UI
- [ ] Mobile app

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📧 Contact

For support or questions:

- Check documentation files
- Review API examples
- Check database schema

---

**Made with ❤️ using NestJS**
$ npm install

````

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
````

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
