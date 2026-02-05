# 🐳 Docker Configuration Explained

## Overview

Dự án sử dụng **Docker multi-stage builds** để tối ưu image size và deploy lên Render.

---

## Backend Dockerfile (`/backEnd/Dockerfile`)

### Cấu Trúc

```dockerfile
# Stage 1: Builder - Build application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# Stage 2: Production - Run application  
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/uploads ./uploads
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Giải Thích

**Stage 1 - Builder:**
- `FROM node:20-alpine AS builder`: Base image nhẹ (Alpine Linux)
- `COPY package*.json`: Copy dependency files trước
- `npm ci --only=production`: Install production deps (faster than npm install)
- `npm cache clean --force`: Xóa cache để giảm size
- `COPY . .`: Copy source code
- `npm run build`: Compile TypeScript → JavaScript

**Stage 2 - Production:**
- `FROM node:20-alpine`: Fresh base image (không có build artifacts)
- `npm ci --only=production`: Chỉ install production dependencies
- `COPY --from=builder`: Copy built files từ stage 1
- `EXPOSE 3000`: Document port (Render sẽ map tự động)
- `CMD ["npm", "run", "start:prod"]`: Start command

**Ưu Điểm:**
- ✅ Image size nhỏ (~150-200 MB vs ~500+ MB)
- ✅ Không chứa dev dependencies
- ✅ Không chứa source TypeScript files
- ✅ Security: ít packages = ít vulnerabilities

---

## Frontend Dockerfile (`/frontEnd/Dockerfile`)

### Cấu Trúc

```dockerfile
# Stage 1: Builder - Build React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# Stage 2: Production - Serve với Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Giải Thích

**Stage 1 - Builder:**
- Build React app với Vite
- Output: Static files trong `/app/dist`

**Stage 2 - Production:**
- `FROM nginx:alpine`: Nginx web server (lightweight)
- `COPY --from=builder /app/dist`: Copy built static files
- `COPY nginx.conf`: Custom Nginx configuration
- `EXPOSE 80`: HTTP port
- `CMD ["nginx", "-g", "daemon off;"]`: Start Nginx

**Ưu Điểm:**
- ✅ Cực kỳ nhỏ (~30-40 MB)
- ✅ Chỉ chứa static files
- ✅ Nginx performance cao
- ✅ Built-in gzip, caching

---

## Docker Compose (`/docker-compose.yml`)

### Purpose
Test cả frontend + backend locally trước khi deploy.

### Cấu Trúc

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backEnd
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=${DB_HOST}
      # ... other env vars
    networks:
      - app-network

  frontend:
    build:
      context: ./frontEnd
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Giải Thích

**Backend Service:**
- Build từ `./backEnd/Dockerfile`
- Port mapping: host:3000 → container:3000
- Environment variables từ `.env` hoặc shell
- Connect to `app-network`

**Frontend Service:**
- Build từ `./frontEnd/Dockerfile`
- Port mapping: host:80 → container:80
- `depends_on`: Start sau backend
- Connect to `app-network`

**Network:**
- Bridge network để services communicate
- Frontend có thể gọi backend via `http://backend:3000`

### Usage

```bash
# Build và start
docker-compose up --build

# Run in background
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild một service
docker-compose up --build frontend
```

---

## .dockerignore Files

### Purpose
Loại bỏ files không cần thiết khỏi build context → build nhanh hơn.

### Content

```
node_modules      # Dependencies (sẽ install trong Docker)
dist              # Build output (sẽ build trong Docker)
.git              # Git history
.env              # Secrets (dùng env vars trong Render)
*.log             # Log files
.DS_Store         # macOS files
coverage          # Test coverage
.vscode           # Editor config
.idea             # IDE config
```

**Tại Sao Quan Trọng:**
- ✅ Giảm build context size (có thể từ 500MB → 10MB)
- ✅ Build nhanh hơn (ít files để copy)
- ✅ Không leak secrets
- ✅ Reproducible builds

---

## Nginx Configuration (`/frontEnd/nginx.conf`)

### Purpose
Configure Nginx để serve React SPA properly.

### Key Directives

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
```

### Giải Thích

**React Router Support:**
- `try_files $uri $uri/ /index.html`: 
  - Try exact file first
  - Try directory
  - Fallback to index.html (cho client-side routing)
- Giải quyết vấn đề 404 khi refresh page

**Caching Strategy:**
- **Static assets** (JS, CSS, images): Cache 1 năm
  - Vite tự động add hash vào filename (e.g., `main.abc123.js`)
  - Safe để cache dài hạn
- **index.html**: Không cache
  - Luôn fetch version mới
  - Để user nhận updates ngay

**Security Headers:**
- `X-Frame-Options`: Prevent clickjacking
- `X-Content-Type-Options`: Prevent MIME sniffing
- `X-XSS-Protection`: XSS protection

**Gzip Compression:**
- Compress text-based files
- Giảm bandwidth usage
- Faster load times

---

## Render Deployment Flow

### 1. Build Process
```
GitHub Push → Render Detects → Clone Repo → Build Docker Image
```

**Render Build Steps:**
1. Read `render.yaml` hoặc service config
2. Navigate to `Root Directory` (e.g., `backEnd`)
3. Find `Dockerfile`
4. Run `docker build`
5. Push image to Render's registry
6. Deploy container

### 2. Runtime
```
Container Start → Load Env Vars → Start App → Health Check → Live
```

**Render Runtime:**
- Set environment variables từ dashboard
- Map port automatically (Render uses PORT env var)
- Assign public URL
- Setup SSL certificate
- Route traffic

---

## Comparison: Local vs Docker vs Render

### Local Development
```bash
# Backend
npm install
npm run start:dev

