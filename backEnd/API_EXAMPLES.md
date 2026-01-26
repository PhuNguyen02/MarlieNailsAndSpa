# 🔌 API ENDPOINTS - POSTMAN COLLECTION

## Base URL

```
http://localhost:3000
```

## 📝 Table of Contents

1. [Authentication](#authentication)
2. [Services](#services)
3. [Employees](#employees)
4. [Customers](#customers)
5. [Time Slots](#time-slots)
6. [Bookings](#bookings)
7. [Notifications](#notifications)

---

## 1. Authentication

### 1.1 Register Admin

**POST** `/api/auth/register`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Body:**

```json
{
  "username": "admin",
  "email": "admin@spa.com",
  "password": "admin123",
  "fullName": "Admin Spa",
  "phone": "0123456789"
}
```

**Response 201:**

```json
{
  "status": 201,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "admin",
    "email": "admin@spa.com",
    "fullName": "Admin Spa",
    "phone": "0123456789",
    "isActive": true,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  },
  "message": "Đăng ký thành công"
}
```

### 1.2 Login

**POST** `/api/auth/login`

**Body:**

```json
{
  "email": "admin@spa.com",
  "password": "admin123"
}
```

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@spa.com",
    "username": "admin",
    "fullName": "Admin Spa",
    "phone": "0123456789",
    "isActive": true
  },
  "message": "Đăng nhập thành công"
}
```

### 1.3 Get Admin by ID

**GET** `/api/auth/admin/:id`

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@spa.com",
    "username": "admin",
    "fullName": "Admin Spa",
    "phone": "0123456789",
    "isActive": true
  },
  "message": "Lấy thông tin admin thành công"
}
```

---

## 2. Services

### 2.1 Get All Services

**GET** `/api/admin/services`

**Query Params:**

- `active=true` (optional) - Chỉ lấy services đang active

**Response 200:**

```json
{
  "status": 200,
  "data": [
    {
      "id": "service-uuid-1",
      "name": "Combo 2",
      "description": null,
      "category": "Gội Đầu Dưỡng Sinh",
      "priceType": "single",
      "singlePrice": 179000,
      "duration": "55 phút",
      "steps": [
        "Khai thông kinh lạc",
        "Tẩy trang rửa mặt",
        "Massage mặt nâng cơ",
        "Đắp mặt nạ",
        "Gội 2 nước",
        "Ủ xả tóc (massage đầu)",
        "Ngâm chân thảo dược",
        "Massage CVG tay",
        "Xông nến tai",
        "Sấy tóc",
        "Máy massage chân"
      ],
      "isActive": true,
      "imageUrl": null,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z",
      "treatments": []
    },
    {
      "id": "service-uuid-2",
      "name": "Triệt Lông Nách",
      "description": null,
      "category": "Triệt Lông",
      "zone": "Nách",
      "priceType": "package",
      "singlePrice": 129000,
      "packagePrice": 899000,
      "packageSessions": 10,
      "isActive": true,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    },
    {
      "id": "service-uuid-3",
      "name": "Sơn gel thạch",
      "category": "Nail - Gel Polish",
      "priceType": "range",
      "priceRangeMin": 120000,
      "priceRangeMax": 150000,
      "isActive": true,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    },
    {
      "id": "service-uuid-4",
      "name": "Vẽ gel",
      "category": "Nail - Design",
      "priceType": "custom",
      "hasCustomDesign": true,
      "description": "Theo yêu cầu",
      "isActive": true,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "message": "Lấy danh sách dịch vụ thành công"
}
```

### 2.2 Get Service by ID

**GET** `/api/admin/services/:id`

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "service-uuid-1",
    "name": "Lấy Nhân Mụn Cơ bản",
    "description": null,
    "category": "Chăm Sóc Da",
    "priceType": "single",
    "singlePrice": 200000,
    "stepsCount": 13,
    "steps": [
      "Soi da",
      "Tẩy trang",
      "Rửa mặt",
      "Tẩy tế bào chết",
      "Massage mặt",
      "Xông hơi",
      "Cà sũi",
      "Hút bã nhờn",
      "Sát khuẩn lần 1",
      "Lấy nhân mụn",
      "Sát khuẩn lần 2",
      "Điện tím",
      "Đắp mặt nạ + Chiếu đèn sinh học + Massage đầu"
    ],
    "isActive": true,
    "treatments": []
  },
  "message": "Lấy thông tin dịch vụ thành công"
}
```

### 2.3 Create Service

**POST** `/api/admin/services`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Body:**

```json
{
  "name": "Combo 3",
  "category": "Gội Đầu Dưỡng Sinh",
  "priceType": "single",
  "singlePrice": 229000,
  "duration": "70 phút",
  "steps": [
    "Khai thông kinh lạc",
    "Tẩy trang rửa mặt",
    "Tẩy tế bào chết da mặt",
    "Massage mặt chuyên sâu",
    "Đắp mặt nạ",
    "Tẩy tế bào chết da đầu",
    "Massage CVG-tay-chân",
    "Gội 2 nước",
    "Ủ xả tóc (massage đầu)",
    "Sấy tóc",
    "Máy massage chân"
  ]
}
```

**Response 201:**

```json
{
  "status": 201,
  "data": {
    "id": "new-service-uuid",
    "name": "Combo 3",
    "category": "Gội Đầu Dưỡng Sinh",
    "priceType": "single",
    "singlePrice": 229000,
    "duration": "70 phút",
    "steps": [
      "Khai thông kinh lạc",
      "Tẩy trang rửa mặt",
      "Tẩy tế bào chết da mặt",
      "Massage mặt chuyên sâu",
      "Đắp mặt nạ",
      "Tẩy tế bào chết da đầu",
      "Massage CVG-tay-chân",
      "Gội 2 nước",
      "Ủ xả tóc (massage đầu)",
      "Sấy tóc",
      "Máy massage chân"
    ],
    "isActive": true,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  },
  "message": "Tạo dịch vụ thành công"
}
```

**Example 2: Package Price Service (Triệt Lông)**

**Body:**

```json
{
  "name": "Triệt Lông Full Body",
  "category": "Triệt Lông",
  "zone": "Full Body",
  "priceType": "package",
  "singlePrice": 1799000,
  "packagePrice": 13999000,
  "packageSessions": 10
}
```

**Response 201:**

```json
{
  "status": 201,
  "data": {
    "id": "new-service-uuid",
    "name": "Triệt Lông Full Body",
    "category": "Triệt Lông",
    "zone": "Full Body",
    "priceType": "package",
    "singlePrice": 1799000,
    "packagePrice": 13999000,
    "packageSessions": 10,
    "isActive": true,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  },
  "message": "Tạo dịch vụ thành công"
}
```

**Example 3: Range Price Service (Nail)**

**Body:**

```json
{
  "name": "Sơn gel nhũ flash",
  "category": "Nail - Gel Polish",
  "priceType": "range",
  "priceRangeMin": 120000,
  "priceRangeMax": 150000
}
```

**Response 201:**

```json
{
  "status": 201,
  "data": {
    "id": "new-service-uuid",
    "name": "Sơn gel nhũ flash",
    "category": "Nail - Gel Polish",
    "priceType": "range",
    "priceRangeMin": 120000,
    "priceRangeMax": 150000,
    "isActive": true,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  },
  "message": "Tạo dịch vụ thành công"
}
```

**Example 4: Custom Price Service (Design)**

**Body:**

```json
{
  "name": "French đầu móng",
  "category": "Nail - Design",
  "priceType": "custom",
  "hasCustomDesign": true,
  "description": "Theo yêu cầu"
}
```

**Response 201:**

```json
{
  "status": 201,
  "data": {
    "id": "new-service-uuid",
    "name": "French đầu móng",
    "category": "Nail - Design",
    "priceType": "custom",
    "hasCustomDesign": true,
    "description": "Theo yêu cầu",
    "isActive": true,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  },
  "message": "Tạo dịch vụ thành công"
}
```

### 2.4 Update Service

**PATCH** `/api/admin/services/:id`

**Body Example 1: Update package price**

```json
{
  "packagePrice": 899000,
  "isActive": true
}
```

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "service-uuid-1",
    "name": "Triệt Lông Nách",
    "zone": "Nách",
    "priceType": "package",
    "singlePrice": 129000,
    "packagePrice": 899000,
    "packageSessions": 10,
    "isActive": true
  },
  "message": "Cập nhật dịch vụ thành công"
}
```

**Body Example 2: Update steps for combo**

```json
{
  "steps": ["Khai thông kinh lạc", "Tẩy trang rửa mặt", "Gội 2 nước", "Massage đầu", "Sấy tóc"],
  "duration": "40 phút"
}
```

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "service-uuid-2",
    "name": "Combo 1",
    "category": "Gội Đầu Dưỡng Sinh",
    "priceType": "single",
    "singlePrice": 79000,
    "duration": "40 phút",
    "steps": ["Khai thông kinh lạc", "Tẩy trang rửa mặt", "Gội 2 nước", "Massage đầu", "Sấy tóc"],
    "isActive": true
  },
  "message": "Cập nhật dịch vụ thành công"
}
```

### 2.5 Delete Service

**DELETE** `/api/admin/services/:id`

**Response 200:**

```json
{
  "status": 200,
  "data": null,
  "message": "Xóa dịch vụ thành công"
}
```

---

## 3. Employees

### 3.1 Get All Employees

**GET** `/api/admin/employees`

**Query Params:**

- `role=therapist` (optional) - Lọc theo vai trò
- `isActive=true` (optional) - Chỉ lấy nhân viên đang active

**Response 200:**

```json
{
  "status": 200,
  "data": [
    {
      "id": "employee-uuid-1",
      "fullName": "Nguyễn Thị Mai",
      "email": "mai@spa.com",
      "phone": "0901234567",
      "role": "therapist",
      "specialization": "Massage Body",
      "isActive": true,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "message": "Lấy danh sách nhân viên thành công"
}
```

### 3.2 Get Employee by ID

**GET** `/api/admin/employees/:id`

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "employee-uuid-1",
    "fullName": "Nguyễn Thị Mai",
    "email": "mai@spa.com",
    "phone": "0901234567",
    "role": "therapist",
    "specialization": "Massage Body",
    "isActive": true,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  },
  "message": "Lấy thông tin nhân viên thành công"
}
```

### 3.3 Create Employee

**POST** `/api/admin/employees`

**Body:**

```json
{
  "fullName": "Trần Văn B",
  "email": "tranvanb@spa.com",
  "phone": "0912345678",
  "role": "therapist",
  "specialization": "Foot Massage"
}
```

**Response 201:**

```json
{
  "status": 201,
  "data": {
    "id": "new-employee-uuid",
    "fullName": "Trần Văn B",
    "email": "tranvanb@spa.com",
    "phone": "0912345678",
    "role": "therapist",
    "specialization": "Foot Massage",
    "isActive": true,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  },
  "message": "Tạo nhân viên thành công"
}
```

### 3.4 Update Employee

**PATCH** `/api/admin/employees/:id`

**Body:**

```json
{
  "phone": "0912345679",
  "isActive": false
}
```

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "employee-uuid-1",
    "fullName": "Trần Văn B",
    "phone": "0912345679",
    "isActive": false
  },
  "message": "Cập nhật nhân viên thành công"
}
```

### 3.5 Delete Employee

**DELETE** `/api/admin/employees/:id`

**Response 200:**

```json
{
  "status": 200,
  "data": null,
  "message": "Xóa nhân viên thành công"
}
```

---

## 4. Customers

### 4.1 Get All Customers

**GET** `/api/customers`

**Response 200:**

```json
{
  "status": 200,
  "data": [
    {
      "id": "customer-uuid-1",
      "fullName": "Phạm Thị Lan",
      "email": "lan@gmail.com",
      "phone": "0911234567",
      "dateOfBirth": "1990-05-15",
      "address": "123 Nguyễn Huệ, Q.1, TP.HCM",
      "notes": null,
      "totalVisits": 5,
      "totalSpent": 2500000,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "message": "Lấy danh sách khách hàng thành công"
}
```

### 4.2 Get Customer by ID

**GET** `/api/customers/:id`

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "customer-uuid-1",
    "fullName": "Phạm Thị Lan",
    "email": "lan@gmail.com",
    "phone": "0911234567",
    "dateOfBirth": "1990-05-15",
    "address": "123 Nguyễn Huệ, Q.1, TP.HCM",
    "notes": "Khách VIP, yêu cầu phòng riêng",
    "totalVisits": 5,
    "totalSpent": 2500000,
    "bookings": [
      {
        "id": "booking-uuid-1",
        "bookingDate": "2024-01-25",
        "status": "confirmed"
      }
    ]
  },
  "message": "Lấy thông tin khách hàng thành công"
}
```

### 4.3 Create Customer

**POST** `/api/customers`

**Body:**

```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "phone": "0987654321",
  "dateOfBirth": "1990-01-01",
  "address": "789 Lê Lợi, Q.1, TP.HCM",
  "notes": "Dị ứng với hương lavender"
}
```

**Response 201:**

```json
{
  "status": 201,
  "data": {
    "id": "new-customer-uuid",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@gmail.com",
    "phone": "0987654321",
    "dateOfBirth": "1990-01-01",
    "address": "789 Lê Lợi, Q.1, TP.HCM",
    "notes": "Dị ứng với hương lavender",
    "totalVisits": 0,
    "totalSpent": 0,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  },
  "message": "Tạo khách hàng thành công"
}
```

### 4.4 Update Customer

**PATCH** `/api/customers/:id`

**Body:**

```json
{
  "phone": "0987654322",
  "notes": "Khách hàng thân thiết"
}
```

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "customer-uuid-1",
    "fullName": "Nguyễn Văn A",
    "phone": "0987654322",
    "notes": "Khách hàng thân thiết"
  },
  "message": "Cập nhật khách hàng thành công"
}
```

### 4.5 Delete Customer

**DELETE** `/api/customers/:id`

**Response 200:**

```json
{
  "status": 200,
  "data": null,
  "message": "Xóa khách hàng thành công"
}
```

---

## 5. Time Slots

### 5.1 Get All Time Slots

**GET** `/api/admin/time-slots`

**Query Params:**

- `active=true` (optional)

**Response 200:**

```json
{
  "status": 200,
  "data": [
    {
      "id": "timeslot-uuid-1",
      "startTime": "09:00:00",
      "endTime": "10:00:00",
      "maxCapacity": 5,
      "currentBookings": 2,
      "isActive": true,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    },
    {
      "id": "timeslot-uuid-2",
      "startTime": "10:00:00",
      "endTime": "11:00:00",
      "maxCapacity": 5,
      "currentBookings": 5,
      "isActive": false,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "message": "Lấy danh sách khung giờ thành công"
}
```

### 5.2 Get Time Slot by ID

**GET** `/api/admin/time-slots/:id`

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "timeslot-uuid-1",
    "startTime": "09:00:00",
    "endTime": "10:00:00",
    "maxCapacity": 5,
    "currentBookings": 2,
    "isActive": true
  },
  "message": "Lấy thông tin khung giờ thành công"
}
```

### 5.3 Check Time Slot Availability

**GET** `/api/admin/time-slots/:id/availability?guests=2`

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "available": true,
    "availableSlots": 3
  },
  "message": "Còn 3 chỗ trống"
}
```

### 5.4 Create Time Slot

**POST** `/api/admin/time-slots`

**Body:**

```json
{
  "startTime": "14:00:00",
  "endTime": "15:00:00",
  "maxCapacity": 5
}
```

**Response 201:**

```json
{
  "status": 201,
  "data": {
    "id": "new-timeslot-uuid",
    "startTime": "14:00:00",
    "endTime": "15:00:00",
    "maxCapacity": 5,
    "currentBookings": 0,
    "isActive": true,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  },
  "message": "Tạo khung giờ thành công"
}
```

### 5.5 Update Time Slot

**PATCH** `/api/admin/time-slots/:id`

**Body:**

```json
{
  "maxCapacity": 10,
  "isActive": true
}
```

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "timeslot-uuid-1",
    "maxCapacity": 10,
    "isActive": true
  },
  "message": "Cập nhật khung giờ thành công"
}
```

### 5.6 Delete Time Slot

**DELETE** `/api/admin/time-slots/:id`

**Response 200:**

```json
{
  "status": 200,
  "data": null,
  "message": "Xóa khung giờ thành công"
}
```

---

## 6. Bookings

### 6.1 Create Booking

**POST** `/api/bookings`

**Body:**

```json
{
  "customerId": "customer-uuid",
  "serviceId": "service-uuid",
  "employeeIds": ["employee-uuid-1", "employee-uuid-2"],
  "bookingDate": "2024-01-25",
  "timeSlotId": "timeslot-uuid",
  "numberOfGuests": 2,
  "totalPrice": 1000000,
  "notes": "Khách yêu cầu phòng yên tĩnh"
}
```

**Response 201:**

```json
{
  "status": 201,
  "data": {
    "id": "booking-uuid",
    "customer": {
      "id": "customer-uuid",
      "fullName": "Phạm Thị Lan",
      "email": "lan@gmail.com"
    },
    "service": {
      "id": "service-uuid",
      "name": "Massage Thư Giãn"
    },
    "bookingEmployees": [
      {
        "id": "booking-employee-uuid-1",
        "employee": {
          "id": "employee-uuid-1",
          "fullName": "Nguyễn Thị Mai",
          "role": "therapist",
          "specialization": "Massage Body"
        }
      },
      {
        "id": "booking-employee-uuid-2",
        "employee": {
          "id": "employee-uuid-2",
          "fullName": "Trần Văn B",
          "role": "therapist",
          "specialization": "Foot Massage"
        }
      }
    ],
    "timeSlot": {
      "id": "timeslot-uuid",
      "startTime": "09:00:00",
      "endTime": "10:00:00"
    },
    "bookingDate": "2024-01-25",
    "numberOfGuests": 2,
    "totalPrice": 1000000,
    "status": "pending",
    "notes": "Khách yêu cầu phòng yên tĩnh",
    "createdAt": "2024-01-20T10:00:00.000Z"
  },
  "message": "Tạo booking thành công"
}
```

### 6.2 Get All Bookings

**GET** `/api/bookings`

**Query Params:**

- `status=confirmed` (optional)
- `date=2024-01-25` (optional)
- `customerId=uuid` (optional)

**Response 200:**

```json
{
  "status": 200,
  "data": [
    {
      "id": "booking-uuid",
      "customer": {
        "fullName": "Phạm Thị Lan"
      },
      "service": {
        "name": "Massage Thư Giãn"
      },
      "bookingEmployees": [
        {
          "employee": {
            "fullName": "Nguyễn Thị Mai"
          }
        },
        {
          "employee": {
            "fullName": "Trần Văn B"
          }
        }
      ],
      "timeSlot": {
        "startTime": "09:00:00",
        "endTime": "10:00:00"
      },
      "bookingDate": "2024-01-25",
      "numberOfGuests": 2,
      "status": "confirmed",
      "totalPrice": 1000000
    }
  ],
  "message": "Lấy danh sách booking thành công"
}
```

### 6.3 Get Booking by ID

**GET** `/api/bookings/:id`

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "booking-uuid",
    "customer": {
      "id": "customer-uuid",
      "fullName": "Phạm Thị Lan",
      "email": "lan@gmail.com"
    },
    "service": {
      "id": "service-uuid",
      "name": "Massage Thư Giãn"
    },
    "bookingEmployees": [
      {
        "id": "booking-employee-uuid-1",
        "employee": {
          "id": "employee-uuid-1",
          "fullName": "Nguyễn Thị Mai",
          "role": "therapist",
          "specialization": "Massage Body"
        }
      },
      {
        "id": "booking-employee-uuid-2",
        "employee": {
          "id": "employee-uuid-2",
          "fullName": "Trần Văn B",
          "role": "therapist",
          "specialization": "Foot Massage"
        }
      }
    ],
    "timeSlot": {
      "id": "timeslot-uuid",
      "startTime": "09:00:00",
      "endTime": "10:00:00"
    },
    "bookingDate": "2024-01-25",
    "numberOfGuests": 2,
    "status": "confirmed",
    "totalPrice": 1000000,
    "notes": "Khách yêu cầu phòng yên tĩnh"
  },
  "message": "Lấy thông tin booking thành công"
}
```

### 6.4 Check Availability

**POST** `/api/bookings/check-availability`

**Body:**

```json
{
  "date": "2024-01-25",
  "timeSlotId": "timeslot-uuid"
}
```

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "date": "2024-01-25",
    "timeSlot": {
      "id": "timeslot-uuid",
      "startTime": "09:00:00",
      "endTime": "10:00:00",
      "maxCapacity": 5,
      "currentBookings": 2
    },
    "availableSlots": 3,
    "maxCapacity": 5,
    "currentBookings": 2,
    "isAvailable": true
  },
  "message": "Kiểm tra tình trạng còn chỗ thành công"
}
```

