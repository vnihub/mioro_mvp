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
    console.log('Seeding database...');
    const sql = fs.readFileSync(seedFilePath, 'utf8');
    const statements = sql.split(';').filter(s => s.trim() !== '');
    for (const statement of statements) {
      await client.query(statement);
    }
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.release();
    await pool.end();
  }
}

seedDatabase();