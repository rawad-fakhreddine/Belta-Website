"use client";

import { useState } from "react";
import PhotoZone from "@/components/PhotoZone";
import StyledProductToggle from "@/components/StyledProductToggle";

type ToggleValue = "lifestyle" | "product";

export type BadgeKind = "new" | "count" | "final" | null;

export interface Product {
  name: string;
  material: string;
  price: string;
  badge: BadgeKind;
  badgeLabel?: string;
}

interface ProductCardProps {
  product: Product;
  onOpen?: () => void;
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

export default function ProductCard({ product, onOpen, lang = "en" }: ProductCardProps) {
  const [mode, setMode] = useState<ToggleValue>("lifestyle");
  const [hovered, setHovered] = useState(false);
  const isRtl = lang === "ar";

  return (
    <article
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: onOpen ? "pointer" : "default",
        direction: isRtl ? "rtl" : "ltr",
      }}
    >
      {/* ── Image area ─────────────────────────────────────────────────── */}
      <div
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
        <PhotoZone mode={mode} kind="card" />

        {/* Overlay row: badge start · toggle end — single flex row prevents overlap */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            insetInlineStart: "14px",
            insetInlineEnd: "14px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "8px",
            pointerEvents: "none",
          }}
        >
          {/* Badge */}
          {product.badge ? (
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
                pointerEvents: "auto",
                flexShrink: 0,
              }}
            >
              {product.badgeLabel ?? product.badge}
            </span>
          ) : (
            <span />
          )}

          {/* Toggle */}
          <div
            style={{ pointerEvents: "auto", flexShrink: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <StyledProductToggle
              value={mode}
              onChange={setMode}
              size="sm"
              variant="on-image"
            />
          </div>
        </div>
      </div>

      {/* ── Card info ──────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "16px 4px 0",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <p
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
    </article>
  );
}
