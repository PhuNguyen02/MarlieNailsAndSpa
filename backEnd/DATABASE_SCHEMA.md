# 📊 DATABASE SCHEMA - SPA MANAGEMENT SYSTEM

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│     ADMINS      │
├─────────────────┤
│ PK: id (UUID)   │
│    username     │
│    email        │
│    password     │
│    fullName     │
│    phone        │
│    isActive     │
│    lastLogin    │
└─────────────────┘

┌─────────────────────────────────┐         ┌──────────────────┐
│          SERVICES               │ 1     N │   TREATMENTS     │
├─────────────────────────────────┤─────────├──────────────────┤
│ PK: id (UUID)                   │         │ PK: id (UUID)    │
│    name                         │         │    name          │
│    description                  │         │    description   │
│    category                     │         │    price         │
│    priceType (ENUM)             │         │    durationMin   │
│    singlePrice                  │         │ FK: serviceId    │
│    priceRangeMin                │         │    isActive      │
│    priceRangeMax                │         └──────────────────┘
│    packagePrice                 │
│    packageSessions              │
│    basePrice (legacy)           │
│    durationMinutes (legacy)     │
│    duration (string)            │
│    steps (JSON)                 │
│    stepsCount                   │
│    zone                         │
│    hasCustomDesign              │
│    isActive                     │
│    imageUrl                     │
└─────────────────────────────────┘

┌─────────────────┐
│   EMPLOYEES     │
├─────────────────┤
│ PK: id (UUID)   │
│    fullName     │
│    email        │
│    phone        │
│    role         │
│    specializ.   │
│    isActive     │
│    workSchedule │
│    hireDate     │
└─────────────────┘
        │
        │ 1
        │
        │ N
        ▼
┌──────────────────┐         ┌─────────────────┐
│ BOOKING_EMPLOYEE │ N     1 │    BOOKINGS     │
├──────────────────┤─────────├─────────────────┤
│ PK: id (UUID)    │         │ PK: id (UUID)   │
│ FK: bookingId    │         │ FK: customerId  │
│ FK: employeeId   │         │ FK: serviceId   │
│    createdAt     │         │ FK: treatmentId │
└──────────────────┘         │ FK: timeSlotId  │
        ▲                    │    bookingDate  │
        │ N                  │    numOfGuests  │
        │                    │    status       │
        │ 1                  │    totalPrice   │
┌─────────────────┐          │    notes        │
│   EMPLOYEES     │          │    cancellReas. │
└─────────────────┘          │    cancelledAt  │
                             └─────────────────┘
                                     │
┌─────────────────┐                  │ 1
│   CUSTOMERS     │                  │
├─────────────────┤                  │ N
│ PK: id (UUID)   │                  ▼
│    fullName     │         ┌──────────────────┐
│    email        │         │ BOOKING_NOTIFS   │
│    phone        │         ├──────────────────┤
│    dateOfBirth  │         │ PK: id (UUID)    │
│    address      │         │ FK: bookingId    │
│    notes        │         │    type          │
│    totalVisits  │         │    title         │
│    totalSpent   │         │    message       │
└─────────────────┘         │    status        │
        │                   │    recipientEmail│
        │ 1                 │    sentAt        │
        │                   │    readAt        │
        │ N                 └──────────────────┘
        ▼
┌─────────────────┐
│    BOOKINGS     │
└─────────────────┘
        ▲
        │ N
        │
        │ 1
        │
