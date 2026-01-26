# 📋 SERVICE STRUCTURE UPDATE - January 2026

## Overview

Cấu trúc bảng `services` đã được cập nhật để hỗ trợ nhiều loại giá và dữ liệu chi tiết hơn, phù hợp với bảng giá thực tế của **Marlie Nails & Spa**.

## Changes Summary

### 1. Entity Changes (`service.entity.ts`)

#### New Fields Added:

**Pricing Structure:**

- `priceType`: ENUM('single', 'range', 'package', 'custom') - Loại giá
- `singlePrice`: DECIMAL(10,2) - Giá đơn lẻ
- `priceRangeMin`: DECIMAL(10,2) - Giá tối thiểu (cho khoảng giá)
- `priceRangeMax`: DECIMAL(10,2) - Giá tối đa (cho khoảng giá)
- `packagePrice`: DECIMAL(10,2) - Giá gói
- `packageSessions`: INT - Số buổi trong gói

**Service Details:**

- `duration`: VARCHAR(50) - Thời lượng dạng string (VD: "35 phút", "55 phút")
- `steps`: JSON - Mảng các bước thực hiện (VD: ["Gội đầu", "Massage"])
- `stepsCount`: INT - Số bước thực hiện
- `zone`: VARCHAR(100) - Vùng (cho triệt lông: Nách, Bikini, Full Body)
- `hasCustomDesign`: BOOLEAN - Có thiết kế tùy chỉnh hay không

#### Legacy Fields (Backward Compatible):

- `basePrice`: DECIMAL(10,2) NULL (was NOT NULL) - Giữ lại cho tương thích
- `durationMinutes`: INT NULL (was NOT NULL) - Giữ lại cho tương thích

### 2. Migration (`1769100000000-UpdateServiceStructure.ts`)

**Migration Features:**

- ✅ Add all new columns
- ✅ Make legacy fields nullable
- ✅ Migrate existing data: `basePrice` → `singlePrice`
- ✅ Set default `priceType = 'single'`
- ✅ Full rollback support

**Run Migration:**

```bash
npm run migration:run
```

**Rollback if needed:**

```bash
npm run migration:revert
```

### 3. Seed Data (`seed.ts`)

**New Services Added (79 services total):**

| Category                   | Count | Examples                                                      |
| -------------------------- | ----- | ------------------------------------------------------------- |
| Gội Đầu Dưỡng Sinh         | 4     | Combo 1 (79K), Combo 2 (179K), Combo 3 (229K), Combo 4 (329K) |
| Triệt Lông                 | 11    | Nách (129K), Bikini (349K), Full Body (1.799K)                |
| Mi                         | 13    | Tháo Mi (40K), Uốn Mi (200K), Nối Mi Classic (300K)           |
| Chăm Sóc Da                | 7     | Lấy Nhân Mụn (200K), Cấy trắng NANO (350K), PEEL DA (590K)    |
| Nail - Gel Polish          | 11    | Sơn gel Hàn cao cấp (50K), Sơn gel thạch (120-150K)           |
| Nail - Filling & Extension | 8     | Nối móng đắp gel (250K), Fill (120K)                          |
| Nail - Design              | 10    | Vẽ gel, French, Đính đá (theo yêu cầu)                        |
| Dịch Vụ Khác               | 15    | Massage body (189-499K), Tắm trắng (450K)                     |

**Run Seed:**

```bash
npm run seed
```

### 4. DTOs Updated

**`create-service.dto.ts` - New Validations:**

- Flexible validation based on `priceType`
- `@ValidateIf` cho từng loại giá
- Support cho `steps` (array), `zone`, `hasCustomDesign`
- Legacy fields giờ là optional

**`update-service.dto.ts`:**

- Extends từ `CreateServiceDto` với `PartialType`
- Tất cả fields đều optional

### 5. Documentation Updated

**`DATABASE_SCHEMA.md`:**

