"use client";

export default function SpecificsTableWithIcons({ rows }) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b last:border-b-0">
              <th className="w-44 md:w-56 bg-gray-50 px-3 py-3 text-gray-600 font-medium text-left">
                <div className="flex items-center gap-2">
                  {r.icon}
                  <span>{r.label}</span>
                </div>
              </th>
              <td className="px-3 py-3 text-gray-900">{r.value ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}