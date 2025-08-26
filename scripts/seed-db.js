// scripts/seed-db.js
require('dotenv').config({ path: './.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const seedFilePath = path.join(__dirname, '../seed.sql');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log('Clearing existing data...');
    await client.query('TRUNCATE TABLE cities, merchants, shops, bullion_skus, price_entries, merchant_users, price_change_logs, lead_events, admin_users RESTART IDENTITY CASCADE;');
    
    console.log('Seeding database...');
    const sql = fs.readFileSync(seedFilePath, 'utf8');
    await client.query(sql);
    console.log('Database seeded successfully.');

    console.log('Resetting ID sequences...');
    const tables = ['merchants', 'shops', 'cities', 'purities', 'bullion_skus', 'price_entries', 'price_change_logs', 'lead_events', 'admin_users', 'merchant_users'];
    for (const table of tables) {
      await client.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), coalesce(max(id), 1), max(id) IS NOT NULL) FROM ${table};`);
    }
    console.log('ID sequences reset.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.release();
    await pool.end();
  }
}

seedDatabase();