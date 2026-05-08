"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, type ProductRow } from "@/lib/supabase";

export default function AdminOverviewPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProducts(data ?? []);
        setLoading(false);
      });
  }, []);

  const total    = products.length;
  const active   = products.filter((p) => p.active).length;
  const inactive = total - active;

  return (
    <div className="belta-admin-content-pad" style={{ padding: "40px 48px" }}>
      {/* Page heading */}
      <div style={{ marginBottom: "36px" }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8A766A",
            margin: "0 0 8px",
          }}
        >
          Admin
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "40px",
            fontWeight: 600,
            color: "#2C1810",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Overview
        </h1>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "48px",
        }}
      >
        <StatCard label="Total products"  value={loading ? "—" : String(total)}    />
        <StatCard label="Active"          value={loading ? "—" : String(active)}   />
        <StatCard label="Inactive"        value={loading ? "—" : String(inactive)} dim />
      </div>

      {/* ── Products table ───────────────────────────────────────────── */}
      <div
        style={{
          background: "#FBF7F0",
          border: "1px solid #E2D5C3",
          borderRadius: "14px",
          boxShadow: "0 2px 6px rgba(44,24,16,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Table header bar */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #E2D5C3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: 600,
              color: "#2C1810",
              margin: 0,
            }}
          >
            All products
          </h2>
          <AddLink href="/admin/products/new">+ Add product</AddLink>
        </div>

        {loading ? (
          <CellMsg>Loading…</CellMsg>
        ) : error ? (
          <CellMsg danger>{error}</CellMsg>
        ) : products.length === 0 ? (
          <CellMsg>
            {"No products yet. "}
            <Link
              href="/admin/products/new"
              style={{ color: "#8B4513", textDecoration: "underline" }}
            >
              Add the first one →
            </Link>
          </CellMsg>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#EFE7DA" }}>
                {["Name", "Price", "Badge", "Status"].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "11px 24px",
                      textAlign: "start",
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#5A4438",
                      borderBottom: "1px solid #E2D5C3",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr
                  key={p.id}
                  style={{
                    background: i % 2 === 0 ? "#FBF7F0" : "#F5EFE6",
                    borderBottom:
                      i < products.length - 1 ? "1px solid #E2D5C3" : "none",
                  }}
                >
                  <td style={{ padding: "13px 24px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#2C1810",
                      }}
                    >
                      {p.name}
                    </span>
                    {p.name_ar && (
                      <span
                        style={{
                          display: "block",
                          fontFamily: "var(--font-arabic)",
                          fontSize: "12px",
                          color: "#8A766A",
                          direction: "rtl",
                        }}
                      >
                        {p.name_ar}
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "13px 24px",
                      fontFamily: "var(--font-display)",
                      fontSize: "15px",
                      color: "#5A4438",
                    }}
                  >
                    {p.price.startsWith("$") ? p.price : `$${p.price}`}
                  </td>
                  <td style={{ padding: "13px 24px" }}>
                    {p.badge ? (
                      <BadgeChip badge={p.badge} label={p.badge_label} />
                    ) : (
                      <Dash />
                    )}
                  </td>
                  <td style={{ padding: "13px 24px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        background: p.active
                          ? "rgba(126,148,118,0.15)"
                          : "rgba(162,58,38,0.1)",
                        color: p.active ? "#4D6B45" : "#A23A26",
                      }}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  dim,
}: {
  label: string;
  value: string;
  dim?: boolean;
}) {
  return (
    <div
      style={{
        background: "#FBF7F0",
        border: "1px solid #E2D5C3",
        borderRadius: "14px",
        boxShadow: "0 2px 6px rgba(44,24,16,0.06)",
        padding: "24px 28px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "#5A4438",
          margin: "0 0 12px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "48px",
          fontWeight: 600,
          color: dim ? "#8A766A" : "#8B4513",
          margin: 0,
          lineHeight: 1,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function AddLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        fontWeight: 500,
        padding: "8px 16px",
        borderRadius: "8px",
        background: hovered ? "#6E3610" : "#8B4513",
        color: "#F5EFE6",
        textDecoration: "none",
        transition: "background 280ms var(--ease-out)",
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Link>
  );
}

function CellMsg({
  children,
  danger,
}: {
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      style={{
        padding: "56px 24px",
        textAlign: "center",
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        color: danger ? "#A23A26" : "#8A766A",
      }}
    >
      {children}
    </div>
  );
}

function BadgeChip({
  badge,
  label,
}: {
  badge: "new" | "count" | "final";
  label: string | null;
}) {
  const isFinal = badge === "final";
  return (
    <span
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "4px 10px",
        borderRadius: "999px",
        background: isFinal ? "#2C1810" : "#E8C9C1",
        color: isFinal ? "#F5EFE6" : "#6E3610",
      }}
    >
      {label ?? (badge === "new" ? "New" : badge === "final" ? "Final piece" : "")}
    </span>
  );
}

function Dash() {
  return (
    <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#8A766A" }}>
      —
    </span>
  );
}
