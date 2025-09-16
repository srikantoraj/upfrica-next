//src/app/(pages)/[cc]/requests/opengraph-image.jsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CC_LABELS = {
  gh: "Ghana", ng: "Nigeria", ke: "Kenya", tz: "Tanzania",
  ug: "Uganda", rw: "Rwanda", uk: "United Kingdom", us: "United States",
};

async function fetchOpenCount(cc) {
  const params = new URLSearchParams({
    public: "1",
    status: "open",
    deliver_to_country: String(cc || "").toLowerCase(),
    page_size: "1",
  });
  const res = await fetch(`/api/sourcing/requests/?${params.toString()}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) return 0;
  const data = await res.json().catch(() => ({}));
  return Number(data?.count ?? 0);
}

export default async function Og({ params, searchParams }) {
  const cc = String(params?.cc || "gh").toLowerCase();
  const count = Number(searchParams?.count ?? (await fetchOpenCount(cc)));
  const country = CC_LABELS[cc] || cc.toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          background: "#0a0a0a", color: "white", padding: 64, gap: 16,
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 42, opacity: 0.75 }}>Upfrica</div>
        <div style={{ fontSize: 72, fontWeight: 800 }}>Live sourcing requests</div>
        <div style={{ fontSize: 48 }}>{country}</div>
        <div style={{ fontSize: 40, opacity: 0.9 }}>
          {count} open request{count === 1 ? "" : "s"}
        </div>
      </div>
    ),
    { ...size }
  );
}