┌─────────────────┐
│   TIME_SLOTS    │
├─────────────────┤
│ PK: id (UUID)   │
│    startTime    │
│    endTime      │
│    maxCapacity  │
│    currentBooks │
│    isActive     │
└─────────────────┘
```

## Relationships

### One-to-Many (1:N)

1. **services → treatments**
   - Một dịch vụ có nhiều liệu trình
   - CASCADE DELETE: Xóa service → xóa tất cả treatments

2. **customers → bookings**
   - Một khách hàng có nhiều booking
   - CASCADE DELETE: Xóa customer → xóa tất cả bookings

3. **time_slots → bookings**
   - Một khung giờ có nhiều booking
   - RESTRICT: Không cho xóa time_slot nếu có booking

4. **bookings → booking_notifications**
   - Một booking có nhiều notification
   - CASCADE DELETE: Xóa booking → xóa tất cả notifications

5. **bookings → booking_employees**
   - Một booking có nhiều booking_employees
   - CASCADE DELETE: Xóa booking → xóa tất cả booking_employees

6. **employees → booking_employees**
   - Một employee có nhiều booking_employees
   - CASCADE: Xóa employee → xóa tất cả booking_employees

### Many-to-Many (N:M)

1. **bookings ↔ employees** (through booking_employees)
   - Một booking có thể có nhiều employees
   - Một employee có thể phục vụ nhiều bookings
   - Junction Table: `booking_employees`
     - PK: id (UUID)
     - FK: bookingId → bookings.id (CASCADE DELETE)
     - FK: employeeId → employees.id (CASCADE DELETE)
     - createdAt: timestamp

## Indexes

### Primary Keys (All UUID)

- admins.id
- services.id
- treatments.id
- employees.id
- customers.id
- time_slots.id
- bookings.id
- booking_employees.id
- booking_notifications.id

### Unique Indexes

- admins.username
- admins.email
- employees.email
- customers.email
- customers.phone

### Foreign Key Indexes

- treatments.serviceId
- bookings.customerId
- bookings.serviceId
- bookings.treatmentId
- bookings.timeSlotId
- booking_employees.bookingId
- booking_employees.employeeId
- booking_notifications.bookingId

### Composite Indexes (for performance)

- bookings(bookingDate, timeSlotId, status)
- bookings(customerId, bookingDate)
- booking_employees(bookingId, employeeId)
- booking_employees(employeeId, bookingId)
- booking_notifications(bookingId, status)

## Enums

### employee.role

- `therapist` - Nhân viên trị liệu
- `receptionist` - Lễ tân
- `manager` - Quản lý

### booking.status

- `pending` - Đang chờ xác nhận
- `confirmed` - Đã xác nhận
- `in_progress` - Đang thực hiện
- `completed` - Hoàn thành
- `cancelled` - Đã hủy
- `no_show` - Khách không đến

### booking_notification.type

- `booking_created` - Booking mới được tạo
- `booking_confirmed` - Booking được xác nhận
- `booking_reminder` - Nhắc nhở trước giờ
- `booking_cancelled` - Booking bị hủy
- `booking_completed` - Booking hoàn thành

### booking_notification.status

- `pending` - Chưa gửi
- `sent` - Đã gửi
- `failed` - Gửi thất bại
- `read` - Đã đọc

### service.priceType

- `single` - Giá đơn lẻ (VD: 129.000đ)
- `range` - Giá khoảng (VD: 120K - 150K)
- `package` - Giá gói (VD: gói 10 lần)
- `custom` - Giá tùy chỉnh (theo yêu cầu, liên hệ)

## Service Categories (from Marlie Nails & Spa)

### 1. Gội Đầu Dưỡng Sinh (4 combos)

Các combo gội đầu dưỡng sinh với các bước chi tiết:

- **Combo 1**: 79.000đ - 35 phút (7 bước)
- **Combo 2**: 179.000đ - 55 phút (11 bước)
- **Combo 3**: 229.000đ - 70 phút (11 bước)
- **Combo 4**: 329.000đ - 90 phút (12 bước)

Pricing: `priceType = 'single'`, `singlePrice` set

### 2. Triệt Lông (11 zones)

Các vùng triệt lông với giá lẻ và gói 10 lần:

- Nách, Mép: 129K/lần → 899K/10 lần
- Bụng: 179K → 1.399K/10 lần
- Bikini, Chân 1/2: 349K → 2.799K/10 lần
- Full Body: 1.799K → 13.999K/10 lần

Pricing: `priceType = 'package'`, `singlePrice` và `packagePrice` set, `packageSessions = 10`, `zone` filled

### 3. Mi (13 services)

Dịch vụ nối mi, uốn mi:

- Tháo Mi: 40K
- Uốn Mi: 200K
- Nối Mi Classic, Anime baby: 300K
- Các Loại Mi Thiết Kế: 450K (`hasCustomDesign = true`)

Pricing: Mostly `priceType = 'single'`, some use `range`

### 4. Chăm Sóc Da (7 services)

Các liệu trình chăm sóc da với số bước chi tiết:

- Lấy Nhân Mụn Cơ bản: 200K (13 bước)
- Cấy trắng NANO: 350K (13 bước)
- Thải Độc CO2: 450K (18 bước)
- PEEL DA: 590K (12 bước)

Pricing: `priceType = 'single'`, `stepsCount` và `steps` (JSON array) set

### 5. Nail - Gel Polish (11 services)

Dịch vụ sơn gel:

- Cắt da tay chân: 50K
- Sơn gel Hàn cao cấp: 50K
- Sơn gel thạch: 120K - 150K (`priceType = 'range'`)
- Sơn mắt mèo: 100K

### 6. Nail - Filling & Extension (8 services)

Dịch vụ nối móng, fill:

- Tạo cầu móng Hàn Quốc: 50K
- Fill (Gel): 120K
- Nối móng đắp gel: 250K

### 7. Nail - Design (10 services)

Các dịch vụ thiết kế móng:

- Vẽ gel, Vẽ nổi, French đầu móng: Theo yêu cầu
- Ombere, loang, tráng gương: Theo yêu cầu
- Đính đá, Sticker: Theo yêu cầu

Pricing: `priceType = 'custom'`, `hasCustomDesign = true`, `description = 'Theo yêu cầu'`

### 8. Dịch Vụ Khác (15 services)

Các dịch vụ bổ sung (Mua 5 tặng 1):

- Mặt nạ: 30K
- Massage body 30/60/90 phút: 189K/355K/499K
- Tắm trắng máy hấp: 450K

## Service Pricing Structure Details

### Single Price (`priceType = 'single'`)

```typescript
{
  name: "Combo 1",
  category: "Gội Đầu Dưỡng Sinh",
  priceType: "single",
  singlePrice: 79000,
  duration: "35 phút",
  steps: ["Khai thông kinh lạc", "Tẩy trang rửa mặt", ...]
}
```

### Range Price (`priceType = 'range'`)

```typescript
{
  name: "Sơn gel thạch",
  category: "Nail - Gel Polish",
  priceType: "range",
  priceRangeMin: 120000,
  priceRangeMax: 150000
}
```

### Package Price (`priceType = 'package'`)

```typescript
{
  name: "Triệt Lông Nách",
  category: "Triệt Lông",
  zone: "Nách",
  priceType: "package",
  singlePrice: 129000,      // Giá 1 lần
  packagePrice: 899000,     // Giá gói 10 lần
  packageSessions: 10
}
```

### Custom Price (`priceType = 'custom'`)

```typescript
{
  name: "Vẽ gel",
  category: "Nail - Design",
  priceType: "custom",
  hasCustomDesign: true,
  description: "Theo yêu cầu"
}
```

## Business Rules

### Time Slot Management

```
Khi tạo booking:
  time_slot.currentBookings += booking.numberOfGuests

  Nếu time_slot.currentBookings >= time_slot.maxCapacity:
    time_slot.isActive = false

