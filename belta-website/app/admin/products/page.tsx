"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, type ProductRow } from "@/lib/supabase";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) setError(error.message);
    else setProducts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleToggle = async (p: ProductRow) => {
    setToggling(p.id);
    setProducts((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x))
    );
    await supabase.from("products").update({ active: !p.active }).eq("id", p.id);
    setToggling(null);
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !window.confirm(
        `Delete "${name}" from products? This cannot be undone.`
      )
    )
      return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="belta-admin-content-pad" style={{ padding: "40px 48px" }}>
      {/* ── Top bar ────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "36px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: 600,
            color: "#2C1810",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Products
        </h1>
        <PrimaryLink href="/admin/products/new">+ Add product</PrimaryLink>
      </div>

      {/* ── Table card ──────────────────────────────────────────────── */}
      <div
        style={{
          background: "#FBF7F0",
          border: "1px solid #E2D5C3",
          borderRadius: "14px",
          boxShadow: "0 2px 6px rgba(44,24,16,0.06)",
          overflow: "hidden",
        }}
      >
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
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#EFE7DA" }}>
                  {["Name", "Material", "Price", "Badge", "Active", ""].map(
                    (col, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "11px 20px",
                          textAlign: "start",
                          fontFamily: "var(--font-body)",
                          fontSize: "11px",
                          fontWeight: 500,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#5A4438",
                          borderBottom: "1px solid #E2D5C3",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{
                      background: i % 2 === 0 ? "#FBF7F0" : "#F5EFE6",
                      borderBottom:
                        i < products.length - 1
                          ? "1px solid #E2D5C3"
                          : "none",
                    }}
                  >
                    {/* Name */}
                    <td style={{ padding: "13px 20px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "#2C1810",
                          display: "block",
                        }}
                      >
                        {p.name}
                      </span>
                      {p.name_ar && (
                        <span
                          style={{
                            fontFamily: "var(--font-arabic)",
                            fontSize: "12px",
                            color: "#8A766A",
                            display: "block",
                            direction: "rtl",
                          }}
                        >
                          {p.name_ar}
                        </span>
                      )}
                    </td>

                    {/* Material */}
                    <td style={{ padding: "13px 20px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "13px",
                          color: "#5A4438",
                          display: "block",
                        }}
                      >
                        {p.material}
                      </span>
                      {p.material_ar && (
                        <span
                          style={{
                            fontFamily: "var(--font-arabic)",
                            fontSize: "12px",
                            color: "#8A766A",
                            display: "block",
                            direction: "rtl",
                          }}
                        >
                          {p.material_ar}
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td
                      style={{
                        padding: "13px 20px",
                        fontFamily: "var(--font-display)",
                        fontSize: "15px",
                        color: "#2C1810",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.price.startsWith("$") ? p.price : `$${p.price}`}
                    </td>

                    {/* Badge */}
                    <td style={{ padding: "13px 20px" }}>
                      {p.badge ? (
                        <BadgeChip badge={p.badge} label={p.badge_label} />
                      ) : (
                        <Dash />
                      )}
                    </td>

                    {/* Active toggle */}
                    <td style={{ padding: "13px 20px" }}>
                      <button
                        onClick={() => handleToggle(p)}
                        disabled={toggling === p.id}
                        aria-label={p.active ? "Deactivate" : "Activate"}
                        style={{
                          position: "relative",
                          width: "40px",
                          height: "22px",
                          borderRadius: "999px",
                          border: "none",
                          cursor: toggling === p.id ? "wait" : "pointer",
                          background: p.active ? "#7E9476" : "#C9B8A3",
                          transition: "background 220ms var(--ease-out)",
                          opacity: toggling === p.id ? 0.6 : 1,
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: "3px",
                            left: "3px",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            background: "#F5EFE6",
                            boxShadow: "0 1px 3px rgba(44,24,16,0.2)",
                            transition: "transform 220ms var(--ease-out)",
                            transform: p.active
                              ? "translateX(18px)"
                              : "translateX(0)",
                          }}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "13px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <EditLink id={p.id} />
                        <DeleteButton
                          onClick={() => handleDelete(p.id, p.name)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────────── */

function PrimaryLink({
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
        padding: "10px 20px",
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
        padding: "64px 24px",
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
        whiteSpace: "nowrap",
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

function EditLink({ id }: { id: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/admin/products/${id}/edit`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "12px",
        fontWeight: 500,
        padding: "6px 12px",
        borderRadius: "8px",
        border: hovered ? "1px solid #2C1810" : "1px solid #C9B8A3",
        background: "#FBF7F0",
        color: hovered ? "#2C1810" : "#5A4438",
        textDecoration: "none",
        transition:
          "color 180ms var(--ease-out), border-color 180ms var(--ease-out)",
        whiteSpace: "nowrap",
      }}
    >
      Edit
    </Link>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "12px",
        fontWeight: 500,
        padding: "6px 12px",
        borderRadius: "8px",
        border: hovered
          ? "1px solid rgba(162,58,38,0.55)"
          : "1px solid rgba(162,58,38,0.3)",
        background: hovered ? "rgba(162,58,38,0.12)" : "rgba(162,58,38,0.06)",
        color: "#A23A26",
        cursor: "pointer",
        transition:
          "background 180ms var(--ease-out), border-color 180ms var(--ease-out)",
        whiteSpace: "nowrap",
      }}
    >
      Delete
    </button>
  );
}
