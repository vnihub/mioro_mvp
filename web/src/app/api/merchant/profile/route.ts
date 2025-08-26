import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getSession } from '@/lib/session';
import { PhoneNumberUtil } from 'google-libphonenumber';
import dotenv from 'dotenv';

dotenv.config({ path: '/Users/victornicolaescu/Documents/Websites/mioro/MVP/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const phoneUtil = PhoneNumberUtil.getInstance();

// Helper function for phone number validation
function isValidPhoneNumber(phoneNumber: string | null | undefined, countryCode: string = 'ES'): boolean {
  if (!phoneNumber) return false;
  try {
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber, countryCode);
    return phoneUtil.isValidNumber(number);
  } catch (e) {
    return false;
  }
}

function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(String(email).toLowerCase());
}

function isValidOpeningHours(openingHours: any): boolean {
  if (openingHours === null || openingHours === undefined) return true;
  if (typeof openingHours !== 'object') return false;

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  for (const day of days) {
    const daySchedule = openingHours[day];
    if (daySchedule === undefined) continue; // Day not present is fine
    if (daySchedule === null) continue; // Closed day is fine

    if (typeof daySchedule !== 'object' || daySchedule === null) return false; // must be an object if not null/undefined

    const { open, close } = daySchedule;
    if ((open && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(open)) || (close && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(close))) {
      return false;
    }
  }
  return true;
}

// GET handler to fetch profile data
export async function GET(request: Request) {
  const session = await getSession();
  if (!session.merchant_id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, address_line, phone, whatsapp, logo_url, store_image_url, email, opening_hours, description FROM shops WHERE merchant_id = $1 ORDER BY id LIMIT 1',
      [session.merchant_id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No se encontró ninguna tienda para este comerciante' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST handler to update profile data
export async function POST(request: Request) {
  const session = await getSession();
  if (!session.merchant_id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const { id, address_line, phone, whatsapp, email, opening_hours, description } = await request.json();

    if (!id || !address_line || !phone || !email) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    if (description && description.length > 1000) {
      return NextResponse.json({ error: 'La descripción no puede tener más de 1000 caracteres.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Formato de correo electrónico no válido.' }, { status: 400 });
    }

    if (!isValidPhoneNumber(phone)) {
      return NextResponse.json({ error: 'Formato de número de teléfono no válido.' }, { status: 400 });
    }
    if (whatsapp && !isValidPhoneNumber(whatsapp)) {
      return NextResponse.json({ error: 'Formato de número de WhatsApp no válido.' }, { status: 400 });
    }

    if (opening_hours && !isValidOpeningHours(opening_hours)) {
      return NextResponse.json({ error: 'Formato de horario de apertura no válido.' }, { status: 400 });
    }

    const updateQuery = `
      UPDATE shops
      SET address_line = $1, phone = $2, whatsapp = $3, email = $4, opening_hours = $5, description = $6
      WHERE id = $7 AND merchant_id = $8;
    `;
    
    const result = await pool.query(updateQuery, [
      address_line,
      phone,
      whatsapp,
      email,
      opening_hours,
      description,
      id,
      session.merchant_id
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Tienda no encontrada o permiso denegado' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: 'Perfil actualizado con éxito' });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
