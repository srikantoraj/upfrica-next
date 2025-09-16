// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

async function handleLogout() {
  const jar = cookies();
  const token = jar.get("up_auth")?.value;

  // Best-effort server-side revoke (optional)
  if (token && API) {
    try {
      await fetch(`${API}/api/logout/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
        cache: "no-store",
      });
    } catch {
      // ignore network/API errors here
    }
  }

  // Clear auth + any legacy cookies
  const res = NextResponse.json({ ok: true }, { status: 200 });

  const clear = (name, httpOnly = true) =>
    res.cookies.set(name, "", {
      httpOnly,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      expires: new Date(0), // hard-expire (Safari-friendly)
    });

  clear("up_auth", true);
  if (jar.get("sessionid")) clear("sessionid", true);
  if (jar.get("csrftoken")) clear("csrftoken", false);

  return res;
}

export const POST = handleLogout;
export const GET = handleLogout; // allow GET /api/auth/logout for convenience