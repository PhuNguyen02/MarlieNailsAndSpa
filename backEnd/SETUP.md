# 🏥 SPA BACKEND - HƯỚNG DẪN CÀI ĐẶT

## 📋 Database Schema Tổng Quan

### Các Bảng Chính

1. **admins** - Quản lý tài khoản admin
2. **services** - Danh sách dịch vụ spa
3. **treatments** - Các liệu trình thuộc dịch vụ
4. **employees** - Nhân viên spa
5. **customers** - Khách hàng
6. **time_slots** - Khung giờ đặt lịch
7. **bookings** - Đơn đặt lịch
8. **booking_notifications** - Thông báo booking

### Quan Hệ Giữa Các Bảng

```
services (1) -----> (n) treatments
customers (1) -----> (n) bookings
employees (1) -----> (n) bookings
time_slots (1) -----> (n) bookings
bookings (1) -----> (n) booking_notifications
```

## 🚀 Cài Đặt Bước Từng Bước

### Bước 1: Cài đặt dependencies

```bash
npm install
```

### Bước 2: Tạo file .env

Tạo file `.env` trong thư mục root với nội dung:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password_here
DB_DATABASE=spa_db

# Application Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=spa-secret-key-2024-change-in-production
JWT_EXPIRES_IN=7d
```

⚠️ **LƯU Ý**: Thay đổi `DB_PASSWORD` và `JWT_SECRET` trong production!

### Bước 3: Tạo Database

Mở MySQL và chạy lệnh:

```sql
CREATE DATABASE spa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Hoặc dùng command line:

