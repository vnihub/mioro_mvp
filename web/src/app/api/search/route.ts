import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { search_type, city_id } = body;

    if (!search_type || !city_id) {
      return NextResponse.json({ error: 'Tipo de búsqueda y ciudad son requeridos' }, { status: 400 });
    }

    let query = '';
    let queryParams: any[] = [];

    if (search_type === 'scrap') {
      const { metal, purity_id, weight_grams } = body;
      if (!metal || !purity_id || !weight_grams) {
        return NextResponse.json({ error: 'Metal, pureza y peso son requeridos para chatarra' }, { status: 400 });
      }
      query = `
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
      queryParams = [weight_grams, city_id, metal, purity_id];
    } else if (search_type === 'bullion') {
      const { bullion_sku_id, quantity } = body;
      if (!bullion_sku_id || !quantity) {
        return NextResponse.json({ error: 'Producto bullion y cantidad son requeridos' }, { status: 400 });
      }
      query = `
        SELECT 
          s.id AS shop_id,
          s.name AS shop_name,
          s.logo_url,
          s.last_price_update_at,
          (pe.price_eur * $1) AS estimated_payout_eur
        FROM shops s
        JOIN price_entries pe ON s.id = pe.shop_id
        WHERE s.city_id = $2
          AND pe.bullion_sku_id = $3
          AND pe.side = 'buy'
          AND pe.context = 'bullion'
          AND s.is_active = true
        ORDER BY estimated_payout_eur DESC;
      `;
      queryParams = [quantity, city_id, bullion_sku_id];
    } else {
      return NextResponse.json({ error: 'Tipo de búsqueda inválido' }, { status: 400 });
    }

    const { rows } = await pool.query(query, queryParams);

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