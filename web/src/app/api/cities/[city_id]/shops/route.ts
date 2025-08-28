import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Log database URL to ensure it's loaded (partially redacted for security)
const dbUrl = process.env.DATABASE_URL;
console.log(`[SHOPS_API_INIT] Connecting to DB: ${dbUrl ? dbUrl.substring(0, 20) + '...' : 'Not found'}`);

const pool = new Pool({ connectionString: dbUrl });

export async function GET(request: Request, { params }: { params: { city_id: string } }) {
  console.log('----------------------------------');
  console.log('[SHOPS_API] Received request at:', new Date().toISOString());
  
  const { city_id } = params;
  console.log(`[SHOPS_API] Raw city_id param: ${city_id}`);

  const cityIdNumber = parseInt(city_id, 10);
  console.log(`[SHOPS_API] Parsed cityIdNumber: ${cityIdNumber}`);

  if (isNaN(cityIdNumber)) {
    console.error('[SHOPS_API] Error: Invalid city ID');
    return NextResponse.json({ error: 'Invalid city ID' }, { status: 400 });
  }

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
            'price', pe.price
          )
        ) FILTER (WHERE pe.id IS NOT NULL) as prices
      FROM shops s
      LEFT JOIN price_entries pe ON s.id = pe.shop_id AND pe.side = 'buy'
      WHERE s.city_id = $1 AND s.is_active = true
      GROUP BY s.id
      ORDER BY s.name;
    `;
    console.log('[SHOPS_API] Executing query with cityIdNumber:', cityIdNumber);
    
    const result = await pool.query(query, [cityIdNumber]);
    
    console.log('[SHOPS_API] Raw database result object:', result);
    console.log(`[SHOPS_API] Query returned ${result.rowCount} rows.`);

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error(`[SHOPS_API] CATCH BLOCK - Error fetching shops for city ${cityIdNumber}:`, error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}