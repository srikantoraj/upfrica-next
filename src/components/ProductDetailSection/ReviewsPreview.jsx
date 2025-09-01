"use client";

function Stars({ n }) {
  const full = Math.floor(n);
  const empty = 5 - full;
  return (
    <div className="text-yellow-500 text-sm">
      {"★".repeat(full)}
      {"☆".repeat(empty)}
    </div>
  );
}

export default function ReviewsPreview({ reviews, onSeeAll }) {
  const top = reviews.slice(0, 2);

  return (
    <div className="rounded-xl border border-gray-200 p-4 space-y-3">
      {top.length === 0 ? (
        <p className="text-sm text-gray-600">No reviews yet.</p>
      ) : (
        top.map((r) => (
          <article
            key={r.id}
            className="border-b last:border-b-0 pb-3 last:pb-0"
          >
            <div className="flex items-center gap-2">
              <Stars n={r.rating} />
              <span className="text-xs text-gray-500">{r.date}</span>
            </div>
            <div className="text-sm font-medium text-gray-900">{r.author}</div>
            <p className="text-sm text-gray-700 mt-1 line-clamp-3">{r.text}</p>
          </article>
        ))
      )}

      <button
        onClick={onSeeAll}
        className="text-sm font-medium text-[#8710D8] hover:underline"
      >
        See all reviews
      </button>
    </div>
  );
}