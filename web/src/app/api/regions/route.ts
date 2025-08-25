import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT id, name, slug FROM regions ORDER BY name');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('API Error fetching regions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
