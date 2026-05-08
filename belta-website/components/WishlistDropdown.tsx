"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

interface WishlistDropdownProps {
  isOpen: boolean;
  lang?: "en" | "ar";
}

export default function WishlistDropdown({ isOpen, lang = "en" }: WishlistDropdownProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        insetInlineEnd: 0,
        width: "240px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        padding: "28px 20px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        zIndex: 10,
        // Visibility animation
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(-6px)",
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 220ms var(--ease-out), transform 220ms var(--ease-out)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Icon */}
      <Heart
        size={28}
        strokeWidth={1.25}
        style={{ color: "var(--fg-subtle)" }}
      />

      {/* Empty state message */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--fg-subtle)",
          margin: 0,
          textAlign: "center",
          lineHeight: "var(--lh-normal)",
        }}
      >
        {lang === "en" ? "Your wishlist is empty" : "قائمة أمنياتك فارغة"}
      </p>

      {/* Shop link */}
      <Link
        href="/shop"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--brand)",
          textDecoration: "none",
          marginTop: "4px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.textDecoration = "underline";
          (e.currentTarget as HTMLElement).style.color = "var(--brand-hover)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.textDecoration = "none";
          (e.currentTarget as HTMLElement).style.color = "var(--brand)";
        }}
      >
        {lang === "en" ? "Shop the collection →" : "← تسوّقي المجموعة"}
      </Link>
    </div>
  );
}
