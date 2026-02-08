import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config(); // Load .env file

// Detect if running in ts-node (development) or compiled (production)
const isDevMode = process.env.TS_NODE || !__filename.includes('dist');

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'spa_db',
  entities: isDevMode ? ['src/entities/*.entity{.ts,.js}'] : ['dist/entities/*.entity{.ts,.js}'],
  migrations: isDevMode ? ['src/migrations/*{.ts,.js}'] : ['dist/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
  charset: 'utf8mb4',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
