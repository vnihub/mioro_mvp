import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '/Users/victornicolaescu/Documents/Websites/mioro/MVP/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: Request) {
  try {
    const result = await pool.query('SELECT * FROM shops ORDER BY id');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