```bash
mysql -u root -p -e "CREATE DATABASE spa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Bước 4: Chạy Migrations

Migration sẽ tạo tất cả các bảng trong database:

```bash
npm run migration:run
```

Bạn sẽ thấy output:

```
query: SELECT version()
query: CREATE TABLE `admins` ...
query: CREATE TABLE `services` ...
...
Migration InitialSchema has been executed successfully.
```

### Bước 5: Seed Data Mẫu (Optional)

Để có data mẫu cho việc test:

```bash
npm run seed
```

Script này sẽ tạo:

- ✅ 1 admin account (email: admin@spa.com, password: admin123)
- ✅ 12 time slots (9:00 AM - 9:00 PM)
- ✅ 5 services mẫu
- ✅ 2 treatments mẫu
- ✅ 3 employees mẫu
- ✅ 3 customers mẫu

### Bước 6: Khởi động Server

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

Server sẽ chạy tại: **http://localhost:3000**

## 📊 Database Schema Chi Tiết

### 1. admins

Quản lý tài khoản admin đăng nhập hệ thống.

| Field     | Type         | Description            |
| --------- | ------------ | ---------------------- |
| id        | UUID         | Primary key            |
| username  | VARCHAR(100) | Tên đăng nhập (unique) |
| email     | VARCHAR(255) | Email (unique)         |
| password  | VARCHAR(255) | Mật khẩu (đã hash)     |
| fullName  | VARCHAR(100) | Họ tên                 |
| phone     | VARCHAR(20)  | Số điện thoại          |
| isActive  | BOOLEAN      | Trạng thái active      |
| lastLogin | DATETIME     | Lần đăng nhập cuối     |
| createdAt | DATETIME     | Ngày tạo               |
| updatedAt | DATETIME     | Ngày cập nhật          |

### 2. services

Danh sách các dịch vụ spa.

| Field           | Type          | Description                      |
| --------------- | ------------- | -------------------------------- |
| id              | UUID          | Primary key                      |
| name            | VARCHAR(200)  | Tên dịch vụ                      |
| description     | TEXT          | Mô tả                            |
| category        | VARCHAR(100)  | Danh mục (Massage, Facial, etc.) |
| basePrice       | DECIMAL(10,2) | Giá cơ bản                       |
| durationMinutes | INT           | Thời lượng (phút)                |
| isActive        | BOOLEAN       | Trạng thái                       |
| imageUrl        | TEXT          | Link hình ảnh                    |
| createdAt       | DATETIME      | Ngày tạo                         |
| updatedAt       | DATETIME      | Ngày cập nhật                    |

### 3. treatments

Các liệu trình chi tiết thuộc dịch vụ.

| Field           | Type          | Description    |
| --------------- | ------------- | -------------- |
| id              | UUID          | Primary key    |
| name            | VARCHAR(200)  | Tên liệu trình |
| description     | TEXT          | Mô tả          |
| price           | DECIMAL(10,2) | Giá            |
| durationMinutes | INT           | Thời lượng     |
| serviceId       | UUID          | FK -> services |
| isActive        | BOOLEAN       | Trạng thái     |
| createdAt       | DATETIME      | Ngày tạo       |
| updatedAt       | DATETIME      | Ngày cập nhật  |

### 4. employees

Nhân viên spa.

| Field          | Type         | Description                      |
| -------------- | ------------ | -------------------------------- |
| id             | UUID         | Primary key                      |
| fullName       | VARCHAR(100) | Họ tên                           |
| email          | VARCHAR(255) | Email (unique)                   |
| phone          | VARCHAR(20)  | Số điện thoại                    |
| role           | ENUM         | therapist, receptionist, manager |
| specialization | TEXT         | Chuyên môn                       |
| isActive       | BOOLEAN      | Trạng thái                       |
| workSchedule   | TEXT         | Lịch làm việc                    |
| hireDate       | DATE         | Ngày vào làm                     |
| createdAt      | DATETIME     | Ngày tạo                         |
| updatedAt      | DATETIME     | Ngày cập nhật                    |

### 5. customers

Khách hàng.

| Field       | Type          | Description            |
| ----------- | ------------- | ---------------------- |
| id          | UUID          | Primary key            |
| fullName    | VARCHAR(100)  | Họ tên                 |
| email       | VARCHAR(255)  | Email (unique)         |
| phone       | VARCHAR(20)   | Số điện thoại (unique) |
| dateOfBirth | DATE          | Ngày sinh              |
| address     | TEXT          | Địa chỉ                |
| notes       | TEXT          | Ghi chú                |
| totalVisits | INT           | Tổng số lần đến        |
| totalSpent  | DECIMAL(10,2) | Tổng chi tiêu          |
| createdAt   | DATETIME      | Ngày tạo               |
| updatedAt   | DATETIME      | Ngày cập nhật          |

### 6. time_slots

Khung giờ cho booking.

| Field           | Type     | Description                        |
| --------------- | -------- | ---------------------------------- |
| id              | UUID     | Primary key                        |
| startTime       | TIME     | Giờ bắt đầu (HH:mm:ss)             |
| endTime         | TIME     | Giờ kết thúc (HH:mm:ss)            |
| maxCapacity     | INT      | Số khách tối đa                    |
| currentBookings | INT      | Số booking hiện tại                |
| isActive        | BOOLEAN  | Trạng thái (auto disable khi full) |
| createdAt       | DATETIME | Ngày tạo                           |
| updatedAt       | DATETIME | Ngày cập nhật                      |

**Logic Tự Động:**

- Khi `currentBookings >= maxCapacity` → `isActive = false`
- Khi booking bị hủy → `currentBookings--` → `isActive = true`

### 7. bookings

Đơn đặt lịch.

| Field              | Type          | Description                                                    |
| ------------------ | ------------- | -------------------------------------------------------------- |
| id                 | UUID          | Primary key                                                    |
| customerId         | UUID          | FK -> customers                                                |
| serviceId          | UUID          | FK -> services (optional)                                      |
| treatmentId        | UUID          | FK -> treatments (optional)                                    |
| employeeId         | UUID          | FK -> employees (optional)                                     |
| bookingDate        | DATE          | Ngày đặt                                                       |
| timeSlotId         | UUID          | FK -> time_slots                                               |
| numberOfGuests     | INT           | Số lượng khách                                                 |
| status             | ENUM          | pending, confirmed, in_progress, completed, cancelled, no_show |
| totalPrice         | DECIMAL(10,2) | Tổng giá                                                       |
| notes              | TEXT          | Ghi chú                                                        |
| cancellationReason | TEXT          | Lý do hủy                                                      |
| cancelledAt        | DATETIME      | Thời gian hủy                                                  |
| createdAt          | DATETIME      | Ngày tạo                                                       |
| updatedAt          | DATETIME      | Ngày cập nhật                                                  |

**Chống Double Booking:**

- Kiểm tra: same customer + same date + same time slot + status = confirmed
- Nếu tồn tại → Không cho đặt

### 8. booking_notifications

Thông báo về booking.

| Field          | Type         | Description                                                                                |
| -------------- | ------------ | ------------------------------------------------------------------------------------------ |
| id             | UUID         | Primary key                                                                                |
| bookingId      | UUID         | FK -> bookings                                                                             |
| type           | ENUM         | booking_created, booking_confirmed, booking_reminder, booking_cancelled, booking_completed |
| title          | VARCHAR(255) | Tiêu đề                                                                                    |
| message        | TEXT         | Nội dung                                                                                   |
| status         | ENUM         | pending, sent, failed, read                                                                |
| recipientEmail | TEXT         | Email người nhận                                                                           |
| sentAt         | DATETIME     | Thời gian gửi                                                                              |
| readAt         | DATETIME     | Thời gian đọc                                                                              |
| createdAt      | DATETIME     | Ngày tạo                                                                                   |

**Tự động tạo notification khi:**

- ✅ Booking được tạo
- ✅ Booking được xác nhận
- ✅ Booking bị hủy
- ✅ Booking hoàn thành

## 🔐 Chức Năng Bảo Mật

### 1. Authentication

- ✅ JWT Token với expiration
- ✅ Password hashing với bcrypt (salt rounds: 10)
- ✅ Protected routes với JWT Guard
- ✅ Last login tracking

### 2. Authorization

Tất cả API CRUD đều yêu cầu JWT token trừ:

- GET /services (public)
- GET /time-slots (public)
- POST /auth/login (public)
- POST /auth/register (public)

## 🎯 Chức Năng Booking Chi Tiết

### Flow Tạo Booking

1. **Check Customer** → Kiểm tra khách hàng tồn tại
2. **Check Availability** → Kiểm tra time slot còn chỗ
3. **Check Double Booking** → Kiểm tra khách đã đặt chưa
4. **Create Booking** → Tạo booking với status = pending
5. **Increment Time Slot** → Tăng currentBookings, disable nếu full
6. **Create Notification** → Tạo thông báo booking_created

### Flow Hủy Booking

1. **Find Booking** → Tìm booking
2. **Update Status** → Set status = cancelled
3. **Decrement Time Slot** → Giảm currentBookings, enable lại
4. **Create Notification** → Tạo thông báo booking_cancelled
5. **Save Cancellation Reason** → Lưu lý do hủy

### Flow Hoàn Thành Booking

1. **Find Booking** → Tìm booking
2. **Update Status** → Set status = completed
3. **Update Customer Stats** → Tăng totalVisits, totalSpent
4. **Create Notification** → Tạo thông báo booking_completed

## 📝 Testing

Sau khi seed data, test với credentials:

**Admin Account:**

```
Email: admin@spa.com
Password: admin123
```

**Test Flow:**

1. Login để lấy token:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@spa.com","password":"admin123"}'
```

