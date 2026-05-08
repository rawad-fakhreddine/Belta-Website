"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/lib/products";
import { supabase, type ProductRow } from "@/lib/supabase";
import type { ProductWithFilter } from "@/lib/products";

type Status = "loading" | "ok" | "error";

function mapRow(row: ProductRow): ProductWithFilter {
  return {
    name:         row.name,
    material:     row.material,
    price:        row.price,
    badge:        row.badge,
    badgeLabel:   row.badge_label ?? undefined,
    materialType: row.material_type,
  };
}

interface ProductGridProps {
  lang?: "en" | "ar";
  onOpenProduct?: (index: number) => void;
}

export default function ProductGrid({ lang = "en", onOpenProduct }: ProductGridProps) {
  const [products, setProducts] = useState<ProductWithFilter[]>([]);
  const [status, setStatus]     = useState<Status>("loading");
  const [linkHovered, setLinkHovered] = useState(false);
  const isRtl = lang === "ar";

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setStatus("loading");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("[ProductGrid] Supabase error:", error.message);
        setProducts(FALLBACK_PRODUCTS);
        setStatus("error");
        return;
      }

      if (!data || data.length === 0) {
        setProducts(FALLBACK_PRODUCTS);
        setStatus("ok");
        return;
      }

      setProducts((data as ProductRow[]).map(mapRow));
      setStatus("ok");
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  return (
    <section style={{ background: "var(--bg)", width: "100%" }}>
      <div
        className="belta-section-pad-lg"
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        {/* ── Section header ──────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "40px",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--fs-eyebrow)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-eyebrow)",
                textTransform: "uppercase",
                color: "var(--brand)",
                lineHeight: 1,
              }}
            >
              {lang === "en" ? "New this season" : "جديد هذا الموسم"}
            </span>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--fs-h2)",
                fontWeight: 600,
                lineHeight: "var(--lh-snug)",
                letterSpacing: "var(--tracking-tight)",
                color: "var(--fg)",
                margin: 0,
              }}
            >
              {lang === "en"
                ? "Four pieces for a long spring"
                : "أربع قطع لربيع طويل"}
            </h2>
          </div>

          <Link
            href="/shop"
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 500,
              color: linkHovered ? "var(--brand-hover)" : "var(--brand)",
              textDecoration: linkHovered ? "underline" : "none",
              textUnderlineOffset: "3px",
              transition: "color 280ms var(--ease-out)",
              whiteSpace: "nowrap",
              flexShrink: 0,
              paddingBottom: "6px",
            }}
          >
            {lang === "en" ? "View all pieces →" : "← عرض كل القطع"}
          </Link>
        </div>

        {/* ── Error notice ─────────────────────────────────────────────── */}
        {status === "error" && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--fs-small)",
              color: "var(--fg-subtle)",
              margin: "0 0 24px",
            }}
          >
            {lang === "en"
              ? "Could not reach the catalogue — showing preview."
              : "تعذّر الوصول إلى الكتالوج — عرض مسبق."}
          </p>
        )}

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <div className="belta-product-grid">
          {status === "loading"
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product, i) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  lang={lang}
                  onOpen={onOpenProduct ? () => onOpenProduct(i) : undefined}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Skeleton card ───────────────────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div>
      <div
        className="belta-skeleton-card-image"
        style={{
          width: "100%",
          aspectRatio: "4 / 5",
          borderRadius: "var(--radius-lg)",
          background: "var(--belta-cream-deep)",
          animation: "belta-pulse 1.6s ease-in-out infinite",
        }}
      />
      <div style={{ padding: "16px 4px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ height: "22px", width: "60%", borderRadius: "var(--radius-sm)", background: "var(--belta-cream-deep)", animation: "belta-pulse 1.6s ease-in-out infinite" }} />
        <div style={{ height: "14px", width: "80%", borderRadius: "var(--radius-sm)", background: "var(--belta-cream-deep)", animation: "belta-pulse 1.6s ease-in-out infinite 0.1s" }} />
        <div style={{ height: "16px", width: "30%", borderRadius: "var(--radius-sm)", background: "var(--belta-cream-deep)", animation: "belta-pulse 1.6s ease-in-out infinite 0.2s" }} />
      </div>
    </div>
  );
}