### 6.5 Get Available Time Slots for Date

**GET** `/api/bookings/available-slots/:date`

**Response 200:**

```json
{
  "status": 200,
  "data": [
    {
      "date": "2024-01-25",
      "timeSlot": {
        "id": "timeslot-uuid-1",
        "startTime": "09:00:00",
        "endTime": "10:00:00"
      },
      "availableSlots": 3,
      "isAvailable": true
    },
    {
      "date": "2024-01-25",
      "timeSlot": {
        "id": "timeslot-uuid-2",
        "startTime": "10:00:00",
        "endTime": "11:00:00"
      },
      "availableSlots": 5,
      "isAvailable": true
    }
  ],
  "message": "Lấy danh sách khung giờ còn trống thành công"
}
```

### 6.6 Get Available Employees

**GET** `/api/bookings/available-employees?date=2024-01-25&timeSlotId=timeslot-uuid`

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "date": "2024-01-25",
    "timeSlotId": "timeslot-uuid",
    "totalEmployees": 10,
    "bookedEmployees": 3,
    "availableEmployees": [
      {
        "id": "employee-uuid-1",
        "fullName": "Nguyễn Thị Mai",
        "email": "mai@spa.com",
        "role": "therapist",
        "specialization": "Massage Body"
      },
      {
        "id": "employee-uuid-2",
        "fullName": "Trần Văn B",
        "email": "tranvanb@spa.com",
        "role": "therapist",
        "specialization": "Foot Massage"
      }
    ]
  },
  "message": "Lấy danh sách nhân viên khả dụng thành công"
}
```

### 6.7 Update Booking (Confirm)

**PATCH** `/api/bookings/:id`

**Body:**

```json
{
  "status": "confirmed"
}
```

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "booking-uuid",
    "status": "confirmed"
  },
  "message": "Xác nhận booking thành công"
}
```

