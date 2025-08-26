import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { getSession, SessionData } from '@/lib/session';
import dotenv from 'dotenv';

dotenv.config({ path: '/Users/victornicolaescu/Documents/Websites/mioro/MVP/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request: Request) {
  const session = await getSession();
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
  }

  try {
    const result = await pool.query('SELECT * FROM merchant_users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Fetch the shop ID associated with the merchant
    const shopResult = await pool.query('SELECT id FROM shops WHERE merchant_id = $1 LIMIT 1', [user.merchant_id]);
    if (shopResult.rows.length === 0) {
        return NextResponse.json({ error: 'No se encontró una tienda para este comerciante' }, { status: 404 });
    }
    const shopId = shopResult.rows[0].id;

    // Set session data
    session.user_id = user.id;
    session.merchant_id = user.merchant_id;
    session.shop_id = shopId;
    session.email = user.email;
    await session.save();

    return NextResponse.json({ ok: true, message: 'Sesión iniciada con éxito' });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
