import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getSession } from '@/lib/session';
import dotenv from 'dotenv';

dotenv.config({ path: '/Users/victornicolaescu/Documents/Websites/mioro/MVP/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET handler to fetch profile data
export async function GET(request: Request) {
  const session = await getSession();
  if (!session.merchant_id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const result = await pool.query(
      `SELECT 
        s.id, 
        s.address_line, 
        s.whatsapp, 
        s.logo_url, 
        s.store_image_url, 
        s.opening_hours, 
        s.description, 
        s.is_active, 
        m.display_name AS name,
        m.contact_email AS email,
        m.contact_phone AS phone
      FROM shops s
      JOIN merchants m ON s.merchant_id = m.id
      WHERE s.merchant_id = $1 
      LIMIT 1`,
      [session.merchant_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT handler to update profile data
export async function PUT(request: Request) {
  const session = await getSession();
  if (!session.merchant_id || !session.shop_id) {
    return NextResponse.json({ error: 'No autenticado o ID de tienda no encontrado en la sesión' }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    const { name, address_line, phone, whatsapp, description, opening_hours, is_active } = await request.json();
    const shopId = session.shop_id;

    await client.query('BEGIN');

    // Update shops table
    const shopQuery = `
      UPDATE shops 
      SET 
        name = $1, 
        address_line = $2, 
        phone = $3, 
        whatsapp = $4, 
        description = $5, 
        opening_hours = $6,
        is_active = $7
      WHERE id = $8 AND merchant_id = $9
    `;
    await client.query(shopQuery, [
      name,
      address_line,
      phone,
      whatsapp,
      description,
      opening_hours,
      is_active,
      shopId,
      session.merchant_id
    ]);

    // Update merchants table
    const merchantQuery = `UPDATE merchants SET display_name = $1, contact_phone = $2 WHERE id = $3`;
    await client.query(merchantQuery, [name, phone, session.merchant_id]);

    await client.query('COMMIT');

    return NextResponse.json({ ok: true, message: 'Perfil actualizado con éxito' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  } finally {
    client.release();
  }
}
