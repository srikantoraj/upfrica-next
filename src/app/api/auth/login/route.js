import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function POST(req) {
  try {
    const { email, password, remember = true } = await req.json();

    const dj = await fetch(`${BASE}/api/login/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const payload = await dj.json().catch(() => ({}));
    if (!dj.ok) {
      return NextResponse.json(
        { detail: payload?.detail || payload?.message || "Login failed" },
        { status: dj.status }
      );
    }

    const token = String(payload?.token || "").trim();
    if (!token) {
      return NextResponse.json({ detail: "No token in response" }, { status: 500 });
    }

    const user = payload?.user ?? null;
    const onboarding = payload?.onboarding ?? null;

    // ✅ Return token + user so client can persist them
    const res = NextResponse.json({ user, token, onboarding }, { status: 200 });

    // Optional: also set an httpOnly cookie for server-side routes
    const maxAge = remember ? 60 * 60 * 24 * 30 : undefined; // 30 days
    res.cookies.set("up_auth", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      ...(maxAge ? { maxAge } : {}),
    });

    return res;
  } catch {
    return NextResponse.json({ detail: "Login error" }, { status: 500 });
  }
}
