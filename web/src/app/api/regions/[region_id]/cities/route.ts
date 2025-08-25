import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: Request, { params }: { params: { region_id: string } }) {
  const { region_id } = params;

  try {
    const { rows } = await pool.query(
      'SELECT id, name, slug, is_capital FROM cities WHERE region_id = $1 ORDER BY name',
      [region_id]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error(`API Error fetching cities for region ${region_id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
