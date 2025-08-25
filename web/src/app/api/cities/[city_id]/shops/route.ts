import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: Request, { params }: { params: { city_id: string } }) {
  const { city_id } = params;

  try {
    const query = `
      SELECT 
        s.id, 
        s.name, 
        s.logo_url, 
        s.last_price_update_at,
        json_agg(
          json_build_object(
            'metal_code', pe.metal_code,
            'purity_id', pe.purity_id,
            'bullion_sku_id', pe.bullion_sku_id,
            'price_eur', pe.price_eur
          )
        ) as prices
      FROM shops s
      LEFT JOIN price_entries pe ON s.id = pe.shop_id
      WHERE s.city_id = $1 AND s.is_active = true AND pe.side = 'buy'
      GROUP BY s.id
      ORDER BY s.name;
    `;
    const { rows } = await pool.query(query, [city_id]);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(`API Error fetching shops for city ${city_id}:`, error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
