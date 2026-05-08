"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "en" | "ar";
  bagCount?: number;
}

export default function CartPanel({
  isOpen,
  onClose,
  lang = "en",
  bagCount = 0,
}: CartPanelProps) {
  const isRtl = lang === "ar";
  // In RTL the panel slides from left; in LTR from right
  const closedTransform = isRtl ? "translateX(-100%)" : "translateX(100%)";

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(44, 24, 16, 0.28)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 280ms var(--ease-out)",
          zIndex: 99,
        }}
      />

      {/* Slide-over panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={lang === "en" ? "Your bag" : "حقيبتك"}
        style={{
          position: "fixed",
          top: 0,
          insetInlineEnd: 0,
          width: "min(400px, 100vw)",
          height: "100dvh",
          background: "var(--bg)",
          borderInlineStart: "1px solid var(--border)",
          boxShadow: "var(--shadow-xl)",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
          transform: isOpen ? "translateX(0)" : closedTransform,
          transition: "transform 280ms var(--ease-out)",
        }}
        // Prevent clicks inside the panel from hitting the backdrop
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 28px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              fontWeight: 500,
              color: "var(--fg)",
              lineHeight: 1,
            }}
          >
            {lang === "en" ? "Your bag" : "حقيبتك"}
          </span>

          <button
            onClick={onClose}
            aria-label="Close cart"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              padding: "6px",
              cursor: "pointer",
              color: "var(--fg-subtle)",
              borderRadius: "var(--radius-sm)",
              transition: "color 280ms var(--ease-out)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--fg)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--fg-subtle)")
            }
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: bagCount === 0 ? "center" : "flex-start",
            padding: "32px 28px",
          }}
        >
          {bagCount === 0 ? (
            <EmptyCart lang={lang} onClose={onClose} />
          ) : null}
        </div>
      </div>
    </>
  );
}

function EmptyCart({
  lang,
  onClose,
}: {
  lang: "en" | "ar";
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        textAlign: "center",
        maxWidth: "260px",
      }}
    >
      <ShoppingBag
        size={36}
        strokeWidth={1.25}
        style={{ color: "var(--fg-subtle)" }}
      />

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          color: "var(--fg-muted)",
          margin: 0,
          lineHeight: "var(--lh-normal)",
        }}
      >
        {lang === "en" ? "Your bag is empty" : "حقيبتك فارغة"}
      </p>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "var(--fg-subtle)",
          margin: 0,
          lineHeight: "var(--lh-relaxed)",
        }}
      >
        {lang === "en"
          ? "Add a piece to get started."
          : "أضيفي قطعة للبدء."}
      </p>

      <Link
        href="/shop"
        onClick={onClose}
        style={{ marginTop: "8px" }}
      >
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.01em",
            padding: "12px 24px",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: hovered ? "var(--brand-hover)" : "var(--brand)",
            color: "var(--fg-on-brand)",
            cursor: "pointer",
            transition: "background 280ms var(--ease-out)",
            lineHeight: 1,
          }}
        >
          {lang === "en" ? "Shop the season" : "تسوّقي الموسم"}
        </button>
      </Link>
    </div>
  );
}
