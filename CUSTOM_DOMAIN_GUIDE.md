# 🌐 Custom Domain Setup Guide

## Overview

Hướng dẫn chi tiết cách setup custom domain cho Frontend và Backend trên Render.

---

## 📋 Prerequisites

### Bạn Cần Có:
- ✅ Domain đã mua (từ Namecheap, GoDaddy, etc.)
- ✅ Frontend & Backend đã deploy thành công trên Render
- ✅ Access vào DNS management của domain registrar

### Domain Suggestions:
- **Frontend**: `www.yourdomain.com` hoặc `yourdomain.com`
- **Backend**: `api.yourdomain.com`

---

## 🏷️ Part 1: Mua Domain (Nếu Chưa Có)

### Option 1: Namecheap (Khuyến nghị - rẻ & dễ dùng)

1. **Vào**: https://www.namecheap.com
2. **Search** domain bạn muốn
3. **Add to cart** và checkout
4. **Price**: ~$10-15/năm cho .com

### Option 2: GoDaddy

1. **Vào**: https://www.godaddy.com
2. **Search** domain
3. **Purchase** (thường đắt hơn Namecheap)

### Option 3: Google Domains

1. **Vào**: https://domains.google
2. **Search** và purchase

### Option 4: Nhà Cung Cấp Việt Nam

**Tên Miền Việt**: https://tenmienviet.vn
- Support tiếng Việt
- Payment qua VN banking
- ~300k-500k VNĐ/năm

**mat bao**: https://www.matbao.net
**Nhân Hòa**: https://nhanhoa.com

---

## 🎯 Part 2: Setup Custom Domain Cho Frontend

### Step 1: Add Domain Trên Render

1. **Login** Render Dashboard: https://dashboard.render.com
2. **Navigate** to Frontend Service (marlie-spa-frontend)
3. Click tab **"Settings"**
4. Scroll xuống section **"Custom Domains"**
5. Click **"Add Custom Domain"**
6. Enter domain:
   - Cho root domain: `yourdomain.com`
   - Cho subdomain: `www.yourdomain.com`
7. Click **"Save"**

### Step 2: Lấy DNS Information

Sau khi add domain, Render sẽ hiển thị DNS records cần setup.

#### Option A: CNAME Record (Dùng cho www hoặc subdomain)
```
Type: CNAME
Name: www (hoặc subdomain name)
Value: marlie-spa-frontend.onrender.com
TTL: 3600 (hoặc Auto)
```

#### Option B: A Record (Dùng cho root domain)
```
Type: A
Name: @ (hoặc để trống)
Value: 216.24.57.1 (IP từ Render)
TTL: 3600
```

**⚠️ LƯU Ý**: IP address có thể thay đổi. Check Render dashboard cho IP chính xác.

### Step 3: Configure DNS Trên Domain Registrar

#### Namecheap

1. **Login** Namecheap account
2. **Domain List** → Click **"Manage"** bên cạnh domain
3. Tab **"Advanced DNS"**
4. Click **"Add New Record"**

**Cho www subdomain (CNAME):**
```
Type: CNAME Record
Host: www
Value: marlie-spa-frontend.onrender.com
TTL: Automatic
```

**Cho root domain (A Record):**
```
Type: A Record
Host: @
Value: 216.24.57.1
TTL: Automatic
```

5. Click **"Save All Changes"** (biểu tượng checkmark màu xanh)

#### GoDaddy

1. **Login** GoDaddy account
2. **My Products** → **Domains**
3. Click **DNS** bên cạnh domain
4. Click **"Add"** trong DNS Records section

**CNAME Record:**
```
Type: CNAME
Name: www
Value: marlie-spa-frontend.onrender.com
TTL: 1 Hour
```

**A Record:**
```
Type: A
Name: @
Value: 216.24.57.1
TTL: 1 Hour
```

5. Click **"Save"**

#### Google Domains

1. **My Domains** → Click domain
2. **DNS** tab
3. Scroll to **"Custom resource records"**
4. Add records tương tự như trên

