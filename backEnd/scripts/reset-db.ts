/**
 * Reset database: DROP + CREATE spa_db.
 * Requires DB_USERNAME/DB_PASSWORD with privilege to create/drop DB (e.g. root).
 * Run from backEnd: npx ts-node scripts/reset-db.ts
 */
import * as mysql from 'mysql2/promise';
import { config } from 'dotenv';

config({ path: '.env' });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USERNAME || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_DATABASE || process.env.DB_NAME || 'spa_db';

async function reset() {
  let conn: mysql.Connection | null = null;
  try {
    conn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: true,
    });
    await conn.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
    await conn.query(
      `CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    console.log(`✅ Database "${DB_NAME}" reset (dropped + recreated).`);
  } catch (e) {
    console.error('❌ Reset failed:', e);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

reset();
