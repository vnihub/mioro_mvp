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
      'SELECT s.id, s.name, s.address_line, s.phone, s.whatsapp, s.email, s.logo_url, s.store_image_url, s.opening_hours, s.description, s.is_active FROM shops s WHERE s.merchant_id = $1 LIMIT 1',
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
    const incomingData = await request.json();
    const shopId = session.shop_id;

    await client.query('BEGIN');

    // Verify that the shop belongs to the logged-in merchant and get existing data
    const shopCheck = await client.query('SELECT * FROM shops WHERE id = $1 AND merchant_id = $2', [shopId, session.merchant_id]);
    if (shopCheck.rows.length === 0) {
      throw new Error('No tienes permiso para editar este perfil o la tienda no existe.');
    }
    const existingData = shopCheck.rows[0];

    // Merge existing data with incoming data
    const dataToSave = { ...existingData, ...incomingData };

    // Basic validation on merged data
    if (!dataToSave.name || !dataToSave.address_line || !dataToSave.phone || !dataToSave.email) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const query = `
      UPDATE shops 
      SET 
        name = $1, 
        address_line = $2, 
        phone = $3, 
        whatsapp = $4, 
        email = $5, 
        description = $6, 
        opening_hours = $7,
        is_active = $8
      WHERE id = $9
    `;

    await client.query(query, [
      dataToSave.name,
      dataToSave.address_line,
      dataToSave.phone,
      dataToSave.whatsapp,
      dataToSave.email,
      dataToSave.description,
      dataToSave.opening_hours,
      dataToSave.is_active,
      shopId
    ]);

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
