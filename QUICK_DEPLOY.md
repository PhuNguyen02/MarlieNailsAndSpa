# 🚀 Quick Deploy Guide - Render

## Các Files Đã Tạo
✅ `/backEnd/Dockerfile` - Docker image cho backend  
✅ `/backEnd/.dockerignore` - Ignore files khi build  
✅ `/frontEnd/Dockerfile` - Docker image cho frontend  
✅ `/frontEnd/.dockerignore` - Ignore files khi build  
✅ `/frontEnd/nginx.conf` - Cấu hình Nginx  
✅ `/docker-compose.yml` - Test local  
✅ `/render.yaml` - Cấu hình Render  
✅ `/DEPLOYMENT_GUIDE.md` - Hướng dẫn chi tiết  

## 📝 Các Bước Deploy Nhanh

### 1️⃣ Push Code Lên GitHub
```bash
git add .
git commit -m "Add Docker configuration for deployment"
git push origin main
```

### 2️⃣ Database Đã Có Sẵn (Railway MySQL)
Database đã được setup sẵn trên Railway với **public connection**:
```
Public URL: tramway.proxy.rlwy.net:39215
User: root
Password: yuuRnIqOgQjuAeGBXUMypogFitvDaDwS
Database: railway
```
**⚠️ LƯU Ý**: Dùng public URL (tramway.proxy.rlwy.net:39215), không dùng internal URL!

**Không cần tạo database mới!**

### 3️⃣ Deploy Backend
1. New + → Web Service
2. Connect GitHub repo
3. Settings:
   - Name: `marlie-spa-backend`
   - Root Directory: `backEnd`
   - Environment: Docker
   - Region: Singapore
4. Add Environment Variables (Railway MySQL):
   ```
   NODE_ENV=production
   DB_TYPE=mysql
   DB_HOST=tramway.proxy.rlwy.net
   DB_PORT=39215
   DB_USERNAME=root
   DB_PASSWORD=yuuRnIqOgQjuAeGBXUMypogFitvDaDwS
   DB_NAME=railway
   JWT_SECRET=<generate-random-string>
   ADMIN_PASSWORD=<your-admin-password>
   FRONTEND_URL=https://marlie-spa-frontend.onrender.com
   ```
5. Create Web Service

### 4️⃣ Deploy Frontend  
1. New + → Web Service
2. Connect GitHub repo
3. Settings:
   - Name: `marlie-spa-frontend`
   - Root Directory: `frontEnd`
   - Environment: Docker
   - Region: Singapore
4. Add: `VITE_API_URL=<backend-url>`
5. Create Web Service

### 5️⃣ Custom Domain (Optional)
1. Mua domain
2. Frontend Service → Settings → Custom Domains
3. Add domain
4. Cấu hình DNS (CNAME hoặc A record)
5. Đợi DNS propagate (5 phút - 1 giờ)

## 📖 Chi Tiết
Xem file `DEPLOYMENT_GUIDE.md` để có hướng dẫn chi tiết từng bước!

## 🧪 Test Local Trước
```bash
# Test với Docker Compose
docker-compose up --build

# Frontend: http://localhost:80
# Backend: http://localhost:3000
```

## ⚠️ Lưu Ý Quan Trọng
- Update API URL trong frontend code trước khi deploy
- Lưu environment variables an toàn
- Free plan services sẽ "sleep" sau 15 phút không dùng
- DNS mất thời gian để propagate
