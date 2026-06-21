"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";

type Filter = "all" | "silk" | "cotton" | "modal";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all",    label: "All"    },
  { value: "silk",   label: "Silk"   },
  { value: "cotton", label: "Cotton" },
  { value: "modal",  label: "Modal"  },
];

export default function ShopPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = filter === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.materialType === filter);

  return (
    <>
      <AnnouncementBar lang={lang} />
      <Navbar lang={lang} onLangChange={setLang} />

      <main style={{ background: "var(--bg)", minHeight: "70vh" }}>
        <div
          className="belta-page-pad"
          style={{ maxWidth: "var(--container)", margin: "0 auto" }}
        >
          {/* ── Page header ─────────────────────────────────────────────── */}
          <div style={{ marginBottom: "40px" }}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "var(--fs-eyebrow)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-eyebrow)",
                textTransform: "uppercase",
                color: "var(--brand)",
                marginBottom: "12px",
                lineHeight: 1,
              }}
            >
              {lang === "en" ? "The Collection" : "المجموعة"}
            </span>
            <h1
              className="belta-shop-h1"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-h1)",
                fontWeight: 600,
                lineHeight: "var(--lh-tight)",
                letterSpacing: "var(--tracking-tight)",
                color: "var(--fg)",
                margin: 0,
              }}
            >
              {lang === "en" ? "All pieces" : "كل القطع"}
            </h1>
          </div>

          {/* ── Filter chips ─────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "40px", flexWrap: "wrap" }}>
            {FILTERS.map((f) => (
              <FilterChip
                key={f.value}
                label={f.label}
                active={filter === f.value}
                onClick={() => setFilter(f.value)}
              />
            ))}
          </div>

          {/* ── Product grid ─────────────────────────────────────────────── */}
          <div className="belta-shop-grid">
            {visible.map((product) => (
              <ProductCard key={product.name} product={product} lang={lang} />
            ))}
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: "0.02em",
        padding: "7px 14px",
        borderRadius: "var(--radius-pill)",
        border: "1px solid var(--border-strong)",
        background: active
          ? "var(--brand)"
          : hovered
          ? "var(--bg-alt)"
          : "var(--bg-raised)",
        color: active ? "var(--fg-on-brand)" : "var(--fg)",
        cursor: "pointer",
        transition: "background 280ms var(--ease-out), color 280ms var(--ease-out), border-color 280ms var(--ease-out)",
        lineHeight: 1,
        minHeight: "44px",
      }}
    >
      {label}
    </button>
  );
}