- ✅ Updated ERD with new service fields
- ✅ Added Service Categories section
- ✅ Added Service Pricing Structure examples
- ✅ Updated Migration History
- ✅ Updated Sample Data with new structure

**`API_EXAMPLES.md`:**

- ✅ Updated service response examples
- ✅ Added 4 create service examples (single, range, package, custom)
- ✅ Updated update service examples
- ✅ Added Service Categories in notes
- ✅ Added pricing types explanation

## Pricing Types Explained

### 1. Single Price (`priceType = 'single'`)

Giá cố định cho 1 lần sử dụng.

**Example:**

```json
{
  "name": "Combo 1",
  "category": "Gội Đầu Dưỡng Sinh",
  "priceType": "single",
  "singlePrice": 79000,
  "duration": "35 phút"
}
```

**Use Cases:**

- Các combo gội đầu
- Dịch vụ chăm sóc da
- Dịch vụ massage
- Các dịch vụ có giá cố định

### 2. Range Price (`priceType = 'range'`)

Giá trong khoảng từ X đến Y.

**Example:**

```json
{
  "name": "Sơn gel thạch",
  "category": "Nail - Gel Polish",
  "priceType": "range",
  "priceRangeMin": 120000,
  "priceRangeMax": 150000
}
```

**Use Cases:**

- Dịch vụ nail có nhiều mức giá
- Dịch vụ tùy thuộc vào độ phức tạp
- Bắn tàn nhang (30K - 300K)

### 3. Package Price (`priceType = 'package'`)

Có cả giá lẻ và giá gói (thường là gói 10 lần).

**Example:**

```json
{
  "name": "Triệt Lông Nách",
  "category": "Triệt Lông",
  "zone": "Nách",
  "priceType": "package",
  "singlePrice": 129000, // Giá 1 lần
  "packagePrice": 899000, // Giá gói 10 lần
  "packageSessions": 10
}
```

**Use Cases:**

- Triệt lông (11 vùng khác nhau)
- Các dịch vụ có ưu đãi khi mua gói

### 4. Custom Price (`priceType = 'custom'`)

Giá theo yêu cầu, cần liên hệ trước.

**Example:**

```json
{
  "name": "Vẽ gel",
  "category": "Nail - Design",
  "priceType": "custom",
  "hasCustomDesign": true,
  "description": "Theo yêu cầu"
}
```

**Use Cases:**

- Nail design (vẽ gel, vẽ nổi, French)
- Các dịch vụ thiết kế tùy chỉnh
- Dịch vụ cần tư vấn giá

## Service Categories Detail

### 1. Gội Đầu Dưỡng Sinh (4 combos)

**Features:**

- `priceType = 'single'`
- `duration` field (35-90 phút)
- `steps` array với các bước chi tiết

**Price Range:** 79.000đ - 329.000đ

### 2. Triệt Lông (11 zones)

**Features:**

- `priceType = 'package'`
- `zone` field (Nách, Bikini, Full Body, etc.)
- Both `singlePrice` and `packagePrice`
- `packageSessions = 10`

**Price Range:** 129K - 1.799K (lẻ), 899K - 13.999K (gói 10)

### 3. Mi (13 services)

**Features:**

- Mostly `priceType = 'single'`
- Some use `priceType = 'range'`
- `hasCustomDesign = true` for "Các Loại Mi Thiết Kế"

**Price Range:** 40K - 450K

### 4. Chăm Sóc Da (7 services)

**Features:**

- `priceType = 'single'`
- `stepsCount` field (12-18 bước)
- `steps` JSON array với chi tiết từng bước

**Price Range:** 200K - 590K

### 5. Nail Services (29 services total)

**Sub-categories:**

- **Gel Polish** (11): Sơn gel, tháo gel, etc.
- **Filling & Extension** (8): Nối móng, fill, etc.
- **Design** (10): Vẽ gel, French, Đính đá (custom price)

**Price Range:** 20K - 250K (fixed), some custom

### 6. Dịch Vụ Khác (15 services)

