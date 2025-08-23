import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET handler to fetch all available bullion SKUs for selection
export async function GET(request: Request) {
  try {
    const result = await pool.query('SELECT id, product_name, brand, metal_code, weight_grams FROM bullion_skus ORDER BY product_name');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching bullion SKUs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
