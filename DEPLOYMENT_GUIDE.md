# Hướng Dẫn Deploy Lên Render - Chi Tiết

## 📋 Mục Lục
1. [Chuẩn Bị](#1-chuẩn-bị)
2. [Setup Database](#2-setup-database)
3. [Deploy Backend](#3-deploy-backend)
4. [Deploy Frontend](#4-deploy-frontend)
5. [Cấu Hình Custom Domain](#5-cấu-hình-custom-domain)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Chuẩn Bị

### 1.1. Tạo Tài Khoản Render
1. Truy cập: https://render.com
2. Click "Get Started" hoặc "Sign Up"
3. Đăng ký bằng GitHub account (khuyến nghị để dễ deploy)
4. Xác nhận email

### 1.2. Push Code Lên GitHub
```bash
# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Ready for deployment"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push lên GitHub
git push -u origin main
```

### 1.3. Kiểm Tra Files
Đảm bảo các files sau đã được tạo:
- ✅ `/backEnd/Dockerfile`
- ✅ `/backEnd/.dockerignore`
- ✅ `/frontEnd/Dockerfile`
- ✅ `/frontEnd/.dockerignore`
- ✅ `/frontEnd/nginx.conf`
- ✅ `/docker-compose.yml` (cho local test)
- ✅ `/render.yaml` (cho Render deployment)

---

## 2. Setup Database

### Option 1: Dùng Database Của Render (Khuyến Nghị)

#### Bước 2.1: Tạo PostgreSQL Database
1. Đăng nhập Render Dashboard: https://dashboard.render.com
2. Click nút **"New +"** góc trên bên phải
3. Chọn **"PostgreSQL"**
4. Điền thông tin:
   - **Name**: `marlie-spa-db`
   - **Database**: `marliespa`
   - **User**: `marliespa_user`
   - **Region**: Singapore (gần Việt Nam nhất)
   - **PostgreSQL Version**: 16 (latest)
   - **Plan**: Free
5. Click **"Create Database"**

#### Bước 2.2: Lưu Thông Tin Database
Sau khi tạo xong, bạn sẽ thấy:
- **Hostname**: (ví dụ: dpg-xxxxx-singapore.render.com)
- **Port**: 5432
- **Database**: marliespa
- **Username**: marliespa_user
- **Password**: (password được tạo tự động)
- **Internal Database URL**: (để connect từ Render services)
- **External Database URL**: (để connect từ local)

⚠️ **LƯU Ý**: Copy và lưu các thông tin này, sẽ dùng ở bước sau!

### Option 2: Dùng MySQL External (Nếu bạn đã có database)

Nếu bạn muốn dùng database hiện tại hoặc database từ nhà cung cấp khác:
- Đảm bảo database có thể truy cập từ internet
- Cho phép IP của Render kết nối (hoặc mở cho tất cả IPs nếu cần)
- Lưu thông tin: Host, Port, Username, Password, Database Name

---

## 3. Deploy Backend

### Bước 3.1: Tạo Web Service Cho Backend
1. Vào Render Dashboard: https://dashboard.render.com
2. Click **"New +"** → chọn **"Web Service"**
3. Click **"Build and deploy from a Git repository"** → **"Next"**
4. Chọn repository của bạn (nếu chưa connect GitHub thì làm theo hướng dẫn)
5. Click **"Connect"** bên cạnh repo

### Bước 3.2: Cấu Hình Backend Service
Điền các thông tin sau:

**Basic Configuration:**
- **Name**: `marlie-spa-backend`
- **Region**: Singapore
- **Branch**: `main`
- **Root Directory**: `backEnd` (quan trọng!)
- **Environment**: `Docker`
- **Dockerfile Path**: `./backEnd/Dockerfile` hoặc `Dockerfile`

**Instance Type:**
- **Plan**: Free (hoặc chọn gói khác nếu cần)

### Bước 3.3: Thêm Environment Variables
Scroll xuống phần **"Environment Variables"**, click **"Add Environment Variable"** và thêm:

**Required Variables:**
```
NODE_ENV=production
DB_TYPE=postgres (hoặc mysql nếu dùng MySQL)
DB_HOST=<hostname từ bước 2.2>
DB_PORT=5432 (hoặc 3306 cho MySQL)
DB_USERNAME=<username từ bước 2.2>
DB_PASSWORD=<password từ bước 2.2>
DB_NAME=marliespa
JWT_SECRET=<tạo một chuỗi random phức tạp>
ADMIN_PASSWORD=<password cho admin>
FRONTEND_URL=https://marlie-spa-frontend.onrender.com (tạm thời, sẽ update sau)
```

**Tạo JWT_SECRET mạnh:**
```bash
# Chạy command này trên terminal để tạo JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Bước 3.4: Deploy Backend
1. Click **"Create Web Service"**
2. Render sẽ bắt đầu build và deploy
3. Xem logs để theo dõi quá trình (thường mất 5-10 phút)
4. Khi thấy "Your service is live 🎉", backend đã deploy thành công!

### Bước 3.5: Lưu URL Backend
- URL sẽ có dạng: `https://marlie-spa-backend.onrender.com`
- Lưu lại URL này để cấu hình Frontend

---

## 4. Deploy Frontend

### Bước 4.1: Cập Nhật API URL Trong Frontend

Trước khi deploy frontend, cần cập nhật API URL:

```bash
# Mở file config API
# Ví dụ: /frontEnd/src/api/api.ts hoặc config file
```

Tìm và update base URL:
```typescript
// Thay đổi từ:
const API_BASE_URL = 'http://localhost:3000';

// Thành:
const API_BASE_URL = process.env.VITE_API_URL || 'https://marlie-spa-backend.onrender.com';
```

**Commit và push thay đổi:**
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

### Bước 4.2: Tạo Web Service Cho Frontend
1. Vào Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Chọn repository (nếu đã connect thì click **"Configure account"** để truy cập lại)
4. Click **"Connect"** bên cạnh repo

### Bước 4.3: Cấu Hình Frontend Service
**Basic Configuration:**
- **Name**: `marlie-spa-frontend`
- **Region**: Singapore
- **Branch**: `main`
- **Root Directory**: `frontEnd` (quan trọng!)
- **Environment**: `Docker`
- **Dockerfile Path**: `./frontEnd/Dockerfile` hoặc `Dockerfile`

**Instance Type:**
- **Plan**: Free

### Bước 4.4: Thêm Environment Variables (Nếu Cần)
```
VITE_API_URL=https://marlie-spa-backend.onrender.com
```

### Bước 4.5: Deploy Frontend
1. Click **"Create Web Service"**
2. Đợi build hoàn thành (5-10 phút)
3. Frontend URL: `https://marlie-spa-frontend.onrender.com`

### Bước 4.6: Update CORS Trong Backend
Sau khi có URL frontend, cần update CORS settings trong backend:

1. Vào Backend Service trên Render Dashboard
2. Click **"Environment"** tab
3. Thêm/update variable:
   ```
   FRONTEND_URL=https://marlie-spa-frontend.onrender.com
   ```
4. Click **"Save Changes"**
5. Service sẽ tự động redeploy

---

## 5. Cấu Hình Custom Domain

### 5.1. Mua Domain (Nếu Chưa Có)
Các nhà cung cấp domain phổ biến:
- **Namecheap**: https://www.namecheap.com
- **GoDaddy**: https://www.godaddy.com
- **Google Domains**: https://domains.google
- **Tên Miền Việt**: https://tenmienviet.vn

### 5.2. Cấu Hình Custom Domain Cho Frontend

#### Bước 5.2.1: Thêm Domain Vào Render
1. Vào Frontend Service trong Render Dashboard
2. Click tab **"Settings"**
3. Scroll xuống **"Custom Domains"**
4. Click **"Add Custom Domain"**
5. Nhập domain của bạn (ví dụ: `www.marliespa.com` hoặc `marliespa.com`)
6. Click **"Save"**

#### Bước 5.2.2: Cấu Hình DNS
Render sẽ hiển thị các DNS records cần thêm. Có 2 options:

**Option A: Dùng CNAME (Khuyến nghị cho subdomain)**
```
Type: CNAME
Name: www (hoặc @ cho root domain)
Value: marlie-spa-frontend.onrender.com
TTL: 3600
```

**Option B: Dùng A Record (Cho root domain)**
```
Type: A
Name: @
Value: <IP address from Render>
TTL: 3600
```

**Bước làm trên nhà cung cấp domain:**
1. Đăng nhập vào tài khoản domain của bạn
2. Tìm **"DNS Management"** hoặc **"Advanced DNS"**
3. Thêm record như hướng dẫn trên
4. Click **"Save"** hoặc **"Add Record"**

#### Bước 5.2.3: Đợi DNS Propagate
- DNS mất 5 phút - 48 giờ để propagate (thường < 1 giờ)
- Kiểm tra bằng: https://dnschecker.org
- Khi DNS đã propagate, Render sẽ tự động issue SSL certificate

### 5.3. Cấu Hình Custom Domain Cho Backend (Optional)

Nếu bạn muốn backend cũng có custom domain (ví dụ: `api.marliespa.com`):

#### Bước 5.3.1: Thêm Subdomain
1. Vào Backend Service
2. Click **"Settings"** → **"Custom Domains"**
3. Add domain: `api.marliespa.com`

#### Bước 5.3.2: Thêm DNS Record
```
Type: CNAME
Name: api
Value: marlie-spa-backend.onrender.com
TTL: 3600
```

#### Bước 5.3.3: Update Frontend API URL
Sau khi DNS propagate, update lại API URL trong frontend:
```typescript
const API_BASE_URL = 'https://api.marliespa.com';
```

Commit, push và frontend sẽ tự động redeploy.

### 5.4. Force HTTPS (Đã tự động)
Render tự động cung cấp SSL certificate miễn phí và force HTTPS cho tất cả custom domains.

---

## 6. Troubleshooting

### 6.1. Build Failed

**Lỗi: "Cannot find module"**
- Kiểm tra `package.json` có đầy đủ dependencies
- Đảm bảo `Root Directory` được set đúng

**Lỗi: "Docker build failed"**
- Kiểm tra Dockerfile syntax
- Xem logs chi tiết trong Render Dashboard
- Test build local: `docker build -t test-app .`

### 6.2. Backend Issues

**Lỗi: "Cannot connect to database"**
- Kiểm tra DB credentials trong Environment Variables
- Verify database có allow external connections
- Check DB_HOST, DB_PORT đúng

**Lỗi: "Port already in use"**
- Đảm bảo backend listen trên port 3000 (hoặc port từ env variable)
- Render tự động map port

### 6.3. Frontend Issues

**Lỗi: "API request failed"**
- Verify API_URL đúng
- Check CORS settings trong backend
- Xem Network tab trong browser DevTools

**Lỗi: "404 on refresh"**
- Đảm bảo nginx.conf có config `try_files $uri $uri/ /index.html;`
- Kiểm tra file đã được copy trong Dockerfile

### 6.4. Domain Issues

**Domain không hoạt động:**
- Đợi DNS propagate (dùng dnschecker.org)
- Verify DNS records đúng
- Clear browser cache
- Try incognito mode

**SSL Certificate không được issue:**
- Đảm bảo DNS đã point đúng
- Đợi thêm vài phút
- Contact Render support nếu > 24h

### 6.5. Free Plan Limitations

**Service "spins down" sau 15 phút không dùng:**
- Request đầu tiên sẽ mất ~30s để "spin up"
- Giải pháp: Upgrade lên paid plan hoặc dùng uptime monitoring service

**Build time limit:**
- Free plan có limit 15 phút build time
- Optimize Dockerfile để build nhanh hơn

---

## 7. Useful Commands

### Test Local Với Docker Compose
```bash
# Build và start tất cả services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild một service cụ thể
docker-compose up --build backend
```

### Test Individual Dockerfile
```bash
# Backend
cd backEnd
docker build -t marlie-backend .
docker run -p 3000:3000 --env-file .env marlie-backend

# Frontend
cd frontEnd
docker build -t marlie-frontend .
docker run -p 80:80 marlie-frontend
```

### Debug Database Connection
```bash
# Test từ local (dùng External URL từ Render)
psql "postgresql://username:password@host:5432/database"

# Hoặc MySQL
mysql -h host -u username -p database
```

---

## 8. Best Practices

### Security
- ✅ Không commit `.env` files lên Git
- ✅ Dùng Environment Variables cho sensitive data
- ✅ Tạo JWT_SECRET mạnh
- ✅ Enable HTTPS (Render tự động)
- ✅ Set security headers trong nginx

### Performance
- ✅ Enable gzip compression (đã có trong nginx.conf)
- ✅ Cache static assets
- ✅ Optimize Docker images (multi-stage build)
- ✅ Minimize dependencies trong production

### Monitoring
- ✅ Check Render Dashboard thường xuyên
- ✅ Setup alerts cho service downtime
- ✅ Monitor database usage
- ✅ Review application logs

---

## 9. Next Steps

Sau khi deploy thành công:
1. ✅ Test tất cả features trên production
2. ✅ Setup monitoring và alerts
3. ✅ Configure backups cho database
4. ✅ Setup CI/CD pipeline (optional)
5. ✅ Monitor performance và costs
6. ✅ Plan for scaling khi cần

---

## 10. Support & Resources

- **Render Documentation**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Docker Documentation**: https://docs.docker.com
- **NestJS Deployment**: https://docs.nestjs.com/deployment
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

## Liên Hệ

Nếu gặp vấn đề hoặc cần hỗ trợ, hãy:
1. Check phần Troubleshooting trước
2. Search Render Community
3. Contact Render Support
4. Review application logs trong Render Dashboard

---

**Chúc bạn deploy thành công! 🚀**