#### Tên Miền Việt / Vietnamese Registrars

1. **Login** vào tài khoản
2. **Quản lý DNS** hoặc **DNS Management**
3. **Thêm bản ghi** / **Add Record**
4. Nhập thông tin CNAME hoặc A record
5. **Lưu thay đổi**

### Step 4: Verify DNS Configuration

**Dùng online tools:**
1. **DNS Checker**: https://dnschecker.org
   - Nhập domain của bạn
   - Check xem DNS đã propagate chưa

2. **What's My DNS**: https://www.whatsmydns.net
   - Xem DNS records từ nhiều locations

**Dùng Terminal:**
```bash
# Check CNAME record
dig www.yourdomain.com CNAME

# Check A record
dig yourdomain.com A

# hoặc dùng nslookup
nslookup www.yourdomain.com
```

**Expected output:**
```
www.yourdomain.com. 3600 IN CNAME marlie-spa-frontend.onrender.com.
```

### Step 5: Wait for DNS Propagation

**Timeline:**
- Minimum: 5-10 phút
- Typical: 1-2 giờ
- Maximum: 24-48 giờ (rare)

**During propagation:**
- Domain có thể hoạt động ở một số locations nhưng không hoạt động ở locations khác
- Đừng panic - đây là bình thường!
- Clear browser cache nếu cần

### Step 6: SSL Certificate (Automatic)

**Render tự động:**
1. Detect domain đã được configure
2. Validate domain ownership
3. Issue Let's Encrypt SSL certificate
4. Enable HTTPS

**Wait time:** Usually < 10 phút sau khi DNS propagate

**Check SSL:**
```bash
# Check SSL certificate
curl -I https://www.yourdomain.com
```

**Trong browser:**
- Xem biểu tượng ổ khóa trong address bar
- Click để xem certificate details

---

## 🔧 Part 3: Setup Custom Domain Cho Backend (Optional)

### Why Backend Custom Domain?

**Ưu điểm:**
- ✅ Professional: `api.yourdomain.com` vs `marlie-spa-backend.onrender.com`
- ✅ Branding consistency
- ✅ Easier to remember
- ✅ Can migrate backend later without frontend changes

### Step 1: Add Subdomain Trên Render

1. Navigate to **Backend Service**
2. **Settings** → **Custom Domains**
3. Add domain: `api.yourdomain.com`
4. Save

### Step 2: Get DNS Info

Render will show:
```
Type: CNAME
Name: api
Value: marlie-spa-backend.onrender.com
```

### Step 3: Add DNS Record

**Namecheap / GoDaddy / Other:**
```
Type: CNAME Record
Host: api
Value: marlie-spa-backend.onrender.com
TTL: Automatic / 3600
```

### Step 4: Update Frontend API URL

Sau khi DNS propagate:

1. **Vào Frontend Service** trên Render
2. **Environment** tab
3. Update `VITE_API_BASE_URL`:
   ```
   VITE_API_BASE_URL=https://api.yourdomain.com/api
   ```
4. **Save Changes** (service sẽ redeploy)

**Hoặc update trong code:**
```typescript
// frontEnd/src/api/index.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                     "https://api.yourdomain.com/api";
```

### Step 5: Update Backend CORS

Backend sẽ cần accept requests từ new frontend domain:

1. **Vào Backend Service** → **Environment**
2. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://www.yourdomain.com
   ```
3. **Save Changes**

---

## 🎨 Part 4: Advanced DNS Configurations

### Redirect Root to WWW

Nhiều người muốn `yourdomain.com` redirect đến `www.yourdomain.com`.

#### Option 1: URL Redirect Record (Namecheap)

```
Type: URL Redirect Record
Host: @
Value: https://www.yourdomain.com
Redirect Type: Permanent (301)
```

#### Option 2: Render Custom Domain (Cả 2 domains)

1. Add both domains trên Render:
   - `yourdomain.com`
   - `www.yourdomain.com`
2. Render sẽ tự động redirect root → www

### Multiple Domains

Có thể add nhiều domains cho cùng 1 service:
- `yourdomain.com`
- `www.yourdomain.com`
- `yourdomain.net`

Render sẽ serve app cho tất cả domains.

### Email Records (MX Records)

Nếu bạn muốn dùng email với domain (e.g., `info@yourdomain.com`):

**Google Workspace / Gmail:**
```
Type: MX Record
Priority: 1
Value: smtp.google.com
```

**Other email providers:** Check their MX record configuration.

---

## ✅ Part 5: Verification Checklist

### DNS Records Check
```bash
# Check CNAME records
dig www.yourdomain.com CNAME
dig api.yourdomain.com CNAME

