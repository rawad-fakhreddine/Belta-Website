"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "en" | "ar";
}

export default function CartPanel({ isOpen, onClose, lang = "en" }: CartPanelProps) {
  const { items, totalCount, removeItem, updateQuantity } = useCart();
  const isRtl = lang === "ar";
  const closedTransform = isRtl ? "translateX(-100%)" : "translateX(100%)";

  return (
    <>
      {/* Backdrop */}
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
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: 0,
          insetInlineEnd: 0,
          width: "min(420px, 100vw)",
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
      >
        {/* Header */}
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
            {totalCount > 0 && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "var(--fg-subtle)",
                  marginInlineStart: "10px",
                  fontWeight: 400,
                }}
              >
                ({totalCount})
              </span>
            )}
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
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--fg)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--fg-subtle)")}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {totalCount === 0 ? (
            <EmptyCart lang={lang} onClose={onClose} />
          ) : (
            <div style={{ padding: "12px 28px", display: "flex", flexDirection: "column", gap: "0" }}>
              {items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  lang={lang}
                  onRemove={() => removeItem(item.productId)}
                  onQtyChange={(q) => updateQuantity(item.productId, q)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer — summary + CTA */}
        {totalCount > 0 && (
          <CartFooter items={items} lang={lang} onClose={onClose} />
        )}
      </div>
    </>
  );
}

/* ─── Cart item row ───────────────────────────────────────────────────────── */

function CartItemRow({
  item,
  lang,
  onRemove,
  onQtyChange,
}: {
  item: import("@/lib/cart").CartItem;
  lang: "en" | "ar";
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
        padding: "20px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          width: "72px",
          height: "90px",
          borderRadius: "var(--radius-md)",
          background: "var(--surface-soft)",
          flexShrink: 0,
        }}
      />

      {/* Details */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--fg)",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {lang === "ar" && item.name_ar ? item.name_ar : item.name}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--fg-subtle)",
            margin: 0,
            letterSpacing: "0.03em",
          }}
        >
          {item.material}
        </p>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            color: "var(--fg)",
            margin: "2px 0 0",
          }}
        >
          {item.price}
        </p>

        {/* Quantity controls */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0",
            marginTop: "8px",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            width: "fit-content",
          }}
        >
          <QtyButton onClick={() => onQtyChange(item.quantity - 1)} aria="Decrease">
            <Minus size={12} strokeWidth={2} />
          </QtyButton>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--fg)",
              minWidth: "32px",
              textAlign: "center",
              padding: "0 4px",
            }}
          >
            {item.quantity}
          </span>
          <QtyButton onClick={() => onQtyChange(item.quantity + 1)} aria="Increase">
            <Plus size={12} strokeWidth={2} />
          </QtyButton>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        aria-label="Remove item"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--fg-subtle)",
          padding: "4px",
          borderRadius: "var(--radius-sm)",
          transition: "color 180ms var(--ease-out)",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--danger)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--fg-subtle)")}
      >
        <Trash2 size={15} strokeWidth={1.5} />
      </button>
    </div>
  );
}

function QtyButton({
  onClick,
  aria,
  children,
}: {
  onClick: () => void;
  aria: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={aria}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--fg-muted)",
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "color 180ms var(--ease-out), background 180ms var(--ease-out)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--bg-alt)";
        (e.currentTarget as HTMLElement).style.color = "var(--fg)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "none";
        (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)";
      }}
    >
      {children}
    </button>
  );
}

/* ─── Cart footer ─────────────────────────────────────────────────────────── */

function CartFooter({
  items,
  lang,
  onClose,
}: {
  items: import("@/lib/cart").CartItem[];
  lang: "en" | "ar";
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const waMessage = lang === "en"
    ? `Hi! I'd like to order the following from Beltà:\n\n${items.map(
        (i) => `- ${i.name} × ${i.quantity} (${i.price})`
      ).join("\n")}`
    : `مرحبا! أريد طلب ما يلي من Beltà:\n\n${items.map(
        (i) => `- ${i.name_ar ?? i.name} × ${i.quantity} (${i.price})`
      ).join("\n")}`;

  return (
    <div
      style={{
        padding: "20px 28px 28px",
        borderTop: "1px solid var(--border)",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: "var(--bg)",
      }}
    >
      {/* WhatsApp CTA */}
      <a
        href={`https://wa.me/96170000000?text=${encodeURIComponent(waMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          fontWeight: 500,
          letterSpacing: "0.01em",
          padding: "14px 20px",
          borderRadius: "var(--radius-md)",
          background: hovered ? "var(--brand-hover)" : "var(--brand)",
          color: "var(--fg-on-brand)",
          textDecoration: "none",
          transition: "background 280ms var(--ease-out)",
          lineHeight: 1,
          minHeight: "50px",
        }}
      >
        <WhatsAppIcon />
        {lang === "en" ? "Order via WhatsApp" : "اطلبي عبر واتساب"}
      </a>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          color: "var(--fg-subtle)",
          margin: 0,
          textAlign: "center",
          lineHeight: "var(--lh-relaxed)",
          letterSpacing: "0.02em",
        }}
      >
        {lang === "en"
          ? "Free shipping within Lebanon · Limited pieces"
          : "شحن مجاني داخل لبنان · طبعات محدودة"}
      </p>
    </div>
  );
}

/* ─── Empty state ─────────────────────────────────────────────────────────── */

function EmptyCart({ lang, onClose }: { lang: "en" | "ar"; onClose: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        textAlign: "center",
        padding: "40px 28px",
        maxWidth: "260px",
        margin: "0 auto",
      }}
    >
      <ShoppingBag size={36} strokeWidth={1.25} style={{ color: "var(--fg-subtle)" }} />
      <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--fg-muted)", margin: 0 }}>
        {lang === "en" ? "Your bag is empty" : "حقيبتك فارغة"}
      </p>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--fg-subtle)", margin: 0, lineHeight: "var(--lh-relaxed)" }}>
        {lang === "en" ? "Browse the collection to find your piece." : "تصفّحي المجموعة لتجدي قطعتك."}
      </p>
      <Link href="/shop" onClick={onClose} style={{ marginTop: "8px" }}>
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 500,
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

/* ─── WhatsApp icon ───────────────────────────────────────────────────────── */

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );
}
