require('dotenv').config({ path: './.env' });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function debugSeeding() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Truncating tables...');
    await client.query('TRUNCATE TABLE cities, regions RESTART IDENTITY CASCADE');
    
    console.log('Inserting region...');
    await client.query("INSERT INTO regions (id, country_code, name, slug) VALUES (11, 'ES', 'Comunidad de Madrid', 'comunidad-de-madrid')");
    
    console.log('Inserting city...');
    await client.query("INSERT INTO cities (id, country_code, name, slug, region_id, is_capital) VALUES (1, 'ES', 'Madrid', 'madrid', 11, true)");
    
    await client.query('COMMIT');
    console.log('Debug seeding complete.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during debug seeding:', error);
  } finally {
    await client.release();
    await pool.end();
  }
}

debugSeeding();
