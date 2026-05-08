"use client";

import { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoZone from "@/components/PhotoZone";

export default function AboutPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const isRtl = lang === "ar";

  return (
    <>
      <AnnouncementBar lang={lang} />
      <Navbar lang={lang} onLangChange={setLang} />

      <main style={{ background: "var(--bg)", minHeight: "70vh" }}>
        <div
          className="belta-page-pad"
          style={{ maxWidth: "var(--container)", margin: "0 auto", direction: isRtl ? "rtl" : "ltr" }}
        >
          <div className="belta-two-col">
            {/* ── Photo placeholder ───────────────────────────────────── */}
            <div
              className="belta-about-photo"
              style={{
                width: "100%",
                aspectRatio: "4 / 5",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <PhotoZone mode="lifestyle" kind="hero" />
            </div>

            {/* ── Brand story ─────────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
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
                {lang === "en" ? "About Beltà" : "عن بيلتا"}
              </span>

              <h1
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
                  ? "Not All Scarves Are Created Equal"
                  : "ليست كل الأوشحة سواء"}
              </h1>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--fs-lead)",
                  lineHeight: "var(--lh-relaxed)",
                  color: "var(--fg-muted)",
                  margin: 0,
                }}
              >
                {lang === "en"
                  ? "Beltà is a Lebanese artisan scarf house. Each piece is designed with an interior eye — drawn in Beirut, woven with care, and released in limited numbers. When a piece is gone, it is gone."
                  : "بيلتا دار وشاح لبنانية حرفية. تُصمَّم كل قطعة بعين داخلية — مرسومة في بيروت، منسوجة باعتناء، وتُطلَق بأعداد محدودة. حين تنتهي القطعة، لن تعود."}
              </p>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--fs-body)",
                  lineHeight: "var(--lh-relaxed)",
                  color: "var(--fg-subtle)",
                  margin: 0,
                }}
              >
                {lang === "en"
                  ? "Every design begins as a drawing. We work with a small circle of weavers who understand that precision and poetry are not opposites. The result is a scarf that carries a story inside its threads."
                  : "تبدأ كل تصميماتنا كرسم. نعمل مع حلقة صغيرة من النساجين الذين يدركون أن الدقة والشعر ليسا ضدين. والنتيجة وشاح يحمل حكاية بين خيوطه."}
              </p>

              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--fs-eyebrow)",
                  fontWeight: 500,
                  letterSpacing: "var(--tracking-eyebrow)",
                  textTransform: "uppercase",
                  color: "var(--brand)",
                  lineHeight: 1,
                  paddingTop: "8px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                Artisan Scarfs · Lebanon
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
