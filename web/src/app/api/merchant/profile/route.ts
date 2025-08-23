import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getSession } from '@/lib/session';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Helper function for phone number validation
function isValidSpanishPhoneNumber(phoneNumber: string | null | undefined): boolean {
  if (!phoneNumber) return false; // Phone is mandatory
  const cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
  return /^(?:34)?[6789]\d{8}$/.test(cleanedNumber) || /^\+34[6789]\d{8}$/.test(phoneNumber);
}

// GET handler to fetch profile data
export async function GET(request: Request) {
  const session = await getSession();
  if (!session.merchant_id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, address_line, phone, whatsapp, logo_url FROM shops WHERE merchant_id = $1 ORDER BY id LIMIT 1',
      [session.merchant_id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No shop found for this merchant' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler to update profile data
export async function POST(request: Request) {
  const session = await getSession();
  if (!session.merchant_id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { id, address_line, phone, whatsapp } = await request.json(); // Expect 'id' instead of 'shop_id'

    if (!id || !address_line || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isValidSpanishPhoneNumber(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format. Please use a 9-digit Spanish number (e.g., 612345678 or +34612345678).' }, { status: 400 });
    }
    if (whatsapp && !isValidSpanishPhoneNumber(whatsapp)) {
      return NextResponse.json({ error: 'Invalid WhatsApp number format. Please use a 9-digit Spanish number (e.g., 612345678 or +34612345678).' }, { status: 400 });
    }

    const updateQuery = `
      UPDATE shops
      SET address_line = $1, phone = $2, whatsapp = $3
      WHERE id = $4 AND merchant_id = $5;
    `;
    
    const result = await pool.query(updateQuery, [
      address_line,
      phone,
      whatsapp,
      id, // Use 'id' here
      session.merchant_id
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Shop not found or permission denied' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