### 6.8 Update Booking (Cancel)

**PATCH** `/api/bookings/:id`

**Body:**

```json
{
  "status": "cancelled",
  "cancellationReason": "Khách hàng yêu cầu hủy"
}
```

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "booking-uuid",
    "status": "cancelled",
    "cancellationReason": "Khách hàng yêu cầu hủy"
  },
  "message": "Hủy booking thành công"
}
```

### 6.9 Update Booking (Complete)

**PATCH** `/api/bookings/:id`

**Body:**

```json
{
  "status": "completed"
}
```

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "booking-uuid",
    "status": "completed"
  },
  "message": "Hoàn thành booking thành công"
}
```

### 6.10 Delete Booking

**DELETE** `/api/bookings/:id`

**Response 200:**

```json
{
  "status": 200,
  "data": null,
  "message": "Xóa booking thành công"
}
```

---

## 7. Notifications

### 7.1 Get Booking Notifications

**GET** `/api/bookings/:id/notifications`

**Response 200:**

```json
{
  "status": 200,
  "data": [
    {
      "id": "notification-uuid-1",
      "bookingId": "booking-uuid",
      "type": "booking_created",
      "title": "Đặt lịch thành công",
      "message": "Bạn đã đặt lịch thành công cho 2 người vào ngày 2024-01-25",
      "status": "sent",
      "recipientEmail": "lan@gmail.com",
      "sentAt": "2024-01-20T10:00:00.000Z",
      "readAt": null,
      "createdAt": "2024-01-20T10:00:00.000Z"
    },
    {
      "id": "notification-uuid-2",
      "bookingId": "booking-uuid",
      "type": "booking_confirmed",
      "title": "Đặt lịch đã được xác nhận",
      "message": "Lịch đặt của bạn đã được xác nhận",
      "status": "read",
      "recipientEmail": "lan@gmail.com",
      "sentAt": "2024-01-20T11:00:00.000Z",
      "readAt": "2024-01-20T12:00:00.000Z",
      "createdAt": "2024-01-20T11:00:00.000Z"
    }
  ],
  "message": "Lấy danh sách thông báo thành công"
}
```

