# Spa Backend API

Backend API cho hệ thống quản lý Spa được xây dựng với NestJS, TypeORM và MySQL.

## Tính năng

### 1. Authentication (Admin)

- ✅ Đăng ký admin mới
- ✅ Đăng nhập với JWT Token
- ✅ Mã hóa mật khẩu với bcrypt
- ✅ Bảo vệ API với JWT Guards

### 2. Quản lý Dịch vụ (Services)

- ✅ CRUD dịch vụ spa
- ✅ Danh sách dịch vụ active
- ✅ Quản lý giá và thời lượng

### 3. Quản lý Khách hàng (Customers)

- ✅ CRUD khách hàng
- ✅ Theo dõi lịch sử chi tiêu
- ✅ Thống kê số lần đến

### 4. Quản lý Khung giờ (Time Slots)

- ✅ CRUD khung giờ
- ✅ Quản lý số lượng khách tối đa
- ✅ Tự động disable khi full
- ✅ Tự động enable lại khi có booking bị hủy

### 5. Quản lý Booking

- ✅ Tạo booking mới
- ✅ Kiểm tra availability
- ✅ Ngăn chặn double booking
- ✅ Cập nhật trạng thái booking
- ✅ Hủy booking và free time slot
- ✅ Hỗ trợ nhiều khách trong 1 booking

### 6. Thông báo (Notifications)

- ✅ Tự động tạo notification khi:
  - Booking được tạo
  - Booking được xác nhận
  - Booking bị hủy
  - Booking hoàn thành
- ✅ API lấy danh sách notification
- ✅ API đánh dấu đã đọc

## Database Schema

### Tables

#### admins

- id (UUID)
- username (unique)
- email (unique)
- password (hashed)
- fullName
- phone
- isActive
- lastLogin
- createdAt, updatedAt

#### services

- id (UUID)
- name
- description
- category
- basePrice
- durationMinutes
- isActive
- imageUrl
- createdAt, updatedAt

#### treatments

- id (UUID)
- name
- description
- price
- durationMinutes
- serviceId (FK)
- isActive
- createdAt, updatedAt

#### employees

- id (UUID)
- fullName
- email (unique)
- phone
- role (enum: therapist, receptionist, manager)
- specialization
- isActive
- workSchedule
- hireDate
- createdAt, updatedAt

#### customers

- id (UUID)
- fullName
- email (unique)
- phone (unique)
- dateOfBirth
- address
- notes
- totalVisits
- totalSpent
- createdAt, updatedAt

#### time_slots

- id (UUID)
- startTime (time)
- endTime (time)
- maxCapacity
- currentBookings
- isActive
- createdAt, updatedAt

#### bookings

- id (UUID)
- customerId (FK)
- serviceId (FK, optional)
- treatmentId (FK, optional)
- employeeId (FK, optional)
- bookingDate
- timeSlotId (FK)
- numberOfGuests
- status (enum: pending, confirmed, in_progress, completed, cancelled, no_show)
- totalPrice
- notes
- cancellationReason
- cancelledAt
- createdAt, updatedAt

#### booking_notifications

- id (UUID)
- bookingId (FK)
- type (enum: booking_created, booking_confirmed, booking_reminder, booking_cancelled, booking_completed)
- title
- message
- status (enum: pending, sent, failed, read)
- recipientEmail
- sentAt
- readAt
- createdAt

## Cài đặt

### 1. Clone repository và cài đặt dependencies

```bash
npm install
```

### 2. Tạo file .env

Sao chép file `.env.example` thành `.env` và cấu hình:

```bash
cp .env.example .env
```

Cấu hình database trong `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=spa_db

# Application Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### 3. Tạo database

```bash
mysql -u root -p
CREATE DATABASE spa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Chạy migrations

```bash
npm run migration:run
```

### 5. Khởi động server

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

#### POST /auth/register

Đăng ký admin mới

```json
{
  "username": "admin",
  "email": "admin@spa.com",
  "password": "password123",
  "fullName": "Admin User",
  "phone": "0123456789"
}
```

#### POST /auth/login

Đăng nhập

```json
{
  "email": "admin@spa.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "Đăng nhập thành công",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "uuid",
    "email": "admin@spa.com",
    "username": "admin",
    "fullName": "Admin User"
  }
}
```

#### GET /auth/profile

Lấy thông tin admin (cần JWT token)

#### POST /auth/logout

Đăng xuất (cần JWT token)

### Services

#### GET /services

