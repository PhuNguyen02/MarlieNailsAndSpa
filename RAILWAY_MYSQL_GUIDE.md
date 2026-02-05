# 🗄️ Railway MySQL Database - Connection Guide

## Overview

Dự án sử dụng MySQL database được host trên **Railway**. Khi deploy backend lên Render, cần sử dụng **public connection URL**.

---

## 📊 Database Information

### Railway MySQL Credentials

**Public Connection (Dùng cho Render deployment):**
```
Host: tramway.proxy.rlwy.net
Port: 39215
User: root
Password: yuuRnIqOgQjuAeGBXUMypogFitvDaDwS
Database: railway
```

**Connection String:**
```
mysql://root:yuuRnIqOgQjuAeGBXUMypogFitvDaDwS@tramway.proxy.rlwy.net:39215/railway
```

**Internal Connection (CHỈ dùng nếu deploy trong Railway):**
```
Host: mysql.railway.internal
Port: 3306
User: root
Password: yuuRnIqOgQjuAeGBXUMypogFitvDaDwS
Database: railway
```

---

## ⚠️ QUAN TRỌNG: Public vs Internal Connection

### Khi Nào Dùng Public Connection?
✅ **Deploy backend trên Render** → Dùng `tramway.proxy.rlwy.net:39215`  
✅ **Connect từ local machine** → Dùng `tramway.proxy.rlwy.net:39215`  
✅ **Connect từ bất kỳ external service nào** → Dùng `tramway.proxy.rlwy.net:39215`

### Khi Nào Dùng Internal Connection?
✅ **Deploy backend trên Railway** → Dùng `mysql.railway.internal:3306`  
❌ **Deploy trên Render** → KHÔNG dùng internal connection

---

## 🔧 Environment Variables Cho Render

Khi deploy backend lên Render, thêm các environment variables sau:

```env
NODE_ENV=production
DB_TYPE=mysql
DB_HOST=tramway.proxy.rlwy.net
DB_PORT=39215
DB_USERNAME=root
DB_PASSWORD=yuuRnIqOgQjuAeGBXUMypogFitvDaDwS
DB_NAME=railway
JWT_SECRET=<your-generated-secret>
ADMIN_PASSWORD=<your-admin-password>
FRONTEND_URL=<your-frontend-url>
```

### Copy-Paste Template (Thay JWT_SECRET và ADMIN_PASSWORD)
```
NODE_ENV=production
DB_TYPE=mysql
DB_HOST=tramway.proxy.rlwy.net
DB_PORT=39215
DB_USERNAME=root
DB_PASSWORD=yuuRnIqOgQjuAeGBXUMypogFitvDaDwS
DB_NAME=railway
JWT_SECRET=YOUR_SECRET_HERE
ADMIN_PASSWORD=YOUR_PASSWORD_HERE
FRONTEND_URL=https://marlie-spa-frontend.onrender.com
```

---

## 🧪 Test Database Connection

### Từ Local Machine

**Dùng MySQL Client:**
```bash
# Command line
mysql -h tramway.proxy.rlwy.net -P 39215 -u root -p railway

# Khi được hỏi password, nhập:
# yuuRnIqOgQjuAeGBXUMypogFitvDaDwS
```

**Dùng Connection String:**
```bash
mysql mysql://root:yuuRnIqOgQjuAeGBXUMypogFitvDaDwS@tramway.proxy.rlwy.net:39215/railway
```

**Dùng Node.js:**
```javascript
const mysql = require('mysql2/promise');

async function testConnection() {
  const connection = await mysql.createConnection({
    host: 'tramway.proxy.rlwy.net',
    port: 39215,
    user: 'root',
    password: 'yuuRnIqOgQjuAeGBXUMypogFitvDaDwS',
    database: 'railway'
  });
  
  console.log('Connected to Railway MySQL!');
  await connection.end();
}

testConnection();
```

### Verify Tables

```sql
-- Show all tables
SHOW TABLES;

-- Check specific tables
DESCRIBE admin;
DESCRIBE bookings;
DESCRIBE customers;
DESCRIBE employees;
DESCRIBE services;
```

---

## 🔒 Security Notes

### ✅ Good Practices
- ✅ Connection string bao gồm password → Không commit vào Git
- ✅ Dùng environment variables trên Render
- ✅ Railway tự động enable SSL cho public connections
- ✅ Firewall rules đã được Railway cấu hình

### ⚠️ Important Warnings
- ⚠️ Password trong connection string → Giữ bí mật
- ⚠️ Không share credentials publicly
- ⚠️ Không commit .env files vào repository
- ⚠️ Update password định kỳ (nếu cần)

