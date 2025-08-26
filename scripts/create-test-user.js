const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const createTestUser = async () => {
  const email = 'test@merchant.com';
  const password = 'password123';
  const merchantId = 1; // Corresponds to 'Oro Rápido Centro S.L.' from seed.sql

  // Delete user if it exists
  await pool.query('DELETE FROM merchant_users WHERE email = $1', [email]);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await pool.query(
      'INSERT INTO merchant_users (merchant_id, email, password_hash) VALUES ($1, $2, $3)',
      [merchantId, email, hashedPassword]
    );
    console.log(`Successfully created test user '${email}' with password '${password}'`);
  } catch (err) {
    console.error('Error creating test user:', err);
  } finally {
    pool.end();
  }
};

createTestUser();