# Check A records  
dig yourdomain.com A

# Check propagation globally
curl https://dnschecker.org/api/dns/yourdomain.com
```

### SSL Check
```bash
# Test HTTPS
curl -I https://www.yourdomain.com

# Detailed SSL info
openssl s_client -connect www.yourdomain.com:443 -servername www.yourdomain.com
```

### Application Check
- [ ] Open `https://www.yourdomain.com` in browser
- [ ] Verify SSL certificate (lock icon)
- [ ] Test login/register
- [ ] Check Network tab cho API calls
- [ ] Verify API calls đến `api.yourdomain.com` (nếu setup)
- [ ] Test trên multiple devices/browsers

### Render Dashboard Check
- [ ] Custom domain shows "Active" status
- [ ] SSL certificate shows "Issued"
- [ ] No error messages

---

## 🚨 Troubleshooting

### Issue 1: Domain Không Hoạt Động

**Symptoms:**
- "Site can't be reached"
- "DNS_PROBE_FINISHED_NXDOMAIN"

**Solutions:**
1. **Wait longer** - DNS propagation mất thời gian
2. **Check DNS records:**
   ```bash
   dig www.yourdomain.com
   ```
3. **Verify** DNS records trên registrar
4. **Clear DNS cache:**
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Windows
   ipconfig /flushdns
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```
5. **Try incognito mode** trong browser

### Issue 2: SSL Certificate Không Được Issue

**Symptoms:**
- "Not secure" warning
- "NET::ERR_CERT_COMMON_NAME_INVALID"

**Solutions:**
1. **Wait** - SSL issuance mất 5-15 phút sau DNS propagate
2. **Verify DNS** đã hoàn toàn propagate
3. **Check Render Dashboard** for error messages
4. **Remove và re-add** domain trên Render
5. **Contact Render Support** nếu > 24 giờ

### Issue 3: CORS Errors

**Symptoms:**
- Console error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solutions:**
1. **Update `FRONTEND_URL`** trong backend env vars
2. **Verify** backend CORS config:
   ```typescript
   app.enableCors({
     origin: ['https://www.yourdomain.com'],
     credentials: true,
   });
   ```
3. **Redeploy backend** sau khi update

### Issue 4: Mixed Content Warnings

**Symptoms:**
- "Mixed Content" warning in console
- Some assets không load

**Solutions:**
1. **Ensure** all API calls dùng HTTPS:
   ```typescript
   const API_BASE_URL = 'https://api.yourdomain.com/api';
   ```
2. **Check** external resources (images, fonts) dùng HTTPS
3. **Update** any hardcoded HTTP URLs

### Issue 5: Redirect Loop

**Symptoms:**
- Page reload indefinitely
- "Too many redirects" error

**Solutions:**
1. **Check** URL redirect configuration
2. **Remove** conflicting redirects
3. **Clear cookies** và cache

---

## 💡 Best Practices

### 1. Use HTTPS Everywhere
- ✅ Always configure SSL
- ✅ Redirect HTTP → HTTPS (Render tự động)
- ✅ Update all URLs to HTTPS

### 2. Subdomain Strategy
```
www.yourdomain.com     → Frontend
api.yourdomain.com     → Backend
admin.yourdomain.com   → Admin Panel (future)
staging.yourdomain.com → Staging environment
```

### 3. DNS TTL
- **During setup**: Use low TTL (300-600 seconds) để dễ thay đổi
- **After stable**: Increase TTL (3600+) để giảm DNS queries

### 4. Monitor Certificate Expiration
- Let's Encrypt certificates: 90 ngày
- Render tự động renew
- Setup monitoring để nhận alerts

### 5. Documentation
Document DNS configuration cho team:
- Registrar account info
- DNS records
- Render service mapping
- Emergency contacts

---

## 📊 Domain Configuration Examples

### Example 1: Simple Setup
```
Frontend: www.marliespa.com
Backend:  marlie-spa-backend.onrender.com (default URL)
```

**DNS Records:**
```
www.marliespa.com → CNAME → marlie-spa-frontend.onrender.com
```

### Example 2: Full Custom Domains
```
Frontend: www.marliespa.com
Backend:  api.marliespa.com
```

**DNS Records:**
```
www.marliespa.com → CNAME → marlie-spa-frontend.onrender.com
api.marliespa.com → CNAME → marlie-spa-backend.onrender.com
```

### Example 3: Root Domain + WWW
```
marliespa.com     → Redirect to www.marliespa.com
www.marliespa.com → Frontend
api.marliespa.com → Backend
```

**DNS Records:**
```
marliespa.com     → A     → 216.24.57.1
www.marliespa.com → CNAME → marlie-spa-frontend.onrender.com
api.marliespa.com → CNAME → marlie-spa-backend.onrender.com
```

---

## 🔄 Migration Strategy

### Từ Default URL → Custom Domain

**Planning:**
1. Setup custom domain nhưng giữ default URL active
2. Test thoroughly với custom domain
3. Update all references
4. Monitor sau migration

**Steps:**
1. **Add custom domain** (domain sẽ work song song với default)
2. **Test** custom domain functionality
3. **Update** marketing materials, links
4. **Update** DNS if needed
5. **Monitor** for issues

### Zero-Downtime Migration
- Keep both URLs active during transition
- Use DNS TTL để control cache
- Monitor analytics for traffic shift

---

## 💰 Cost Considerations

### Domain Costs
- **.com**: $10-15/năm
- **.net**: $12-15/năm
- **.vn**: ~300k-500k VNĐ/năm
- **.io**: $30-40/năm

### SSL Certificate
- **Let's Encrypt**: FREE (Render tự động)
- No need to purchase separately

### DNS Hosting
- Usually included with domain purchase
- Premium DNS (Cloudflare, Route53): Optional

### Total Annual Cost
```
Domain: $10-15
SSL: $0 (free via Render)
DNS: $0 (included)
-------------------
Total: ~$10-15/năm
```

---

## 🆘 Support Resources

### Render
- **Docs**: https://render.com/docs/custom-domains
- **Community**: https://community.render.com
- **Support**: support@render.com

### Domain Registrars
- **Namecheap Support**: https://www.namecheap.com/support/
- **GoDaddy Support**: https://www.godaddy.com/help

### DNS Tools
- **DNS Checker**: https://dnschecker.org
- **What's My DNS**: https://www.whatsmydns.net
- **MX Toolbox**: https://mxtoolbox.com

---

## 📝 Summary Checklist

### Pre-Setup
- [ ] Domain purchased
- [ ] Services deployed on Render
- [ ] Access to DNS management

### Frontend Domain
- [ ] Added domain on Render
- [ ] Configured DNS records
- [ ] DNS propagated
- [ ] SSL certificate issued
- [ ] Site accessible via custom domain

### Backend Domain (Optional)
- [ ] Added subdomain on Render
- [ ] Configured DNS records
- [ ] Updated frontend API URL
- [ ] Updated backend CORS
- [ ] API accessible via custom domain

### Final Verification
- [ ] HTTPS working
- [ ] All features functioning
- [ ] CORS no errors
- [ ] Mobile responsive
- [ ] Performance acceptable

---

**🎉 Custom domain setup complete! Your professional domain is live!**

Need help? Check troubleshooting section or contact Render support.
