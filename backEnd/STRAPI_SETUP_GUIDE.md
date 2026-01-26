# 🚀 Strapi CMS Setup Guide

## ✅ Setup Hoàn Thành

Strapi CMS đã được cài đặt thành công và đang chạy!

---

## 📍 Thông Tin Server

- **Strapi Admin Panel**: `http://localhost:1337/admin`
- **Strapi API**: `http://localhost:1337/api`
- **Database**: MySQL (`spa_strapi_cms`)
- **Node Version**: v24.13.0
- **Strapi Version**: 5.33.4 (Enterprise)

---

## 🔐 Admin Account

Bạn đã tạo admin account khi truy cập `http://localhost:1337/admin` lần đầu.

Nếu chưa tạo, mở browser:

1. Truy cập `http://localhost:1337/admin`
2. Điền thông tin admin:
   - First name
   - Last name
   - Email
   - Password (ít nhất 8 ký tự)
3. Click "Let's start"

---

## 📝 Tạo Content Types

### 1. **Blog Post** Content Type

1. Vào **Content-Type Builder** (sidebar trái)
2. Click **"Create new collection type"**
3. Display name: `Blog Post`
4. Click **Continue**

#### Thêm Fields:

**Text Fields:**

- `title` (Text, Required, Short text)
- `slug` (Text, Unique, Required)
- `excerpt` (Text, Long text)

**Rich Text:**

- `content` (Rich text, Required)

**Media:**

- `featuredImage` (Media, Single)

**Enumeration:**

- `status` (Enumeration)
  - Values: `draft`, `published`, `archived`
  - Default: `draft`

**Relation:**

- `category` (Relation)
  - Relation type: Many-to-One
  - Target: Category

**JSON:**

- `metaKeywords` (JSON)
- `tags` (JSON)

**Text Fields (SEO):**

- `metaTitle` (Text)
- `metaDescription` (Text, Long text)

**Number:**

- `readingTime` (Number, Integer, Default: 0)
- `viewCount` (Number, Integer, Default: 0)

**Boolean:**

- `allowComments` (Boolean, Default: true)

**Date:**

- `publishedAt` (Date)

5. Click **Save** và **Yes, restart**

---

### 2. **Category** Content Type

1. Click **"Create new collection type"**
2. Display name: `Category`

#### Fields:

- `name` (Text, Required, Unique)
- `slug` (Text, Required, Unique)
- `description` (Text, Long text)

3. Click **Save** và **Yes, restart**

---

### 3. Configure Media Library

Media Library đã có sẵn trong Strapi, không cần tạo thêm.

---

## 🔑 API Tokens & Permissions

### Tạo API Token (để NestJS gọi Strapi):

1. **Settings** → **API Tokens** → **Create new API Token**
2. Name: `NestJS Backend`
3. Token type: `Read-Only` (hoặc `Full access` nếu cần)
4. Duration: `Unlimited`
5. Click **Save**
6. **Copy token** và lưu lại (chỉ hiện 1 lần!)

### Configure Public API Access:

1. **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Enable permissions:
   - **Blog-post**: find, findOne
   - **Category**: find, findOne
   - **Upload**: find, findOne

3. Click **Save**

---

## 🌐 Configure CORS

File: `spa-cms/config/middlewares.js`

Thêm NestJS backend URL:

```javascript
module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000', // NestJS backend
        'http://localhost:4200', // Angular (if any)
        'http://localhost:3001', // Frontend (if any)
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

---

## 📡 API Endpoints

### Blog Posts

```bash
# Get all blog posts
GET http://localhost:1337/api/blog-posts

# Get single blog post
GET http://localhost:1337/api/blog-posts/:id

# Get blog posts with filters
GET http://localhost:1337/api/blog-posts?filters[status][$eq]=published

# Get with populate (relations)
GET http://localhost:1337/api/blog-posts?populate=*
```

### Categories

```bash
# Get all categories
GET http://localhost:1337/api/categories

# Get single category
GET http://localhost:1337/api/categories/:id

# Get category with blog posts
GET http://localhost:1337/api/categories?populate[blog_posts][populate]=*
```

### Media

```bash
# Get all media
GET http://localhost:1337/api/upload/files

# Upload file
POST http://localhost:1337/api/upload
Content-Type: multipart/form-data
Body: files: [file]
```

---

## 🔄 Integrate với NestJS Backend

### 1. Cài đặt Axios trong NestJS:

```bash
cd /Users/Shared/Files\ From\ d.localized/WorkSpace/Spa-Backend
npm install @nestjs/axios axios
```

### 2. Tạo Strapi Service:

```typescript
// src/strapi/strapi.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StrapiService {
  private readonly strapiUrl = 'http://localhost:1337/api';
  private readonly apiToken = 'YOUR_API_TOKEN_HERE';

  constructor(private httpService: HttpService) {}

  async getBlogPosts(filters?: any) {
    const url = `${this.strapiUrl}/blog-posts`;
    const { data } = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        params: filters,
      }),
    );
    return data;
  }

  async getBlogPost(id: number) {
    const url = `${this.strapiUrl}/blog-posts/${id}`;
    const { data } = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        params: { populate: '*' },
      }),
    );
    return data;
  }

  async getCategories() {
    const url = `${this.strapiUrl}/categories`;
    const { data } = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      }),
    );
    return data;
  }
}
```

### 3. Tạo Module:

```typescript
// src/strapi/strapi.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StrapiService } from './strapi.service';

