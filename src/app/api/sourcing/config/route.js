//src/app/api/sourcing/config/route.js
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      version: 1,
      api_base: "/sourcing",
      // Set these based on what you’ve shipped; you can flip them later.
      features: { requests: true, offers: true, orders: true },
    },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}