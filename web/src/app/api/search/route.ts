import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { metal, purity_id, weight_grams, city_id } = body;

    // Basic validation
    if (!metal || !purity_id || !weight_grams || !city_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // This is a simplified query for the MVP.
    // It finds the price per gram for a given purity and calculates the payout.
    const query = `
      SELECT 
        s.id AS shop_id,
        s.name AS shop_name,
        s.logo_url,
        s.last_price_update_at,
        (pe.price_eur * $1) AS estimated_payout_eur
      FROM shops s
      JOIN price_entries pe ON s.id = pe.shop_id
      WHERE s.city_id = $2
        AND pe.metal_code = $3
        AND pe.purity_id = $4
        AND pe.side = 'buy'
        AND pe.context = 'scrap'
        AND s.is_active = true
      ORDER BY estimated_payout_eur DESC;
    `;

    const { rows } = await pool.query(query, [weight_grams, city_id, metal, purity_id]);

    // The 'pg' library returns NUMERIC types as strings to avoid precision loss.
    // We parse it to a float before sending it to the client.
    const results = rows.map(shop => ({
      ...shop,
      estimated_payout_eur: parseFloat(shop.estimated_payout_eur),
    }));

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
