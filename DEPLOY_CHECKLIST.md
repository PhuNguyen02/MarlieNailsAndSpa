# ✅ Pre-Deployment Checklist

## 📦 Files Đã Tạo

### Backend
- [x] `/backEnd/Dockerfile` - Docker configuration
- [x] `/backEnd/.dockerignore` - Build optimization
- [x] `/backEnd/src/main.ts` - Updated CORS & port config

### Frontend  
- [x] `/frontEnd/Dockerfile` - Docker configuration
- [x] `/frontEnd/.dockerignore` - Build optimization
- [x] `/frontEnd/nginx.conf` - Nginx server config
- [x] `/frontEnd/src/api/index.ts` - API URL từ env variable

### Root
- [x] `/docker-compose.yml` - Local testing
- [x] `/render.yaml` - Render deployment config
- [x] `/DEPLOYMENT_GUIDE.md` - Chi tiết deploy
- [x] `/QUICK_DEPLOY.md` - Quick start guide
- [x] `/API_CONFIG.md` - API configuration guide

## 🔍 Kiểm Tra Trước Khi Deploy

### 1. Code Changes
```bash
# Commit tất cả changes
git add .
git status  # Kiểm tra files
git commit -m "Add Docker deployment configuration"
```

### 2. Test Local (Optional nhưng khuyến nghị)
```bash
# Test backend Docker build
cd backEnd
docker build -t test-backend .

# Test frontend Docker build  
cd frontEnd
docker build -t test-frontend .

# Hoặc test cả 2 với docker-compose
cd ..
docker-compose up --build
```

### 3. Environment Variables Cần Chuẩn Bị

**Backend (.env hoặc Render Dashboard):**
```
NODE_ENV=production
DB_TYPE=postgres (hoặc mysql)
DB_HOST=<your-db-host>
DB_PORT=5432 (hoặc 3306)
DB_USERNAME=<username>
DB_PASSWORD=<password>
DB_NAME=<database-name>
JWT_SECRET=<random-32-char-string>
ADMIN_PASSWORD=<admin-password>
FRONTEND_URL=<frontend-url-sau-khi-deploy>
```

**Frontend (.env.production hoặc Render Dashboard):**
```
VITE_API_BASE_URL=<backend-url>/api
```

### 4. Generate JWT Secret
```bash
# Chạy command này để tạo JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Database Preparation

**Nếu dùng Render PostgreSQL:**
- [ ] Tạo database trên Render Dashboard
- [ ] Lưu connection info
- [ ] Test connection từ local (optional)

**Nếu dùng external database:**
- [ ] Đảm bảo database accessible từ internet
- [ ] Whitelist Render IPs (hoặc allow all)
- [ ] Test connection string

### 6. GitHub Repository
- [ ] Code đã được push lên GitHub
- [ ] Repository là public (hoặc connect Render với private repo)
- [ ] Branch `main` tồn tại

## 🚀 Deploy Steps

### Step 1: Database (Nếu dùng Render)
1. [ ] Login Render Dashboard
2. [ ] Create PostgreSQL database
3. [ ] Copy connection info

### Step 2: Backend Service
1. [ ] New Web Service → Connect GitHub
2. [ ] Configure:
   - Name: `marlie-spa-backend`
   - Root Directory: `backEnd`
   - Environment: `Docker`
   - Region: `Singapore`
3. [ ] Add environment variables
4. [ ] Deploy
5. [ ] Copy backend URL

### Step 3: Frontend Service  
1. [ ] New Web Service → Connect GitHub
2. [ ] Configure:
   - Name: `marlie-spa-frontend`
   - Root Directory: `frontEnd`
   - Environment: `Docker`
   - Region: `Singapore`
3. [ ] Add `VITE_API_BASE_URL` environment variable
4. [ ] Deploy
5. [ ] Copy frontend URL

### Step 4: Update Backend CORS
1. [ ] Vào Backend Service → Environment
2. [ ] Add/Update `FRONTEND_URL` với URL từ Step 3
3. [ ] Save (service sẽ auto-redeploy)

### Step 5: Test
1. [ ] Mở frontend URL
2. [ ] Test login/register
3. [ ] Test các chức năng chính
4. [ ] Check browser console cho errors
5. [ ] Check Network tab

## 🌐 Custom Domain (Optional)

### Frontend Domain
1. [ ] Mua domain
2. [ ] Add custom domain trong Render
3. [ ] Configure DNS (CNAME hoặc A record)
4. [ ] Đợi DNS propagate (5 phút - 1 giờ)
5. [ ] Verify SSL certificate

### Backend Domain (Optional)
1. [ ] Add subdomain `api.yourdomain.com`
2. [ ] Configure DNS
3. [ ] Update `VITE_API_BASE_URL` trong frontend
4. [ ] Redeploy frontend

## 🐛 Common Issues

### Build Failed
- [ ] Check Root Directory setting
- [ ] Verify Dockerfile path
- [ ] Review build logs
- [ ] Test build locally

### Cannot Connect to Database
- [ ] Verify DB credentials
- [ ] Check DB host/port
- [ ] Ensure DB allows external connections

### CORS Errors
- [ ] Verify `FRONTEND_URL` set in backend
- [ ] Check API URL in frontend
- [ ] Review browser console

### 404 on Frontend Routes
- [ ] Verify nginx.conf copied trong Dockerfile
- [ ] Check `try_files` directive

## 📊 Post-Deployment

### Immediate
- [ ] Test tất cả features
- [ ] Verify database connection
- [ ] Check logs cho errors
- [ ] Test trên mobile

### Within 24 Hours
- [ ] Monitor performance
- [ ] Check error rates
- [ ] Verify SSL certificates
- [ ] Test custom domains (nếu có)

### Ongoing
- [ ] Setup monitoring/alerts
- [ ] Configure database backups
- [ ] Plan cho scaling
- [ ] Document any issues

## 🆘 Need Help?

Nếu gặp vấn đề:
1. ✅ Check `DEPLOYMENT_GUIDE.md` - Troubleshooting section
2. ✅ Review Render Dashboard logs
3. ✅ Search Render Community
4. ✅ Contact Render Support

---

**🎉 Sau khi hoàn thành checklist này, ứng dụng của bạn đã sẵn sàng deploy!**

**URLs quan trọng:**
- Render Dashboard: https://dashboard.render.com
- GitHub Repo: https://github.com/YOUR_USERNAME/YOUR_REPO
- Deployment Guide: `/DEPLOYMENT_GUIDE.md`
- Quick Deploy: `/QUICK_DEPLOY.md`
