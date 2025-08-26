import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '/Users/victornicolaescu/Documents/Websites/mioro/MVP/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: Request, { params }: { params: { region_id: string } }) {
  const regionId = params.region_id;

  try {
    const { rows } = await pool.query(
      'SELECT id, name, is_capital FROM cities WHERE region_id = $1 ORDER BY name',
      [regionId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error(`API Error fetching cities for region ${regionId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}