**Features:**

- Mostly `priceType = 'single'`
- `description = 'Mua 5 tặng 1'`
- Includes massage, tắm trắng, etc.

**Price Range:** 30K - 499K

## API Usage Examples

### Create Service - Single Price

```bash
POST /api/admin/services
Content-Type: application/json

{
  "name": "Combo 2",
  "category": "Gội Đầu Dưỡng Sinh",
  "priceType": "single",
  "singlePrice": 179000,
  "duration": "55 phút",
  "steps": [
    "Khai thông kinh lạc",
    "Tẩy trang rửa mặt",
    "Massage mặt nâng cơ",
    "Đắp mặt nạ",
    "Gội 2 nước"
  ]
}
```

### Create Service - Package Price

```bash
POST /api/admin/services
Content-Type: application/json

{
  "name": "Triệt Lông Bikini",
  "category": "Triệt Lông",
  "zone": "Bikini",
  "priceType": "package",
  "singlePrice": 349000,
  "packagePrice": 2799000,
  "packageSessions": 10
}
```

### Create Service - Range Price

```bash
POST /api/admin/services
Content-Type: application/json

{
  "name": "Bắn tàn nhang - nốt ruồi",
  "category": "Dịch Vụ Khác",
  "priceType": "range",
  "priceRangeMin": 30000,
  "priceRangeMax": 300000
}
```

### Create Service - Custom Price

```bash
POST /api/admin/services
Content-Type: application/json

{
  "name": "French đầu móng",
  "category": "Nail - Design",
  "priceType": "custom",
  "hasCustomDesign": true,
  "description": "Theo yêu cầu, liên hệ trước"
}
```

### Query Services by Category

```bash
# Get all hair services
GET /api/admin/services?category=Gội Đầu Dưỡng Sinh

# Get all nail services
GET /api/admin/services?category=Nail - Gel Polish

# Get all active services
GET /api/admin/services?active=true
```

## Frontend Display Recommendations

### Display Single Price

```javascript
if (service.priceType === 'single') {
  return `${formatPrice(service.singlePrice)}`;
}
// Output: "79.000đ"
```

### Display Range Price

```javascript
if (service.priceType === 'range') {
  return `${formatPrice(service.priceRangeMin)} - ${formatPrice(service.priceRangeMax)}`;
}
// Output: "120.000đ - 150.000đ"
```

### Display Package Price

```javascript
if (service.priceType === 'package') {
  return `
    Giá lẻ: ${formatPrice(service.singlePrice)} / lần
    Gói ${service.packageSessions} lần: ${formatPrice(service.packagePrice)}
    (Tiết kiệm: ${formatPrice(service.singlePrice * service.packageSessions - service.packagePrice)})
  `;
}
// Output:
// Giá lẻ: 129.000đ / lần
// Gói 10 lần: 899.000đ
// (Tiết kiệm: 391.000đ)
```

### Display Custom Price

```javascript
if (service.priceType === 'custom') {
  return service.description || 'Liên hệ để biết giá';
}
// Output: "Theo yêu cầu" hoặc "Liên hệ để biết giá"
```

### Display Service Steps (for Combo)

```javascript
if (service.steps && service.steps.length > 0) {
  return (
    <div>
      <h3>
        {service.name} - {service.duration}
      </h3>
      <ol>
        {service.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
```

## Testing

### Test Migration

1. **Backup current database:**

```bash
mysqldump -u root -p spa_db > backup_before_migration.sql
```

2. **Run migration:**

```bash
npm run migration:run
```

3. **Verify migration:**

```bash
# Check new columns exist
mysql -u root -p spa_db -e "DESCRIBE services;"
```

4. **Test rollback (if needed):**

```bash
npm run migration:revert
```

### Test Seed Data

1. **Clear existing services (optional):**

```sql
DELETE FROM services;
```

2. **Run seed:**

```bash
npm run seed
```

3. **Verify seed data:**