# Frontend  
npm install
npm run dev
```
- ✅ Fast reload
- ✅ Easy debugging
- ❌ Environment differences

### Docker (Local)
```bash
docker-compose up --build
```
- ✅ Production-like environment
- ✅ Consistent across machines
- ❌ Slower than local dev
- ✅ Test deployment config

### Render (Production)
```
Git push → Auto deploy
```
- ✅ Fully managed
- ✅ Auto SSL, monitoring
- ✅ Scalable
- ❌ Cold starts (free tier)

---

## Best Practices

### 1. Layer Caching
```dockerfile
# Good: Copy package.json first
COPY package*.json ./
RUN npm ci
COPY . .

# Bad: Copy everything then install
COPY . .
RUN npm ci
```
**Why:** Docker caches layers. Nếu code thay đổi nhưng dependencies không, layer cache hits.

### 2. Multi-stage Builds
```dockerfile
FROM node AS builder
# ... build steps

FROM node AS production
COPY --from=builder /app/dist ./dist
```
**Why:** Final image không chứa build tools, source code.

### 3. Use Alpine Images
```dockerfile
FROM node:20-alpine  # ~40 MB
# vs
FROM node:20         # ~900 MB
```
**Why:** Smaller size, faster downloads, less attack surface.

### 4. Clean Package Manager Cache
```dockerfile
RUN npm ci && npm cache clean --force
```
**Why:** Package manager cache không cần trong final image.

### 5. .dockerignore
```
node_modules
dist
.env
```
**Why:** Faster builds, no secrets leak.

---

## Troubleshooting Docker

### Build Issues

**Error: "Cannot find module"**
```bash
# Check package.json có dependency
# Verify npm ci chạy thành công
docker build --no-cache -t test .
```

**Error: "COPY failed"**
```bash
# Verify file exists
# Check .dockerignore không exclude nó
ls -la backEnd/
```

### Runtime Issues

**Container exits immediately**
```bash
# Check logs
docker logs <container-id>

# Run interactive
docker run -it <image> sh
```

**Cannot connect to database**
```bash
# Verify env vars
docker run --env-file .env <image>

# Check network
docker network ls
```

### Debugging Tips

```bash
# Build và run với logs
docker build -t test . && docker run --rm test

# Run interactive shell
docker run -it --entrypoint sh <image>

# Inspect image
docker inspect <image>

# Check image layers
docker history <image>
```

---

## Performance Optimization

### Image Size
| Configuration | Size |
|---------------|------|
| node:20 | ~900 MB |
| node:20-alpine | ~40 MB |
| Multi-stage (production) | ~150 MB |
| Frontend (nginx) | ~30 MB |

### Build Time
- Use layer caching: ~10x faster rebuilds
- .dockerignore: 2-3x faster initial build
- Multi-stage: Parallel builds possible

### Runtime Performance
- Alpine images: Faster container starts
- Nginx for static files: 10-100x faster than Node
- Production builds: Optimized code

---

## Security Considerations

### ✅ Good Practices
- Use specific versions (`node:20-alpine` not `node:latest`)
- Don't run as root (Render handles this)
- Don't include secrets in images (use env vars)
- Minimal base images (less vulnerabilities)
- Regular updates (`docker pull node:20-alpine`)

### ❌ Avoid
- `COPY . .` without .dockerignore
- Committing .env files
- Using `latest` tags
- Including dev dependencies in production
- Exposing sensitive ports

---

## Summary

### Backend Docker
- ✅ Multi-stage build
- ✅ Production dependencies only
- ✅ ~150 MB image
- ✅ Runs NestJS on port 3000

### Frontend Docker
- ✅ Vite build → static files
- ✅ Nginx server
- ✅ ~30 MB image
- ✅ Optimized caching & gzip

### Docker Compose
- ✅ Test local
- ✅ Both services together
- ✅ Network communication

### Render Deployment
- ✅ Auto-build from Dockerfile
- ✅ Environment variables
- ✅ SSL & custom domains
- ✅ Monitoring included

---

**Docker setup hoàn chỉnh và sẵn sàng cho production! 🐳**
