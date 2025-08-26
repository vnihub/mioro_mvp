import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getSession } from '@/lib/session';
import dotenv from 'dotenv';

dotenv.config({ path: '/Users/victornicolaescu/Documents/Websites/mioro/MVP/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET handler to fetch all prices for the logged-in merchant
export async function GET(request: Request) {
  const session = await getSession();
  if (!session.merchant_id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    // First, get the primary shop for the merchant
    const shopResult = await pool.query('SELECT id FROM shops WHERE merchant_id = $1 ORDER BY id LIMIT 1', [session.merchant_id]);
    const shopId = shopResult.rows[0]?.id;

    if (!shopId) {
      return NextResponse.json([]); // No shops found, return empty array
    }

    const query = `
      SELECT 
        pe.id,
        p.label AS purity, 
        m.display_name AS metal,
        m.code AS metal_code,
        pe.context, 
        pe.side, 
        pe.unit, 
        pe.price_eur,
        bs.id AS bullion_sku_id,
        bs.product_name AS sku
      FROM price_entries pe
      JOIN metals m ON m.code = pe.metal_code
      LEFT JOIN purities p ON p.id = pe.purity_id
      LEFT JOIN bullion_skus bs ON bs.id = pe.bullion_sku_id
      WHERE pe.shop_id = $1
      ORDER BY pe.context, m.display_name, p.fineness_ppm DESC, bs.product_name;
    `;
    const { rows } = await pool.query(query, [shopId]);
    const prices = rows.map(p => ({...p, price_eur: parseFloat(p.price_eur)}));
    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching merchant prices:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST handler to save all price changes
export async function POST(request: Request) {
  const session = await getSession();
  if (!session.merchant_id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    const pricesToUpdate: { id: number | string; price_eur: number; side?: 'buy' | 'sell', is_new?: boolean, is_deleted?: boolean, bullion_sku_id?: number, metal_code?: string, context?: 'scrap' | 'bullion' }[] = await request.json();
    if (!Array.isArray(pricesToUpdate)) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    await client.query('BEGIN');

    const shopResult = await client.query('SELECT id FROM shops WHERE merchant_id = $1 ORDER BY id LIMIT 1', [session.merchant_id]);
    const shopId = shopResult.rows[0]?.id;
    if (!shopId) throw new Error('No shop found for merchant');

    for (const price of pricesToUpdate) {
      if (price.context === 'scrap') {
        // Update scrap prices
        const updateQuery = `UPDATE price_entries SET price_eur = $1 WHERE id = $2 AND shop_id = $3`;
        await client.query(updateQuery, [price.price_eur, price.id, shopId]);
      } else if (price.context === 'bullion') {
        if (price.is_deleted) {
          // Delete existing bullion price entries
          if (price.bullion_sku_id) {
            await client.query('DELETE FROM price_entries WHERE bullion_sku_id = $1 AND shop_id = $2', [price.bullion_sku_id, shopId]);
          }
        } else if (price.is_new) {
          // Insert new bullion price entry
          if (price.bullion_sku_id && price.metal_code && price.side) {
            await client.query(
              `INSERT INTO price_entries (shop_id, metal_code, bullion_sku_id, context, side, unit, price_eur)
               VALUES ($1, $2, $3, 'bullion', $4, 'per_item', 0)
               ON CONFLICT (shop_id, side, bullion_sku_id) DO NOTHING`,
              [shopId, price.metal_code, price.bullion_sku_id, price.side]
            );
          }
        } else {
          // Update existing bullion price entry
          const updateQuery = `UPDATE price_entries SET price_eur = $1 WHERE id = $2 AND shop_id = $3`;
          await client.query(updateQuery, [price.price_eur, price.id, shopId]);
        }
      }
    }

    const updateTimestampQuery = `UPDATE shops SET last_price_update_at = NOW() WHERE id = $1`;
    await client.query(updateTimestampQuery, [shopId]);

    await client.query('COMMIT');
    return NextResponse.json({ ok: true, message: 'Prices updated successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating merchant prices:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  } finally {
    client.release();
  }
}
