import { DataSource } from 'typeorm';
import { dataSourceOptions } from './config/typeorm.config';
import { seedInitialData } from './database/seeds/initial-data.seed';
import { seedServicePriceUpdate } from './database/seeds/seed-001-service-price';

async function bootstrap() {
  const dataSource = new DataSource(dataSourceOptions);
  
  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');
    
    // Run pending migrations to keep schema in sync
    await dataSource.runMigrations();
    console.log('✅ Migrations executed');
    
    // Step 1: Seed initial data (employees, timeslots, blog, etc.)
    await seedInitialData(dataSource);
    
    // Step 2: Update service/price data (seed-001)
    await seedServicePriceUpdate(dataSource);
    
    console.log('\n✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding thất bại:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

bootstrap();

