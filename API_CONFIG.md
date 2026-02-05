# 🔧 Cấu Hình API URL Cho Production

## Backend API URL đã được cấu hình trong code

File `/frontEnd/src/api/index.ts` đã sử dụng environment variable:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.1.8:8080/api";
```

## Cách Set API URL Trên Render

### Option 1: Qua Render Dashboard (Khuyến nghị)
1. Vào Frontend Service
2. Click tab **Environment**
3. Add variable:
   ```
   Key: VITE_API_BASE_URL
   Value: https://marlie-spa-backend.onrender.com/api
   ```
4. Save Changes

### Option 2: Qua file .env (Local Development)
Tạo file `/frontEnd/.env`:
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

Tạo file `/frontEnd/.env.production`:
```bash
VITE_API_BASE_URL=https://marlie-spa-backend.onrender.com/api
```

**Lưu ý**: File `.env.production` sẽ được dùng khi build production.

## ⚠️ Quan Trọng

### URL Format
Đảm bảo URL có format đúng:
- ✅ `https://marlie-spa-backend.onrender.com/api`
- ❌ `https://marlie-spa-backend.onrender.com/api/` (không có trailing slash)
- ❌ `https://marlie-spa-backend.onrender.com` (thiếu /api)

### Sau Khi Deploy Backend
1. Copy URL của backend service
2. Thêm `/api` vào cuối
3. Set vào `VITE_API_BASE_URL`
4. Frontend sẽ tự động redeploy

### Với Custom Domain
Nếu backend có custom domain `api.yourdomain.com`:
```
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

## Test API Connection

Sau khi deploy, test bằng cách:
1. Mở browser console trên frontend URL
2. Check Network tab
3. Verify requests đang gọi đúng backend URL