Khi hủy booking:
  time_slot.currentBookings -= booking.numberOfGuests

  Nếu time_slot.currentBookings < time_slot.maxCapacity:
    time_slot.isActive = true
```

### Double Booking Prevention

```
Không cho phép tạo booking nếu:
  - Cùng customerId
  - Cùng bookingDate
  - Cùng timeSlotId
  - status = 'confirmed'
```

### Multiple Employees Booking

```
Khi chọn nhân viên cho booking:
  - employeeIds.length <= numberOfGuests
  - Tất cả employeeIds phải có trong danh sách available employees
  - Không được chọn trùng employeeId
  - Mỗi employeeId tạo một record trong booking_employees

Khi query available employees:
  - Kiểm tra bảng booking_employees thay vì bookings.employeeId
  - Loại trừ employees đã có booking trong cùng timeSlot và bookingDate
  - Chỉ trả về employees có isActive = true và role = 'therapist'
```

### Customer Statistics

```
Khi booking.status = 'completed':
  customer.totalVisits += 1
  customer.totalSpent += booking.totalPrice
```

### Automatic Notifications

```
Trigger notifications khi:
  - Booking được tạo → BOOKING_CREATED
  - Status thay đổi thành 'confirmed' → BOOKING_CONFIRMED
  - Status thay đổi thành 'cancelled' → BOOKING_CANCELLED
  - Status thay đổi thành 'completed' → BOOKING_COMPLETED
