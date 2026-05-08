"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhotoZone from "@/components/PhotoZone";
import StyledProductToggle from "@/components/StyledProductToggle";

type Lang = "en" | "ar";
type ToggleValue = "lifestyle" | "product";

interface HeroProps {
  lang?: Lang;
  onShop?: () => void;
}

export default function Hero({ lang = "en", onShop }: HeroProps) {
  const [photoMode, setPhotoMode] = useState<ToggleValue>("lifestyle");
  const secondaryMode: ToggleValue = photoMode === "lifestyle" ? "product" : "lifestyle";
  const isRtl = lang === "ar";
  const router = useRouter();

  return (
    <section style={{ background: "var(--bg)", width: "100%" }}>
      <div
        className="belta-hero-inner"
        style={{ direction: isRtl ? "rtl" : "ltr", maxWidth: "var(--container)", margin: "0 auto" }}
      >
        {/* ── Text content ──────────────────────────────────────────────── */}
        <div
          className="belta-hero-text"
          style={{ display: "flex", flexDirection: "column", gap: "28px" }}
        >
          {/* Eyebrow */}
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
            {lang === "en" ? "New this season · Spring" : "موسم الربيع · جديدنا"}
          </span>

          {/* Headline */}
          <h1
            className="belta-hero-headline"
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
            {lang === "en" ? (
              <>
                A scarf for the long{" "}
                <em style={{ fontStyle: "italic", color: "var(--brand)" }}>afternoons</em>
              </>
            ) : (
              <>
                وشاح لأجمل{" "}
                <em style={{ fontStyle: "italic", color: "var(--brand)" }}>اللحظات</em>
              </>
            )}
          </h1>

          {/* Lead paragraph */}
          <p
            className="belta-hero-lead"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              lineHeight: "var(--lh-relaxed)",
              color: "var(--fg-muted)",
              maxWidth: "460px",
              margin: 0,
            }}
          >
            {lang === "en"
              ? "Cut, drawn and printed in Beirut. Only forty-two of these will ever exist."
              : "مقطوع ومرسوم ومطبوع في بيروت. اثنان وأربعون قطعة فقط، لن تتكرر."}
          </p>

          {/* Buttons */}
          <div
            className="belta-hero-buttons"
            style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}
          >
            <PrimaryButton onClick={() => router.push("/shop")} fullWidthClass>
              {lang === "en" ? "Shop the season" : "تسوّقي الموسم"}
            </PrimaryButton>
            <GhostButton onClick={() => router.push("/shop")} fullWidthClass>
              {lang === "en" ? "From the atelier →" : "← من المشغل"}
            </GhostButton>
          </div>
        </div>

        {/* ── Photo zones ───────────────────────────────────────────────── */}
        <div
          className="belta-hero-photos"
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Primary: 4/5 with toggle overlay */}
          <div
            className="belta-hero-photo-primary"
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4 / 5",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            <PhotoZone mode={photoMode} kind="hero" />
            <div style={{ position: "absolute", top: "14px", insetInlineEnd: "14px" }}>
              <StyledProductToggle value={photoMode} onChange={setPhotoMode} variant="on-image" />
            </div>
          </div>

          {/* Secondary: 16/9 showing opposite mode */}
          <div
            className="belta-hero-photo-secondary"
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            <PhotoZone mode={secondaryMode} kind="secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Button sub-components ──────────────────────────────────────────────── */

function PrimaryButton({
  children,
  onClick,
  fullWidthClass,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidthClass?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={fullWidthClass ? "belta-hero-btn" : ""}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "15px",
        fontWeight: 500,
        letterSpacing: "0.01em",
        padding: "14px 26px",
        borderRadius: "var(--radius-md)",
        border: "none",
        background: hovered ? "var(--brand-hover)" : "var(--brand)",
        color: "var(--fg-on-brand)",
        cursor: "pointer",
        transition: "background 280ms var(--ease-out)",
        lineHeight: 1,
        minHeight: "44px",
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  fullWidthClass,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidthClass?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={fullWidthClass ? "belta-hero-btn" : ""}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "15px",
        fontWeight: 500,
        letterSpacing: "0.01em",
        padding: "14px 0",
        borderRadius: 0,
        border: "none",
        background: "transparent",
        color: hovered ? "var(--brand-hover)" : "var(--brand)",
        cursor: "pointer",
        transition: "color 280ms var(--ease-out)",
        textDecoration: hovered ? "underline" : "none",
        textUnderlineOffset: "3px",
        lineHeight: 1,
        minHeight: "44px",
      }}
    >
      {children}
    </button>
  );
}
