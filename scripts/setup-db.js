const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const setupDatabase = async () => {
  const schema = fs.readFileSync(path.resolve(__dirname, '../schema.sql'), 'utf8');
  const client = await pool.connect();
  try {
    await client.query(schema);
    console.log('Database schema created successfully.');
  } catch (err) {
    console.error('Error creating database schema:', err);
  } finally {
    client.release();
    pool.end();
  }
};

setupDatabase();
