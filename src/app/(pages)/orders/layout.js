"use client";
// app/my-orders/layout.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();

  const tabs = [
    { name: "All Orders", href: "/orders/all" },
    { name: "Your Sales", href: "/orders/sales" },
    { name: "Orders", href: "/orders/purchases" },
    { name: "Cancellations", href: "/orders/cancellations" },
    { name: "Returns", href: "/orders/returns" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              padding: "8px 12px",
              backgroundColor: pathname === tab.href ? "#007bff" : "#f0f0f0",
              color: pathname === tab.href ? "white" : "black",
              borderRadius: "5px",
              textDecoration: "none",
            }}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
