"use client";

import { useState } from "react";
import Link from "next/link";
import PhotoZone from "@/components/PhotoZone";

export type BadgeKind = "new" | "count" | "final" | null;

export interface Product {
  id?: number | string;
  name: string;
  material: string;
  price: string;
  badge: BadgeKind;
  badgeLabel?: string;
}

interface ProductCardProps {
  product: Product;
  lang?: "en" | "ar";
}

const BADGE_STYLES: Record<
  Exclude<BadgeKind, null>,
  { background: string; color: string }
> = {
  new: {
    background: "var(--belta-blush)",
    color: "var(--belta-terracotta-deep)",
  },
  count: {
    background: "var(--belta-sage-soft)",
    color: "#3F5238",
  },
  final: {
    background: "var(--belta-brown)",
    color: "var(--fg-on-dark)",
  },
};

export default function ProductCard({ product, lang = "en" }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const isRtl = lang === "ar";
  const href = product.id ? `/products/${product.id}` : "#";

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="belta-product-card"
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        direction: isRtl ? "rtl" : "ltr",
      }}
    >
      {/* ── Image area ─────────────────────────────────────────────────── */}
      <div
        className="belta-product-card-image"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 5",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: "var(--surface)",
          boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-sm)",
          transition: "box-shadow 280ms var(--ease-out)",
        }}
      >
        <PhotoZone />

        {/* Badge */}
        {product.badge && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              insetInlineStart: "14px",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                ...BADGE_STYLES[product.badge],
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "5px 10px",
                borderRadius: "999px",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {product.badgeLabel ?? product.badge}
            </span>
          </div>
        )}
      </div>

      {/* ── Card info ──────────────────────────────────────────────────── */}
      <div
        className="belta-card-info"
        style={{
          padding: "16px 4px 0",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <p
          className="belta-card-name"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            fontWeight: 500,
            color: "var(--fg)",
            margin: 0,
            lineHeight: "var(--lh-snug)",
          }}
        >
          {product.name}
        </p>
        <p
          className="belta-card-material"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--fg-subtle)",
            letterSpacing: "0.04em",
            margin: 0,
            lineHeight: "var(--lh-normal)",
          }}
        >
          {product.material}
        </p>
        <p
          className="belta-card-price"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 400,
            color: "var(--fg)",
            margin: "4px 0 0",
            lineHeight: "var(--lh-snug)",
          }}
        >
          {product.price}
        </p>
      </div>
    </Link>
  );
}
