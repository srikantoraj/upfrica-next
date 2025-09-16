// src/app/(pages)/[cc]/sourcing/requests/[id]/page.jsx
import Link from 'next/link';
import { headers, cookies } from 'next/headers';
import { format, parseISO } from 'date-fns';
import OfferList from '@/components/sourcing/OfferList';

export const dynamic = 'force-dynamic'; // offers + status change frequently

function money(v, ccy) {
  if (v == null || v === '' || Number.isNaN(Number(v))) return null;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: (ccy || 'USD').toUpperCase(),
      maximumFractionDigits: 2,
    }).format(Number(v));
  } catch {
    return `${ccy ? `${ccy} ` : ''}${Number(v).toFixed(2)}`;
  }
}

function countryLabel(slug) {
  const map = { gh: 'Ghana', ng: 'Nigeria', ke: 'Kenya', tz: 'Tanzania', ug: 'Uganda', rw: 'Rwanda' };
  return map[String(slug || '').toLowerCase()] || String(slug || '').toUpperCase();
}

async function fetchRequest(id) {
  // Build absolute URL + forward cookies to keep auth/session
  const h = headers();
  const proto = h.get('x-forwarded-proto') || 'https';
  const host = h.get('x-forwarded-host') || h.get('host');
  const base = `${proto}://${host}`;
  const ck = cookies().toString();

  const res = await fetch(`${base}/api/sourcing/requests/${encodeURIComponent(id)}/`, {
    cache: 'no-store',
    headers: ck ? { cookie: ck } : undefined,
  }).catch(() => null);

  if (!res || !res.ok) return null;
  return res.json();
}

function MediaStrip({ media = [] }) {
  if (!Array.isArray(media) || media.length === 0) return null;
  const urls = media
    .map((m) => (typeof m === 'string' ? m : m?.url))
    .filter(Boolean)
    .slice(0, 6);
  if (urls.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
      {urls.map((u, i) => (
        <a
          key={`${u}-${i}`}
          href={u}
          target="_blank"
          rel="noreferrer"
          className="block overflow-hidden rounded-lg border"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={u} alt={`media-${i + 1}`} className="h-24 w-full object-cover" />
        </a>
      ))}
    </div>
  );
}

export default async function SourcingRequestDetail({ params: { cc, id } }) {
  const req = await fetchRequest(id);

  const title = req?.title || `Your request #${id}`;
  const ccy = (req?.currency || 'GHS').toUpperCase();

  const budgetMin = req?.budget_min ?? null;
  const budgetMax = req?.budget_max ?? null;

  const budgetText =
    budgetMin != null && budgetMax != null
      ? `${money(budgetMin, ccy)} – ${money(budgetMax, ccy)}`
      : budgetMin != null
      ? `≥ ${money(budgetMin, ccy)}`
      : budgetMax != null
      ? `≤ ${money(budgetMax, ccy)}`
      : 'Not set';

  const deadline = req?.deadline ? format(parseISO(req.deadline), 'EEE, MMM d') : null;
  const country = countryLabel(req?.deliver_to_country || cc);
  const city = (req?.deliver_to_city || '').trim();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <Link
          href={`/${encodeURIComponent(cc)}/sourcing`}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
        >
          All requests
        </Link>
      </div>

      {/* Request meta */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <dl className="grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-3 sm:gap-x-6">
          <div>
            <dt className="text-neutral-500">Deliver to</dt>
            <dd className="font-medium">
              {city ? `${city}, ` : ''}
              {country}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Budget</dt>
            <dd className="font-medium">{budgetText}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Needed by</dt>
            <dd className="font-medium">{deadline || 'Flexible'}</dd>
          </div>
        </dl>

        {/* Optional: preview of media attached to the request */}
        <MediaStrip media={req?.media} />

        {/* Small hint to improve delivery fee accuracy */}
        <p className="mt-3 text-xs text-neutral-500">
          Accurate delivery city helps sellers quote the right delivery fee.
        </p>
      </div>

      {/* Offers */}
      <OfferList cc={cc} requestId={id} />
    </main>
  );
}