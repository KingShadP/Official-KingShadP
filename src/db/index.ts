import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

let dbInstance: any = null;

export const createPool = () => {
  return new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    connectionTimeoutMillis: 15000,
  });
};

export function getDb() {
  if (!dbInstance) {
    const pool = createPool();
    pool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
    dbInstance = drizzle(pool, { schema });
  }
  return dbInstance;
}

// Export a proxy for 'db' that resolves dynamically on property access
export const db = new Proxy({}, {
  get(target, prop) {
    const database = getDb();
    return (database as any)[prop];
  }
}) as ReturnType<typeof drizzle<typeof schema>>;
