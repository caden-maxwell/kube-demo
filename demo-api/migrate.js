import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

const client = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

const LOCK_ID = 123456;
const MIGRATIONS_DIR = './migrations';

async function runMigrations() {
  await client.connect();

  try {
    const gotLock = await client.query('SELECT pg_try_advisory_lock($1) AS locked', [LOCK_ID]);
    if (!gotLock.rows[0].locked) {
      console.log('Another instance is running migrations, waiting...');
      await client.query('SELECT pg_advisory_lock($1)', [LOCK_ID]);
      console.log('Migrations finished, exiting.');
      return;
    }

    client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
          version VARCHAR(50) PRIMARY KEY,
          applied_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const version = path.basename(file);
      const res = await client.query(
        'SELECT 1 FROM schema_migrations WHERE version = $1',
        [version]
      );

      if (res.rowCount === 0) {
        console.log(`Applying ${version}...`);
        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query(
            'INSERT INTO schema_migrations (version) VALUES ($1)',
            [version]
          );
          await client.query('COMMIT');
          console.log(`${version} applied successfully.`);
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        }
      } else {
        console.log(`${version} already applied, skipping.`);
      }
    }

  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [LOCK_ID]);
    await client.end();
  }
}

runMigrations().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
