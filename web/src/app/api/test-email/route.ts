import { NextResponse } from 'next/server';

function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
}

export async function POST(request: Request) {
  const { email } = await request.json();
  const isValid = isValidEmail(email);
  return NextResponse.json({ email, isValid });
}
