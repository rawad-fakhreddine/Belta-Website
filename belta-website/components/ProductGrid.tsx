"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/lib/products";
import { supabase, type ProductRow } from "@/lib/supabase";
import type { ProductWithFilter } from "@/lib/products";

type Status = "loading" | "ok" | "error";

function mapRow(row: ProductRow): ProductWithFilter {
  return {
    id:           row.id,
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
}

export default function ProductGrid({ lang = "en" }: ProductGridProps) {
  const [products, setProducts] = useState<ProductWithFilter[]>([]);
  const [status, setStatus]     = useState<Status>("loading");
  const [btnHovered, setBtnHovered] = useState(false);
  const isRtl = lang === "ar";
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setStatus("loading");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true })
        .limit(8);

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
            flexDirection: "column",
            gap: "10px",
            marginBottom: "40px",
          }}
        >
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
              ? "Our scarfs collection"
              : "مجموعة وشاحاتنا"}
          </h2>
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
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  lang={lang}
                />
              ))}
        </div>

        {/* ── Shop CTA ─────────────────────────────────────────────────── */}
        {status !== "loading" && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "48px" }}>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: 500,
                letterSpacing: "0.01em",
                padding: "14px 36px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: btnHovered ? "var(--brand-hover)" : "var(--brand)",
                color: "var(--fg-on-brand)",
                cursor: "pointer",
                transition: "background 280ms var(--ease-out)",
                lineHeight: 1,
                minHeight: "44px",
              }}
            >
              {lang === "en" ? "Shop the collection →" : "← تسوّقي المجموعة"}
            </button>
          </div>
        )}
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