```sql
SELECT
  category,
  COUNT(*) as count,
  MIN(singlePrice) as min_price,
  MAX(singlePrice) as max_price
FROM services
GROUP BY category;
```

**Expected Output:**

```
+-----------------------------+-------+-----------+-----------+
| category                    | count | min_price | max_price |
+-----------------------------+-------+-----------+-----------+
| Gội Đầu Dưỡng Sinh          |     4 |  79000.00 | 329000.00 |
| Triệt Lông                  |    11 | 129000.00 |1799000.00 |
| Mi                          |    13 |  40000.00 | 450000.00 |
| Chăm Sóc Da                 |     7 | 200000.00 | 590000.00 |
| Nail - Gel Polish           |    11 |  30000.00 | 200000.00 |
| Nail - Filling & Extension  |     8 |  20000.00 | 250000.00 |
| Nail - Design               |    10 |      NULL |      NULL |
| Dịch Vụ Khác                |    15 |  30000.00 | 499000.00 |
+-----------------------------+-------+-----------+-----------+
```

### Test API Endpoints

```bash
# Get all services
curl http://localhost:3000/api/admin/services

# Get services by category
curl http://localhost:3000/api/admin/services?category=Gội%20Đầu%20Dưỡng%20Sinh

# Create single price service
curl -X POST http://localhost:3000/api/admin/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Combo",
    "category": "Test",
    "priceType": "single",
    "singlePrice": 100000,
    "duration": "30 phút"
  }'

# Create package price service
curl -X POST http://localhost:3000/api/admin/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Triệt Lông",
    "category": "Test",
    "zone": "Test Zone",
    "priceType": "package",
    "singlePrice": 100000,
    "packagePrice": 800000,
    "packageSessions": 10
  }'
```

## Migration Strategy

### Option 1: Fresh Database (Recommended for Development)

```bash
# 1. Drop and recreate database
mysql -u root -p -e "DROP DATABASE IF EXISTS spa_db; CREATE DATABASE spa_db;"

# 2. Run all migrations
npm run migration:run

# 3. Seed data
npm run seed
```

### Option 2: Update Existing Database (Production)

```bash
# 1. Backup database
mysqldump -u root -p spa_db > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Run new migration only
npm run migration:run

# 3. Optionally clear and reseed services
mysql -u root -p spa_db -e "DELETE FROM services; DELETE FROM treatments;"
npm run seed
```

## Troubleshooting

### Issue: Migration fails with "Column already exists"

**Solution:**

```bash
# Check migration status
npm run migration:show

# If migration is partially applied, revert and retry
npm run migration:revert
npm run migration:run
```

### Issue: Seed fails with "Duplicate entry"

**Solution:**

```bash
# Clear existing data first
mysql -u root -p spa_db -e "
DELETE FROM booking_employees;
DELETE FROM bookings;
DELETE FROM treatments;
DELETE FROM services;
"

# Then run seed again
npm run seed
```

### Issue: JSON column not working

**Solution:**
Ensure MySQL version >= 5.7.8 (for JSON support)

```bash
mysql --version
```

## Next Steps

1. ✅ Entity updated
2. ✅ Migration created
3. ✅ Seed data updated
4. ✅ DTOs updated
5. ✅ Documentation updated
6. ⏳ Frontend integration (update service display logic)
7. ⏳ Add service filtering by priceType
8. ⏳ Add service search by category
9. ⏳ Update booking flow to show package options

## References

- Entity: `src/entities/service.entity.ts`
- Migration: `src/migrations/1769100000000-UpdateServiceStructure.ts`
- Seed: `src/database/seed.ts`
- DTOs: `src/admin/services/dto/`
- Documentation: `DATABASE_SCHEMA.md`, `API_EXAMPLES.md`
- CSV Source: `Marlie_Nails_Spa_Bang_Gia.csv`

---

**Last Updated**: January 26, 2026
**Migration ID**: `1769100000000`
**Total Services**: 79 (from CSV)