2. Lấy danh sách services:

```bash
curl -X GET http://localhost:3000/services
```

3. Lấy time slots available:

```bash
curl -X GET "http://localhost:3000/time-slots?active=true"
```

4. Tạo booking (với token):

```bash
curl -X POST http://localhost:3000/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer-id-from-seed",
    "serviceId": "service-id-from-seed",
    "bookingDate": "2024-01-25",
    "timeSlotId": "timeslot-id-from-seed",
    "numberOfGuests": 2,
    "totalPrice": 1000000
  }'
```

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Kiểm tra MySQL đang chạy
mysql -u root -p -e "SELECT 1"

# Kiểm tra database tồn tại
mysql -u root -p -e "SHOW DATABASES LIKE 'spa_db'"
```

### Migration Error

```bash
# Xóa migrations cũ và chạy lại
npm run migration:revert
npm run migration:run
```

### Port đã được sử dụng

Thay đổi PORT trong file `.env`:

```env
PORT=3001
```

## 📚 Tài liệu API

Xem file `README_API.md` để biết chi tiết đầy đủ về các API endpoints.

## 🎉 Hoàn Thành!

Bây giờ bạn đã có:

- ✅ Database schema hoàn chỉnh
- ✅ Authentication với JWT
- ✅ CRUD cho tất cả modules
- ✅ Booking system với availability check
- ✅ Notification system
- ✅ Seed data để test

Happy coding! 🚀
