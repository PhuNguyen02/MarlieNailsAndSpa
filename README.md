# Marlie Nails and Spa - Monorepo

Dự án này bao gồm cả Backend (NestJS) và Frontend (Vite/React).

## 📋 Cấu trúc thư mục

- `/backEnd`: API server sử dụng NestJS + TypeORM
- `/frontEnd`: Giao diện khách hàng sử dụng React + Vite + Redux

## 🚀 Cài đặt và Chạy (Local)

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

## 🐳 Deploy với Docker (Production)

Dự án đã được cấu hình đầy đủ để deploy lên **Render** sử dụng **Docker**.

### 📚 Documentation

Xem hướng dẫn deploy chi tiết:

- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - 📑 Index tất cả tài liệu
- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - ⚡ Hướng dẫn nhanh (5 phút)
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - 📖 Hướng dẫn chi tiết đầy đủ
- **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** - ✅ Checklist deploy
- **[DOCKER_EXPLAINED.md](./DOCKER_EXPLAINED.md)** - 🐳 Giải thích Docker config
- **[CUSTOM_DOMAIN_GUIDE.md](./CUSTOM_DOMAIN_GUIDE.md)** - 🌐 Setup custom domain

### Quick Start

```bash
# Test local với Docker
docker-compose up --build

# Deploy lên Render
# Follow hướng dẫn trong DEPLOYMENT_GUIDE.md
```

## 🔧 Build thủ công

- Build Backend: `npm run backend:build`
- Build Frontend: `npm run frontend:build`
- Build All: `npm run build`

## 📦 PM2 Deployment (Alternative)

Bạn có thể chạy cả backend và frontend bằng PM2:

```bash
pm2 start ecosystem.config.cjs
```

## 🎯 Features

- 📅 Booking system với multiple employees
- 👥 Customer management
- 💼 Employee management  
- 💅 Service/treatment management
- ⏰ Time slot scheduling
- 🔐 Admin authentication
- 📱 Responsive design

## 🛠️ Tech Stack

**Backend:**
- NestJS + TypeScript
- TypeORM
- PostgreSQL / MySQL
- JWT Authentication

**Frontend:**
- React + TypeScript
- Redux Toolkit
- Material-UI
- Vite

**Deployment:**
- Docker
- Render.com
- Nginx (for frontend)