```

## Data Types

### MySQL Types

| Field Type     | MySQL Type    | Example                                |
| -------------- | ------------- | -------------------------------------- |
| UUID           | CHAR(36)      | '550e8400-e29b-41d4-a716-446655440000' |
| String (short) | VARCHAR(100)  | 'Nguyễn Văn A'                         |
| String (long)  | TEXT          | Long description                       |
| Email          | VARCHAR(255)  | 'user@example.com'                     |
| Phone          | VARCHAR(20)   | '0123456789'                           |
| Price          | DECIMAL(10,2) | 500000.00                              |
| Integer        | INT           | 5                                      |
| Boolean        | TINYINT(1)    | 0 or 1                                 |
| Date           | DATE          | '2024-01-20'                           |
| Time           | TIME          | '09:00:00'                             |
| DateTime       | DATETIME      | '2024-01-20 09:00:00'                  |
| Enum           | ENUM(...)     | 'pending'                              |

### Character Set

All tables use:

- **Charset**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`

Support for:

- ✅ Vietnamese characters (Tiếng Việt)
- ✅ Emojis
- ✅ Special characters

## Sample Data

### Services Example (New Structure)

```sql
-- Single Price Service
INSERT INTO services (name, category, priceType, singlePrice, duration, steps) VALUES
('Combo 1', 'Gội Đầu Dưỡng Sinh', 'single', 79000, '35 phút',
  '["Khai thông kinh lạc","Tẩy trang rửa mặt","Gội 2 nước","Ủ xả tóc (massage đầu)","Massage CVG ngửa","Sấy tóc","Máy massage chân"]');

-- Package Price Service
INSERT INTO services (name, category, zone, priceType, singlePrice, packagePrice, packageSessions) VALUES
('Triệt Lông Nách', 'Triệt Lông', 'Nách', 'package', 129000, 899000, 10);

-- Range Price Service
INSERT INTO services (name, category, priceType, priceRangeMin, priceRangeMax) VALUES
('Sơn gel thạch', 'Nail - Gel Polish', 'range', 120000, 150000);

-- Custom Price Service
INSERT INTO services (name, category, priceType, hasCustomDesign, description) VALUES
('Vẽ gel', 'Nail - Design', 'custom', true, 'Theo yêu cầu');

-- Skincare Service with Steps
INSERT INTO services (name, category, priceType, singlePrice, stepsCount, steps) VALUES
('Lấy Nhân Mụn Cơ bản', 'Chăm Sóc Da', 'single', 200000, 13,
  '["Soi da","Tẩy trang","Rửa mặt","Tẩy tế bào chết","Massage mặt","Xông hơi","Cà sũi","Hút bã nhờn","Sát khuẩn lần 1","Lấy nhân mụn","Sát khuẩn lần 2","Điện tím","Đắp mặt nạ + Chiếu đèn sinh học + Massage đầu"]');
```

### Time Slots Example

```sql
INSERT INTO time_slots (startTime, endTime, maxCapacity) VALUES
('09:00:00', '10:00:00', 5),
('10:00:00', '11:00:00', 5),
('11:00:00', '12:00:00', 5);
```

### Booking Example

```sql
-- Tạo booking với 2 guests
INSERT INTO bookings (
  customerId,
  serviceId,
  bookingDate,
  timeSlotId,
  numberOfGuests,
  totalPrice,
  status
) VALUES (
  'customer-uuid',
  'service-uuid',
  '2024-01-25',
  'timeslot-uuid',
  2,
  1000000,
  'confirmed'
);

-- Gán 2 nhân viên cho booking này (tối đa = numberOfGuests)
INSERT INTO booking_employees (bookingId, employeeId) VALUES
('booking-uuid', 'employee-uuid-1'),
('booking-uuid', 'employee-uuid-2');
```

## Migration History

### Initial Schema (2024-01-XX)

Tạo tất cả bảng ban đầu:

- admins
- services
- treatments
- employees
- customers
- time_slots
- bookings
- booking_notifications

### Multiple Employees Booking (2024-01-XX)

Migration: `CreateBookingEmployeesTable1769005813189`

Thay đổi:

- ❌ Xóa column: `bookings.employeeId` (không còn dùng)
- ✅ Thêm bảng mới: `booking_employees` (junction table)
  - `id` UUID PRIMARY KEY
  - `bookingId` UUID FOREIGN KEY → bookings.id (CASCADE DELETE)
  - `employeeId` UUID FOREIGN KEY → employees.id (CASCADE DELETE)
  - `createdAt` TIMESTAMP

Impact:

- Relationship: Bookings ↔ Employees thay đổi từ 1:N thành N:M
- API: `employeeId` → `employeeIds` (array)
- Validation: `employeeIds.length <= numberOfGuests`