### 7.2 Get All Pending Notifications

**GET** `/api/bookings/notifications/pending`

**Response 200:**

```json
{
  "status": 200,
  "data": [
    {
      "id": "notification-uuid",
      "booking": {
        "id": "booking-uuid",
        "bookingDate": "2024-01-25",
        "customer": {
          "fullName": "Phạm Thị Lan",
          "email": "lan@gmail.com"
        }
      },
      "type": "booking_reminder",
      "title": "Nhắc nhở đặt lịch",
      "message": "Bạn có lịch hẹn vào ngày mai",
      "status": "pending",
      "createdAt": "2024-01-24T10:00:00.000Z"
    }
  ],
  "message": "Lấy danh sách thông báo chờ xử lý thành công"
}
```

### 7.3 Mark Notification as Read

**PATCH** `/api/bookings/notifications/:id/read`

**Response 200:**

```json
{
  "status": 200,
  "data": {
    "id": "notification-uuid",
    "status": "read",
    "readAt": "2024-01-20T15:00:00.000Z"
  },
  "message": "Đánh dấu thông báo đã đọc thành công"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["Email không hợp lệ", "Mật khẩu phải có ít nhất 6 ký tự"],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Email hoặc mật khẩu không đúng",
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Booking với ID xxx không tồn tại",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Khách hàng đã có lịch đặt trong khung giờ này",
  "error": "Conflict"
}
```

