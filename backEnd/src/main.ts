import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // ===== Auto-run migrations khi khởi động =====
  const dataSource = app.get(DataSource);
  try {
    const pendingMigrations = await dataSource.showMigrations();
    if (pendingMigrations) {
      console.log('📦 Running pending migrations...');
      await dataSource.runMigrations();
      console.log('✅ Migrations completed');
    } else {
      console.log('✅ No pending migrations');
    }
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('⚠️ Migration error (will try synchronize):', errMsg);
    // Fallback: synchronize schema nếu migration lỗi
    try {
      await dataSource.synchronize();
      console.log('✅ Schema synchronized');
    } catch (syncError: unknown) {
      const syncMsg = syncError instanceof Error ? syncError.message : String(syncError);
      console.error('❌ Schema sync failed:', syncMsg);
    }
  }

  // ===== Auto-seed admin account nếu chưa có =====
  try {
    const adminRepo = dataSource.getRepository('Admin');
    const adminCount = await adminRepo.count();
    if (adminCount === 0) {
      console.log('👤 No admin found, creating default admin...');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      await adminRepo.save(
        adminRepo.create({
          username: 'admin',
          email: 'admin@spa.com',
          password: hashedPassword,
          fullName: 'Admin',
          phone: '0000000000',
          isActive: true,
        }),
      );
      console.log('✅ Default admin created (admin@marliespa.com)');
    }
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('⚠️ Auto-seed admin error:', errMsg);
  }

  // Enable CORS với config cho production
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
  app.enableCors({
    origin: [
      frontendUrl,
      'http://localhost:5174',
      'http://localhost:8080',
      'http://187.77.149.176',
      'http://187.77.149.176:80',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Port cho production server
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
}
void bootstrap();
