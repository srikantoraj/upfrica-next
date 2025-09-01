// app/landing/page.js
export const dynamic = "force-static";
export default function RootLanding() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-black mb-4">Choose your country</h1>
      <ul className="space-y-2">
        <li><a className="underline" href="/gh">🇬🇭 Ghana</a></li>
        <li><a className="underline" href="/ng">🇳🇬 Nigeria</a></li>
        <li><a className="underline" href="/uk">🇬🇧 United Kingdom</a></li>
      </ul>
    </main>
  );
}