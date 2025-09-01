// app/settings/shop/page.jsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FAQs from "@/components/new-dashboard/settings/FAQs";

export const metadata = {
  title: "Shop FAQs | Settings",
  description: "Create and manage your shop’s Frequently Asked Questions.",
};

export default function Page() {
  // Require auth (we only check for a token cookie here).
  const token =
    cookies().get("auth_token")?.value || cookies().get("token")?.value;
  if (!token) {
    redirect("/login?next=/settings/shop");
  }

  // The client component reuses the same cookie and fetches the shop.
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Store Settings</h1>
      <FAQs />
    </div>
  );
}