"use client";

import { useState } from "react";

const TILES = [
  { bg: "#E8C9C1", labelColor: "#5A4438", frameColor: "rgba(44,24,16,0.18)" },
  { bg: "#C99680", labelColor: "rgba(245,239,230,0.92)", frameColor: "rgba(245,239,230,0.38)" },
  { bg: "#8B4513", labelColor: "rgba(245,239,230,0.92)", frameColor: "rgba(245,239,230,0.38)" },
  { bg: "#B5C4B1", labelColor: "#5A4438", frameColor: "rgba(44,24,16,0.18)" },
  { bg: "#EFE7DA", labelColor: "#5A4438", frameColor: "rgba(44,24,16,0.18)" },
  { bg: "#6E3610", labelColor: "rgba(245,239,230,0.92)", frameColor: "rgba(245,239,230,0.38)" },
] as const;

interface InstagramFeedProps {
  lang?: "en" | "ar";
}

export default function InstagramFeed({ lang = "en" }: InstagramFeedProps) {
  return (
    <section style={{ background: "var(--bg)", width: "100%" }}>
      <div
        className="belta-ig-section-pad"
        style={{ maxWidth: "var(--container)", margin: "0 auto" }}
      >
        {/* ── Centered header ──────────────────────────────────────────── */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "center",
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
            {lang === "en" ? "@belta.scarfs · Instagram" : "@belta.scarfs · إنستغرام"}
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
            {lang === "en" ? "Follow us on Instagram" : "تابعينا على إنستغرام"}
          </h2>
        </div>

        {/* ── Tile grid (3×2 desktop/tablet, 2×3 mobile) ───────────────── */}
        <div className="belta-ig-grid" style={{ marginBottom: "40px" }}>
          {TILES.map((tile, i) => (
            <Tile
              key={i}
              index={i + 1}
              bg={tile.bg}
              labelColor={tile.labelColor}
              frameColor={tile.frameColor}
            />
          ))}
        </div>

        {/* ── CTA button ───────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PrimaryButton>
            {lang === "en" ? "Follow on Instagram ↗" : "تابعينا على إنستغرام ↗"}
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

function Tile({
  index,
  bg,
  labelColor,
  frameColor,
}: {
  index: number;
  bg: string;
  labelColor: string;
  frameColor: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        borderRadius: "4px",
        background: bg,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-sm)",
        transition: "box-shadow 280ms var(--ease-out)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "14px",
          border: `1px dashed ${frameColor}`,
          borderRadius: "2px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: labelColor,
          }}
        >
          {`POST 0${index}`}
        </span>
      </div>
    </div>
  );
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
