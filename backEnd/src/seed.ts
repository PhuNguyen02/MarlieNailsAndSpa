import { DataSource } from 'typeorm';
import { dataSourceOptions } from './config/typeorm.config';
import { seedInitialData } from './database/seeds/initial-data.seed';

async function bootstrap() {
  const dataSource = new DataSource(dataSourceOptions);
  
  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');
    
    await seedInitialData(dataSource);
    
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding thất bại:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

bootstrap();
