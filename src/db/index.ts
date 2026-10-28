import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL || (process.env.SQL_HOST && process.env.SQL_DB_NAME));
}

export const createPool = () => {
  if (!global._postgresPool) {
    const dbUrl = process.env.DATABASE_URL;

    if (dbUrl) {
      const isLocalhost = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
      global._postgresPool = new Pool({
        connectionString: dbUrl,
        ssl: isLocalhost ? false : { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
      });
    } else if (process.env.SQL_HOST) {
      global._postgresPool = new Pool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
        port: Number(process.env.SQL_PORT) || 5432,
        ssl: process.env.SQL_SSL === 'true' ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
      });
    } else {
      // Dummy pool for when database is not configured
      global._postgresPool = new Pool({
        host: '127.0.0.1',
        port: 5432,
        connectionTimeoutMillis: 1000,
      });
    }

    global._postgresPool.on('error', (err: any) => {
      // Suppress repeated connection refused logs when running without external PostgreSQL
      if (err?.code === 'ECONNREFUSED' || err?.code === 'ECONNRESET' || err?.message?.includes('Connection terminated unexpectedly')) {
        return;
      }
      console.warn('PostgreSQL notice:', err?.message || err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });
