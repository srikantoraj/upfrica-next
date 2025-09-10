// src/app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function GET() {
  const jar = cookies();
  const token = jar.get("up_auth")?.value;
  if (!token) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  // Pass timezone if the client stored it
  const tz = jar.get("tz")?.value;

  const dj = await fetch(`${BASE}/api/users/me/`, {
    headers: {
      Authorization: `Token ${token}`,
      ...(tz ? { "X-Timezone": tz } : {}),
    },
    cache: "no-store",
  });

  const body = await dj.json().catch(() => ({}));
  return NextResponse.json(body, { status: dj.status });
}