import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedInitialData } from './database/seeds/initial-data.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await seedInitialData(dataSource);
  } catch (error) {
    console.error('❌ Seeding thất bại:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
