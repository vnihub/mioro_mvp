import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';
import dotenv from 'dotenv';

dotenv.config({ path: '/Users/victornicolaescu/Documents/Websites/mioro/MVP/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request: Request) {
  const { shopName, email, password } = await request.json();

  if (!shopName || !email || !password) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if user already exists
    const existingUser = await client.query('SELECT * FROM merchant_users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'Ya existe un usuario con este email' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new merchant user
    const newUserResult = await client.query(
      'INSERT INTO merchant_users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    );
    const newUserId = newUserResult.rows[0].id;

    // Insert new shop
    const newShopResult = await client.query(
      'INSERT INTO shops (name, merchant_id) VALUES ($1, $2) RETURNING id',
      [shopName, newUserId]
    );
    const newShopId = newShopResult.rows[0].id;

    await client.query('COMMIT');

    // Create session
    const session = await getSession();
    session.merchant_id = newUserId;
    await session.save();

    return NextResponse.json({ ok: true, message: 'Usuario registrado con éxito' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  } finally {
    client.release();
  }
}
