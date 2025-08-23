const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const seedDatabase = async () => {
  const seedData = fs.readFileSync(path.resolve(__dirname, '../seed.sql'), 'utf8');
  const client = await pool.connect();
  try {
    await client.query(seedData);
    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    client.release();
    pool.end();
  }
};

seedDatabase();
