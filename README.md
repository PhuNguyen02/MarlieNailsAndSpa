# Marlie Nails and Spa - Monorepo

Dự án này bao gồm cả Backend (NestJS) và Frontend (Vite/React).

## Cấu trúc thư mục

- `/backEnd`: API server sử dụng NestJS.
- `/frontEnd`: Giao diện khách hàng sử dụng React + Vite.

## Cài đặt và Chạy (Local)

Ở thư mục gốc, bạn có thể sử dụng các lệnh sau:

1. **Cài đặt tất cả dependencies:**

   ```bash
   npm run install:all
   ```

2. **Chạy Backend (Dev):**

   ```bash
   npm run backend:dev
   ```

3. **Chạy Frontend (Dev):**
   ```bash
   npm run frontend:dev
   ```

## Triển khai (Production) - Loại trừ Docker

Dự án này được cấu hình để chạy mà không cần Docker bằng cách sử dụng **PM2** hoặc các dịch vụ Node.js trực tiếp.

### Sử dụng PM2

Bạn có thể chạy cả backend và frontend bằng PM2:

```bash
pm2 start ecosystem.config.cjs
```

### Build thủ công

- Build Backend: `npm run backend:build`
- Build Frontend: `npm run frontend:build`

## Cấu hình Deployment

Dự án có file `package.json` ở gốc để các nền tảng (như Railway, Render, App Engine) có thể tự động nhận diện là project Node.js.