@Module({
  imports: [HttpModule],
  providers: [StrapiService],
  exports: [StrapiService],
})
export class StrapiModule {}
```

### 4. Sử dụng trong Controller:

```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { StrapiService } from '../strapi/strapi.service';

@Controller('content')
export class ContentController {
  constructor(private strapiService: StrapiService) {}

  @Get('blog-posts')
  async getBlogPosts() {
    return this.strapiService.getBlogPosts({
      populate: '*',
      filters: {
        status: { $eq: 'published' },
      },
    });
  }

  @Get('blog-posts/:id')
  async getBlogPost(@Param('id') id: string) {
    return this.strapiService.getBlogPost(+id);
  }

  @Get('categories')
  async getCategories() {
    return this.strapiService.getCategories();
  }
}
```

---

## 📊 Strapi Query Filters

### Filters:

```javascript
// Equal
filters[field][$eq]=value

// Not equal
filters[field][$ne]=value

// Contains (case-insensitive)
filters[field][$containsi]=value

// Greater than
filters[field][$gt]=value

// Less than
filters[field][$lt]=value

// In array
filters[field][$in][0]=value1&filters[field][$in][1]=value2

// And/Or
filters[$and][0][field1][$eq]=value1&filters[$and][1][field2][$eq]=value2
```

### Pagination:

```javascript
// Page 1, 10 items per page
pagination[page]=1&pagination[pageSize]=10

// Start from item 0, limit 10
pagination[start]=0&pagination[limit]=10
```

### Sort:

```javascript
// Ascending
sort=field:asc

// Descending
sort=field:desc

// Multiple fields
sort[0]=field1:asc&sort[1]=field2:desc
```

### Populate:

```javascript
// Populate all relations
populate=*

// Populate specific field
populate[0]=category

// Populate nested
populate[category][populate]=*
```

---

## 🎯 Example Usage

### Create Blog Post:

1. Vào **Content Manager** → **Blog Post**
2. Click **Create new entry**
3. Fill in:
   - Title: "10 Bước Chăm Sóc Da Hiệu Quả"
   - Slug: "10-buoc-cham-soc-da"
   - Content: [Rich text content]
   - Status: "published"
   - Category: [Select category]
4. Click **Save** và **Publish**

### Query từ NestJS:

```bash
curl http://localhost:3000/api/content/blog-posts
```

---

## 🚀 Development Workflow

### Start Strapi:

```bash
cd /Users/Shared/Files\ From\ d.localized/WorkSpace/spa-cms
npm run develop
```

### Start NestJS:

```bash
cd /Users/Shared/Files\ From\ d.localized/WorkSpace/Spa-Backend
npm run start:dev
```

### Architecture:

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Frontend      │────▶│  NestJS Backend  │────▶│   Strapi     │
│  (Angular/Vue)  │     │  (Port 3000)     │     │  (Port 1337) │
└─────────────────┘     └──────────────────┘     └──────────────┘
                                │                        │
                                │                        │
                                ▼                        ▼
                        ┌─────────────────────────────────┐
                        │       MySQL Database            │
                        │  - spa_db (NestJS)              │
                        │  - spa_strapi_cms (Strapi)      │
                        └─────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Strapi không start:

```bash
# Clean cache
cd spa-cms
rm -rf .cache build dist
npm run develop
```

### Database connection error:

```bash
# Verify MySQL running
mysql -u root -p

# Check database exists
SHOW DATABASES LIKE 'spa_strapi_cms';
```

### CORS error:

Edit `spa-cms/config/middlewares.js` và restart Strapi.

### Port conflict:

Change PORT in `spa-cms/.env` to 1338 or another port.

---

## 📚 Resources

- **Strapi Docs**: https://docs.strapi.io/
- **REST API**: https://docs.strapi.io/dev-docs/api/rest
- **Content Type Builder**: https://docs.strapi.io/user-docs/content-type-builder

---

## ✨ Next Steps

1. ✅ **Tạo Content Types** (Blog Post, Category)
2. ✅ **Configure Permissions** (Public API access)
3. ✅ **Generate API Token**
4. 🔄 **Integrate với NestJS** (Install axios, create service)
5. 📝 **Create Sample Content**
6. 🧪 **Test APIs**

**Strapi CMS đã sẵn sàng! 🎊**