### Service Structure Update (2026-01-26)

Migration: `UpdateServiceStructure1769100000000`

Thay đổi:

- ✅ Thêm columns mới cho flexible pricing:
  - `priceType` ENUM('single', 'range', 'package', 'custom') DEFAULT 'single'
  - `singlePrice` DECIMAL(10,2) NULL - Giá đơn lẻ
  - `priceRangeMin` DECIMAL(10,2) NULL - Giá từ
  - `priceRangeMax` DECIMAL(10,2) NULL - Giá đến
  - `packagePrice` DECIMAL(10,2) NULL - Giá gói
  - `packageSessions` INT NULL - Số buổi trong gói
- ✅ Thêm service details columns:
  - `duration` VARCHAR(50) NULL - Thời lượng dạng string
  - `steps` JSON NULL - Các bước thực hiện (array)
  - `stepsCount` INT NULL - Số bước
  - `zone` VARCHAR(100) NULL - Vùng (cho triệt lông)
  - `hasCustomDesign` TINYINT DEFAULT 0 - Có thiết kế tùy chỉnh
- ✅ Làm nullable legacy fields:
  - `basePrice` → DECIMAL(10,2) NULL (was NOT NULL)
  - `durationMinutes` → INT NULL (was NOT NULL)
- ✅ Data migration: Copy `basePrice` → `singlePrice` for existing data

Impact:

- Service pricing: Hỗ trợ 4 loại giá (single, range, package, custom)
- CSV import: Có thể import toàn bộ dữ liệu từ Marlie Nails & Spa CSV
- Backward compatibility: Legacy fields vẫn tồn tại nhưng nullable
- Service categories: Hỗ trợ Gội Đầu, Triệt Lông, Mi, Nail, Chăm Sóc Da, etc.
- API response: Trả về đầy đủ thông tin pricing options

## Backup & Restore

### Backup Database

```bash
mysqldump -u root -p spa_db > backup_spa_db_$(date +%Y%m%d).sql
```

### Restore Database

```bash
mysql -u root -p spa_db < backup_spa_db_20240120.sql
```

## Performance Considerations

### Suggested Indexes

```sql
-- For booking queries
CREATE INDEX idx_bookings_date_time ON bookings(bookingDate, timeSlotId);
CREATE INDEX idx_bookings_customer ON bookings(customerId, bookingDate);
CREATE INDEX idx_bookings_status ON bookings(status);

-- For booking employees queries
CREATE INDEX idx_booking_employees_booking ON booking_employees(bookingId);
CREATE INDEX idx_booking_employees_employee ON booking_employees(employeeId);
CREATE INDEX idx_booking_employees_composite ON booking_employees(bookingId, employeeId);

-- For notification queries
CREATE INDEX idx_notifications_status ON booking_notifications(status);
CREATE INDEX idx_notifications_booking ON booking_notifications(bookingId, createdAt);

-- For time slot availability
CREATE INDEX idx_timeslots_active ON time_slots(isActive, startTime);
```

### Query Optimization

1. **Luôn sử dụng indexes** khi query với WHERE clause
2. **Limit kết quả** với LIMIT khi không cần tất cả
3. **Sử dụng relations** thay vì multiple queries
4. **Cache** các queries thường xuyên (services, time_slots)

## Security

### Password Hashing

```javascript
// Sử dụng bcrypt với salt rounds = 10
const hashedPassword = await bcrypt.hash(password, 10);
```

### SQL Injection Prevention

- ✅ Sử dụng TypeORM query builder
- ✅ Parameterized queries
- ✅ Input validation với class-validator

### Data Validation

```typescript
// All DTOs use class-validator
@IsEmail()
email: string;

@MinLength(6)
password: string;

@IsUUID('4')
customerId: string;
```

## Monitoring

### Key Metrics to Monitor

1. **Booking Rate** - Số booking/ngày
2. **Cancellation Rate** - Tỷ lệ hủy booking
3. **Customer Retention** - Khách hàng quay lại
4. **Time Slot Utilization** - Tỷ lệ sử dụng khung giờ
5. **Revenue** - Doanh thu theo ngày/tháng

### Query Performance

```sql
-- Check slow queries
SHOW PROCESSLIST;

-- Analyze query
EXPLAIN SELECT * FROM bookings WHERE bookingDate = '2024-01-20';
```

---

**Last Updated**: January 2024
**Schema Version**: 1.0
