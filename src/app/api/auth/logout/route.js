// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function POST() {
  const jar = cookies();
  const token = jar.get('up_auth')?.value;

  // Best-effort server-side revoke (optional)
  if (token && API) {
    try {
      await fetch(`${API}/api/logout/`, {
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
        cache: 'no-store',
      });
    } catch {
      // ignore network/API errors here
    }
  }

  // Clear the HttpOnly cookie
  const res = NextResponse.json({ ok: true });
  res.cookies.set('up_auth', '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // expire immediately
  });
  return res;
}