---

## 📝 Notes

- **Authentication**: Hệ thống không sử dụng JWT token nữa. Mật khẩu được mã hóa bằng bcrypt trước khi lưu vào database.
- **Response Format**: Tất cả các API đều trả về theo format chuẩn:
  ```json
  {
    "status": 200,
    "data": { ... },
    "message": "Thông điệp mô tả"
  }
  ```
- **Multiple Employees Booking**:
  - Khi tạo booking, có thể chọn nhiều nhân viên qua field `employeeIds` (array)
  - Số lượng nhân viên chọn không được vượt quá `numberOfGuests`
  - Chỉ chọn được nhân viên available (chưa bị book trong cùng khung giờ)
  - Xem chi tiết tại file `MULTIPLE_EMPLOYEES_BOOKING.md`
- **Service Pricing Types**:
  - `single`: Giá đơn lẻ (VD: Combo 1 - 79.000đ)
  - `range`: Giá khoảng (VD: Sơn gel thạch 120K-150K)
  - `package`: Giá gói (VD: Triệt lông - 129K/lần hoặc 899K/10 lần)
  - `custom`: Giá tùy chỉnh theo yêu cầu (VD: Nail Design)
- **Service Categories** (from Marlie Nails & Spa CSV):
  - **Gội Đầu Dưỡng Sinh**: 4 combos (79K - 329K)
  - **Triệt Lông**: 11 vùng (129K - 1.799K, có gói 10 lần)
  - **Mi**: 13 dịch vụ nối mi, uốn mi (40K - 450K)
  - **Chăm Sóc Da**: 7 liệu trình (200K - 590K, có số bước chi tiết)
  - **Nail - Gel Polish**: 11 dịch vụ sơn gel
  - **Nail - Filling & Extension**: 8 dịch vụ nối móng
  - **Nail - Design**: 10 dịch vụ thiết kế theo yêu cầu
  - **Dịch Vụ Khác**: 15 dịch vụ bổ sung (có ưu đãi mua 5 tặng 1)
