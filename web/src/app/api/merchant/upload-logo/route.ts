import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { Pool } from 'pg';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const uploadDir = path.join(process.cwd(), 'web/public/logos');
const tempDir = path.join(process.cwd(), 'tmp');

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.merchant_id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let tempFilePath: string | null = null;

  try {
    const data = await request.formData();
    const file: File | null = data.get('logo') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed.' }, { status: 400 });
    }

    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      return NextResponse.json({ error: `File is too large. Maximum size is ${maxSizeInBytes / 1024 / 1024}MB.` }, { status: 400 });
    }

    await mkdir(tempDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    tempFilePath = path.join(tempDir, `${session.merchant_id}-${Date.now()}`);
    await writeFile(tempFilePath, buffer);

    const finalFileName = `${session.merchant_id}-${Date.now()}.webp`;
    const finalFilePath = path.join(uploadDir, finalFileName);

    await mkdir(uploadDir, { recursive: true });

    await sharp(tempFilePath)
      .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(finalFilePath);

    const newLogoUrl = `/logos/${finalFileName}`;

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
  } finally {
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (err) {
        console.error(`Failed to delete temporary file: ${tempFilePath}`, err);
      }
    }
  }
}
