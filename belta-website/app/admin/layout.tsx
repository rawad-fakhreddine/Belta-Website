"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Package, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

const NAV = [
  { label: "Overview",    href: "/admin",              icon: Home    },
  { label: "Products",    href: "/admin/products",     icon: Package },
  { label: "Subscribers", href: "/admin/subscribers",  icon: Mail    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          background: "#2C1810",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Wordmark */}
        <div style={{ padding: "28px 24px 22px" }}>
          <Link
            href="/admin"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              fontWeight: 500,
              color: "#8B4513",
              letterSpacing: "-0.01em",
              textDecoration: "none",
              lineHeight: 1,
              display: "block",
            }}
          >
            Beltà
          </Link>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              fontWeight: 500,
              color: "rgba(245,239,230,0.35)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              margin: "6px 0 0",
            }}
          >
            Admin
          </p>
        </div>

        <div
          style={{
            height: "1px",
            background: "rgba(245,239,230,0.08)",
            marginInline: "24px",
            marginBottom: "8px",
          }}
        />

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "4px 0" }}>
          {NAV.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: active ? 500 : 400,
                  color: active ? "#F5EFE6" : "rgba(245,239,230,0.55)",
                  textDecoration: "none",
                  padding: "10px 24px",
                  borderInlineStart: active
                    ? "2px solid #8B4513"
                    : "2px solid transparent",
                  transition:
                    "color 180ms var(--ease-out), border-color 180ms var(--ease-out)",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    e.currentTarget.style.color = "rgba(245,239,230,0.85)";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    e.currentTarget.style.color = "rgba(245,239,230,0.55)";
                }}
              >
                <Icon size={15} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div
          style={{
            padding: "20px 24px 28px",
            borderTop: "1px solid rgba(245,239,230,0.08)",
          }}
        >
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              width: "100%",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              padding: "9px 14px",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(245,239,230,0.18)",
              background: "transparent",
              color: "rgba(245,239,230,0.55)",
              cursor: signingOut ? "not-allowed" : "pointer",
              opacity: signingOut ? 0.55 : 1,
              transition:
                "color 180ms var(--ease-out), border-color 180ms var(--ease-out)",
              textAlign: "start",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F5EFE6";
              e.currentTarget.style.borderColor = "rgba(245,239,230,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(245,239,230,0.55)";
              e.currentTarget.style.borderColor = "rgba(245,239,230,0.18)";
            }}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          background: "#F5EFE6",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}