- **Folder Structure**:
  - Admin endpoints: `/api/admin/*` (services, time-slots, employees)
  - Customer endpoints: `/api/customers`, `/api/bookings`
  - Auth endpoints: `/api/auth`

## 📊 Common Workflows

### Workflow 1: Tạo Booking Mới với Employee

```
1. GET /api/customers - Lấy danh sách khách hàng hoặc tạo mới
2. GET /api/admin/services - Chọn dịch vụ
3. GET /api/bookings/available-slots/:date - Xem khung giờ trống
4. GET /api/bookings/available-employees?date=2024-01-25&timeSlotId=xxx - Xem nhân viên còn trống
5. POST /api/bookings/check-availability - Kiểm tra có đặt được không
6. POST /api/bookings - Tạo booking với employeeIds (array, tối đa = numberOfGuests)
7. GET /api/bookings/:id/notifications - Xem notification
```

### Workflow 2: Quản Lý Booking

```
1. GET /api/bookings?date=2024-01-25 - Lấy bookings theo ngày
2. PATCH /api/bookings/:id - Xác nhận booking (status=confirmed)
3. PATCH /api/bookings/:id - Hoàn thành (status=completed)
4. GET /api/customers/:id - Xem customer stats đã update
```

### Workflow 3: Hủy Booking

```
1. GET /api/bookings/:id - Lấy thông tin booking
2. PATCH /api/bookings/:id - Hủy với lý do (status=cancelled, cancellationReason)
3. GET /api/admin/time-slots/:id - Kiểm tra time slot đã cập nhật currentBookings
```

### Workflow 4: Quản Lý Nhân Viên

```
1. GET /api/admin/employees - Lấy danh sách nhân viên
2. POST /api/admin/employees - Tạo nhân viên mới
3. PATCH /api/admin/employees/:id - Cập nhật thông tin
4. GET /api/bookings/available-employees - Kiểm tra lịch trống của nhân viên
```

---

**Last Updated**: January 2026
