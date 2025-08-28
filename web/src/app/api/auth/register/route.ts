import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { getSession, setSession } from '@/lib/session';
import dotenv from 'dotenv';

dotenv.config({ path: '/Users/victornicolaescu/Documents/Websites/mioro/MVP/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request: Request) {
  const { legal_name, display_name, email, password } = await request.json();

  // --- Validation ---
  if (!legal_name || !display_name || !email || !password) {
    return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // --- Check for existing user ---
    const existingUser = await client.query('SELECT id FROM merchant_users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'Ya existe un usuario con este email' }, { status: 409 });
    }

    // --- Create Merchant ---
    const merchantResult = await client.query(
      'INSERT INTO merchants (legal_name, display_name, contact_email, status, verification_level) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [legal_name, display_name, email, 'approved', 'none']
    );
    const merchantId = merchantResult.rows[0].id;

    // --- Create Shop (inactive by default) ---
    const shopResult = await client.query(
      'INSERT INTO shops (merchant_id, city_id, name, address_line, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [merchantId, 1, display_name, 'Dirección pendiente', false] // Default to Madrid (city_id 1)
    );
    const shopId = shopResult.rows[0].id;

    // --- Create Default Scrap Prices ---
    const defaultScrapPrices = [
      { metal_code: 'gold', purity_id: 4, price: 0 }, // 18K
      { metal_code: 'gold', purity_id: 7, price: 0 }, // 24K
      { metal_code: 'silver', purity_id: 11, price: 0 }, // 925
      { metal_code: 'platinum', purity_id: 14, price: 0 }, // 950
    ];

    for (const p of defaultScrapPrices) {
      await client.query(
        `INSERT INTO price_entries (shop_id, metal_code, purity_id, context, side, unit, price)
         VALUES ($1, $2, $3, 'scrap', 'buy', 'per_gram', $4)`,
        [shopId, p.metal_code, p.purity_id, p.price]
      );
    }

    // --- Create Merchant User ---
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      'INSERT INTO merchant_users (merchant_id, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [merchantId, email, hashedPassword]
    );
    const userId = userResult.rows[0].id;

    await client.query('COMMIT');

    // --- Create session for the new user ---
    const session = await getSession();
    session.user_id = userId;
    session.merchant_id = merchantId;
    session.shop_id = shopId;
    await session.save(); // Save the session changes

    return NextResponse.json({ ok: true, message: 'Registro completado' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en el registro:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  } finally {
    client.release();
  }
}