---

## 🐛 Troubleshooting

### Issue 1: "Can't connect to MySQL server"

**Possible causes:**
1. Sai host hoặc port
2. Firewall blocking connection
3. Database không chạy

**Solution:**
```bash
# Verify host và port
ping tramway.proxy.rlwy.net

# Test telnet
telnet tramway.proxy.rlwy.net 39215

# Check Railway dashboard
# Xem database status có phải "Active" không
```

### Issue 2: "Access denied for user"

**Possible causes:**
1. Sai username hoặc password
2. User không có permissions

**Solution:**
```bash
# Verify credentials
# Username: root
# Password: yuuRnIqOgQjuAeGBXUMypogFitvDaDwS

# Check Railway dashboard
# Variables → MYSQL_ROOT_PASSWORD
```

### Issue 3: "Unknown database 'railway'"

**Possible causes:**
1. Sai database name
2. Database chưa được tạo

**Solution:**
```sql
-- Connect without database name
mysql -h tramway.proxy.rlwy.net -P 39215 -u root -p

-- Show all databases
SHOW DATABASES;

-- Verify 'railway' database exists
-- If not, create it:
CREATE DATABASE railway;
```

### Issue 4: Slow Connection

**Possible causes:**
1. Network latency
2. Railway service location far from your location

**Solution:**
- Kiểm tra network speed
- Railway MySQL ở Oregon, US → có thể slow từ VN
- Consider caching strategies
- Connection pooling trong backend

---

## 📊 Railway Dashboard

### Access Database Info
1. Login Railway: https://railway.app
2. Select project: MarlieNailsAndSpa
3. Click MySQL service
4. Tab "Variables" → See all connection info
5. Tab "Metrics" → Monitor database usage

### Important Metrics
- **CPU Usage**: Should be < 80%
- **Memory**: Check usage vs limit
- **Storage**: Free tier có limit
- **Connections**: Monitor active connections

---

## 🔄 Migration & Seeding

### Run Migrations (Từ Local)

```bash
# Set environment variables trước
export DB_HOST=tramway.proxy.rlwy.net
export DB_PORT=39215
export DB_USERNAME=root
export DB_PASSWORD=yuuRnIqOgQjuAeGBXUMypogFitvDaDwS
export DB_NAME=railway
export DB_TYPE=mysql

# Run migrations
cd backEnd
npm run migration:run
```

### Run Seed Data

```bash
# Same environment variables as above
npm run seed
```

---

## 💡 Best Practices

### 1. Connection Pooling
```typescript
// TypeORM config
{
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  extra: {
    connectionLimit: 10, // Pool size
    connectTimeout: 60000, // 60 seconds
  }
}
```

### 2. Error Handling
```typescript
try {
  await connection.query('SELECT 1');
} catch (error) {
  console.error('Database connection failed:', error.message);
  // Implement retry logic
}
```

### 3. Health Checks
```typescript
app.get('/health', async (req, res) => {
  try {
    await connection.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});
```

---

## 📋 Quick Reference

### Connection URLs

| Environment | URL |
|-------------|-----|
| **Render Production** | `tramway.proxy.rlwy.net:39215` |
| **Local Development** | `tramway.proxy.rlwy.net:39215` |
| **Railway Internal** | `mysql.railway.internal:3306` (không dùng cho Render!) |

### Ports

| Connection Type | Port |
|-----------------|------|
| Public (External) | 39215 |
| Internal (Railway) | 3306 |

### Environment Variables Map

| Railway Variable | Our Backend Variable |
|------------------|---------------------|
| MYSQLHOST (internal) | ❌ Không dùng |
| MYSQL_PUBLIC_URL host | DB_HOST=tramway.proxy.rlwy.net |
| MYSQL_PUBLIC_URL port | DB_PORT=39215 |
| MYSQLUSER | DB_USERNAME=root |
| MYSQLPASSWORD | DB_PASSWORD=yuuR... |
| MYSQLDATABASE | DB_NAME=railway |

---

## 🆘 Need Help?

### Resources
- **Railway Docs**: https://docs.railway.app/databases/mysql
- **Railway Community**: https://discord.gg/railway
- **MySQL Docs**: https://dev.mysql.com/doc/

### Common Commands
```bash
# Show connection info
railway variables

# View logs
railway logs

# Connect to database
railway connect mysql
```

---

**✅ Database đã sẵn sàng cho deployment!**

Remember: Dùng **tramway.proxy.rlwy.net:39215** khi deploy trên Render!
