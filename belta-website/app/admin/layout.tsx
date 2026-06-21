"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Package, Mail, Send, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const NAV = [
  { label: "Overview",    href: "/admin",             icon: Home    },
  { label: "Products",    href: "/admin/products",    icon: Package },
  { label: "Subscribers", href: "/admin/subscribers", icon: Mail    },
  { label: "Campaigns",   href: "/admin/campaigns",   icon: Send    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  const sidebarContent = (
    <>
      {/* Wordmark */}
      <div style={{ padding: "28px 24px 22px" }}>
        <Link
          href="/admin"
          onClick={closeSidebar}
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
              onClick={closeSidebar}
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
                minHeight: "44px",
                borderInlineStart: active
                  ? "2px solid #8B4513"
                  : "2px solid transparent",
                transition: "color 180ms var(--ease-out), border-color 180ms var(--ease-out)",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.color = "rgba(245,239,230,0.85)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.color = "rgba(245,239,230,0.55)";
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
            transition: "color 180ms var(--ease-out), border-color 180ms var(--ease-out)",
            textAlign: "start",
            minHeight: "44px",
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
    </>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* ── Mobile overlay backdrop ───────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="belta-admin-topbar"
          onClick={closeSidebar}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 55,
            background: "rgba(44,24,16,0.5)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className={`belta-admin-sidebar${sidebarOpen ? " belta-admin-sidebar-open" : ""}`}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Mobile close button inside sidebar */}
        <button
          className="belta-admin-topbar"
          onClick={closeSidebar}
          aria-label="Close menu"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            color: "rgba(245,239,230,0.55)",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "var(--radius-sm)",
            minWidth: "44px",
            minHeight: "44px",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {sidebarContent}
      </aside>

      {/* ── Main content area ─────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          background: "#F5EFE6",
          minHeight: "100vh",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Mobile top bar */}
        <div
          className="belta-admin-topbar"
          style={{
            height: "56px",
            background: "#2C1810",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            style={{
              background: "none",
              border: "none",
              color: "rgba(245,239,230,0.85)",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "var(--radius-sm)",
              minWidth: "44px",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontWeight: 500,
              color: "#8B4513",
              letterSpacing: "-0.01em",
            }}
          >
            Beltà
          </span>

          <div style={{ width: "44px" }} />
        </div>

        <div style={{ flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
