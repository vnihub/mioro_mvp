import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { Pool } from 'pg';
import { writeFile } from 'fs/promises';
import path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const uploadDir = path.join(process.cwd(), 'public/logos');

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.merchant_id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const file: File | null = data.get('logo') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed.' }, { status: 400 });
    }

    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      return NextResponse.json({ error: 'File is too large. Maximum size is 2MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${session.merchant_id}-${Date.now()}${path.extname(file.name)}`;
    const filePath = path.join(uploadDir, filename);

    // Ensure the upload directory exists
    await require('fs/promises').mkdir(uploadDir, { recursive: true });

    await writeFile(filePath, buffer);
    console.log(`File uploaded to ${filePath}`);

    const newLogoUrl = `/logos/${filename}`;

    const updateQuery = `
      UPDATE shops 
      SET logo_url = $1 
      WHERE id = (
        SELECT id FROM shops 
        WHERE merchant_id = $2 
        ORDER BY id LIMIT 1
      );
    `;
    await pool.query(updateQuery, [newLogoUrl, session.merchant_id]);

    return NextResponse.json({ ok: true, logoUrl: newLogoUrl });

  } catch (error) {
    console.error('Logo upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
