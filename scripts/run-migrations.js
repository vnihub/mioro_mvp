// scripts/run-migrations.js
require('dotenv').config({ path: './.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '../migrations');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    const files = fs.readdirSync(migrationsDir).sort();
    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`Running migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        try {
          await client.query(sql);
        } catch (error) {
          if (error.code === '42P07' || error.code === '42701') { // 42P07: duplicate_table, 42701: duplicate_column
            console.log(`Ignoring error for already existing object in ${file}`);
          } else {
            throw error;
          }
        }
        console.log(`Finished migration: ${file}`);
      }
    }
    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await client.release();
    await pool.end();
  }
}

runMigrations();