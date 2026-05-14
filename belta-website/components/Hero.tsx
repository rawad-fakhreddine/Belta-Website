"use client";

import PhotoZone from "@/components/PhotoZone";

type Lang = "en" | "ar";

interface HeroProps {
  lang?: Lang;
}

export default function Hero({ lang = "en" }: HeroProps) {
  const isRtl = lang === "ar";

  return (
    <section style={{ background: "var(--brand)", width: "100%" }}>
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
              color: "var(--belta-blush)",
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
              color: "var(--fg-on-dark)",
              margin: 0,
            }}
          >
            {lang === "en" ? (
              <>
                A scarf for the long{" "}
                <em style={{ fontStyle: "italic", color: "var(--belta-blush)" }}>afternoons</em>
              </>
            ) : (
              <>
                وشاح لأجمل{" "}
                <em style={{ fontStyle: "italic", color: "var(--belta-blush)" }}>اللحظات</em>
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
              color: "rgba(245, 239, 230, 0.72)",
              maxWidth: "460px",
              margin: 0,
            }}
          >
            {lang === "en"
              ? "Cut, drawn and printed in Beirut. Only forty-two of these will ever exist."
              : "مقطوع ومرسوم ومطبوع في بيروت. اثنان وأربعون قطعة فقط، لن تتكرر."}
          </p>

        </div>

        {/* ── Photo zones ───────────────────────────────────────────────── */}
        <div
          className="belta-hero-photos"
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Primary: 4/5 */}
          <div
            className="belta-hero-photo-primary"
            style={{
              width: "100%",
              aspectRatio: "4 / 5",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            <PhotoZone />
          </div>

          {/* Secondary: 16/9 */}
          <div
            className="belta-hero-photo-secondary"
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            <PhotoZone />
          </div>
        </div>
      </div>
    </section>
  );
}

