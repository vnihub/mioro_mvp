import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const shopId = params.id;

  try {
    // Fetch shop details
    const shopQuery = 'SELECT * FROM shops WHERE id = $1';
    const shopResult = await pool.query(shopQuery, [shopId]);

    if (shopResult.rows.length === 0) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }
    const shop = shopResult.rows[0];

    // Fetch price entries
    const pricesQuery = `
      SELECT 
        p.label AS purity, 
        m.display_name AS metal, 
        pe.context, 
        pe.side, 
        pe.unit, 
        pe.price_eur,
        bs.product_name AS sku
      FROM price_entries pe
      JOIN metals m ON m.code = pe.metal_code
      LEFT JOIN purities p ON p.id = pe.purity_id
      LEFT JOIN bullion_skus bs ON bs.id = pe.bullion_sku_id
      WHERE pe.shop_id = $1
      ORDER BY m.display_name, p.fineness_ppm DESC;
    `;
    const pricesResult = await pool.query(pricesQuery, [shopId]);

    // Separate prices into scrap and bullion
    const scrapPrices = pricesResult.rows.filter(p => p.context === 'scrap').map(p => ({...p, price_eur: parseFloat(p.price_eur)}));
    const bullionPrices = pricesResult.rows.filter(p => p.context === 'bullion').map(p => ({...p, price_eur: parseFloat(p.price_eur)}));

    // Combine into a single response object
    const response = {
      ...shop,
      scrap_prices: scrapPrices,
      bullion_prices: bullionPrices,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error(`Error fetching shop ${shopId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