Lấy danh sách dịch vụ
Query params:

- `active=true` - Chỉ lấy dịch vụ đang active

#### POST /services (Protected)

Tạo dịch vụ mới

```json
{
  "name": "Massage toàn thân",
  "description": "Massage thư giãn toàn thân",
  "category": "massage",
  "basePrice": 500000,
  "durationMinutes": 90
}
```

#### GET /services/:id

Lấy chi tiết dịch vụ

#### PATCH /services/:id (Protected)

Cập nhật dịch vụ

#### DELETE /services/:id (Protected)

Xóa dịch vụ

### Customers

#### GET /customers (Protected)

Lấy danh sách khách hàng

#### POST /customers (Protected)

Tạo khách hàng mới

```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "phone": "0987654321",
  "dateOfBirth": "1990-01-01",
  "address": "123 Đường ABC, TP.HCM"
}
```

#### GET /customers/:id (Protected)

Lấy chi tiết khách hàng

#### PATCH /customers/:id (Protected)

Cập nhật khách hàng

#### DELETE /customers/:id (Protected)

Xóa khách hàng

### Time Slots

#### GET /time-slots

Lấy danh sách khung giờ
Query params:

- `active=true` - Chỉ lấy khung giờ đang active

#### POST /time-slots (Protected)

Tạo khung giờ mới

```json
{
  "startTime": "09:00:00",
  "endTime": "10:00:00",
  "maxCapacity": 5
}
```

#### GET /time-slots/:id

Lấy chi tiết khung giờ

#### GET /time-slots/:id/availability?guests=2

Kiểm tra khung giờ còn chỗ trống không

#### PATCH /time-slots/:id (Protected)

Cập nhật khung giờ

#### DELETE /time-slots/:id (Protected)

Xóa khung giờ

### Bookings

#### POST /bookings (Protected)

Tạo booking mới

```json
{
  "customerId": "customer-uuid",
  "serviceId": "service-uuid",
  "bookingDate": "2024-01-20",
  "timeSlotId": "timeslot-uuid",
  "numberOfGuests": 2,
  "totalPrice": 1000000,
  "notes": "Khách yêu cầu phòng yên tĩnh"
}
```

#### GET /bookings (Protected)

Lấy danh sách booking
Query params:

- `status=confirmed` - Lọc theo trạng thái
- `date=2024-01-20` - Lọc theo ngày
- `customerId=uuid` - Lọc theo khách hàng

#### GET /bookings/available-slots/:date

Lấy danh sách khung giờ còn trống cho ngày cụ thể

#### POST /bookings/check-availability

Kiểm tra khung giờ có sẵn không

```json
{
  "date": "2024-01-20",
  "timeSlotId": "timeslot-uuid"
}
```

#### GET /bookings/:id (Protected)

Lấy chi tiết booking

#### GET /bookings/:id/notifications (Protected)

Lấy danh sách notification của booking

#### PATCH /bookings/:id (Protected)

Cập nhật booking (thay đổi trạng thái, hủy, etc.)

```json
{
  "status": "cancelled",
  "cancellationReason": "Khách hàng yêu cầu"
}
```

#### DELETE /bookings/:id (Protected)

Xóa booking

### Notifications

#### GET /bookings/notifications/pending (Protected)

Lấy danh sách notification chưa đọc

#### PATCH /bookings/notifications/:id/read (Protected)

Đánh dấu notification đã đọc

## Testing API

Bạn có thể test API bằng:

- Postman
- Thunder Client (VS Code extension)
- cURL

Example với cURL:

```bash
# Đăng nhập
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@spa.com","password":"password123"}'

# Lấy danh sách dịch vụ với token
curl -X GET http://localhost:3000/services \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Migration Commands

```bash
# Tạo migration mới
npm run migration:create -- src/migrations/MigrationName

# Generate migration từ entities
npm run migration:generate -- src/migrations/MigrationName

# Chạy migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── dto/               # Data Transfer Objects
│   ├── guards/            # JWT Guards
│   └── strategies/        # Passport strategies
├── bookings/              # Booking management
├── customers/             # Customer management
├── services/              # Service management
├── time-slots/            # Time slot management
├── entities/              # TypeORM entities
├── config/                # Configuration files
├── migrations/            # Database migrations
├── app.module.ts          # Root module
└── main.ts               # Application entry point
```

## Technologies

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **class-validator** - DTO validation
- **Passport** - Authentication middleware

## License

MIT
