"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoZone from "@/components/PhotoZone";

type Lang = "en" | "ar";

const MILESTONES = {
  en: [
    {
      year: "2018",
      heading: "Born in Beirut",
      body: "Beltà began in a small atelier tucked into a quiet Beirut street. A designer, a bolt of silk, and an idea — that a scarf could carry the feeling of a city. The first twelve pieces sold before they were photographed.",
    },
    {
      year: "2019",
      heading: "Every thread matters",
      body: "We work only with artisans who understand the weight of a deadline and the patience of a woven edge. Each scarf passes through eight pairs of hands before it reaches yours. There are no shortcuts in this house.",
    },
    {
      year: "2021",
      heading: "First silk collection",
      body: "Twelve pieces, released quietly. Sold before they were photographed. We knew then that the work had its own gravity — and that gravity was the only marketing we would ever need.",
    },
    {
      year: "2023",
      heading: "Limited. Always.",
      body: "We release new designs in editions of forty-two or fewer. Not because we cannot make more, but because scarcity is respect — for the maker, for the material, and for the person who wears it.",
    },
  ],
  ar: [
    {
      year: "٢٠١٨",
      heading: "وُلدت في بيروت",
      body: "بدأت بيلتا في محترف صغير يختبئ في شارع هادئ ببيروت. مصمِّمة، قطعة حرير، وفكرة — أن الوشاح يمكن أن يحمل شعور مدينة. القطع الاثنتا عشرة الأولى بيعت قبل أن تُصوَّر.",
    },
    {
      year: "٢٠١٩",
      heading: "كل خيط مهم",
      body: "نعمل فقط مع حرفيين يفهمون ثقل الموعد النهائي وصبر الحافة المنسوجة. يمر كل وشاح بثمانية أزواج من الأيدي قبل أن يصل إليك. لا اختصارات في هذا البيت.",
    },
    {
      year: "٢٠٢١",
      heading: "أول مجموعة حرير",
      body: "اثنتا عشرة قطعة، أُطلقت بهدوء. بيعت قبل أن تُصوَّر. عرفنا حينها أن العمل يملك ثقله الخاص — وأن هذا الثقل هو التسويق الوحيد الذي سنحتاجه.",
    },
    {
      year: "٢٠٢٣",
      heading: "محدود. دائماً.",
      body: "نطلق تصاميم جديدة بإصدارات لا تتجاوز اثنين وأربعين قطعة. ليس لأننا لا نستطيع صنع المزيد، بل لأن الندرة احترام — للصانع، للمادة، وللشخص الذي يرتديها.",
    },
  ],
};

export default function AboutPage() {
  const [lang, setLang] = useState<Lang>("en");
  const isRtl      = lang === "ar";
  const milestones = MILESTONES[lang];

  return (
    <>
      <AnnouncementBar lang={lang} />
      <Navbar lang={lang} onLangChange={setLang} />

      <main style={{ background: "var(--bg)", minHeight: "70vh", direction: isRtl ? "rtl" : "ltr" }}>

        {/* ── Section 1: Brand hero ──────────────────────────────────────────── */}
        <div
          className="belta-about-photo"
          style={{
            position: "relative",
            width: "100%",
            height: "70vh",
            maxHeight: "600px",
            overflow: "hidden",
          }}
        >
          {/* Background photo */}
          <div style={{ position: "absolute", inset: 0 }}>
            <PhotoZone mode="lifestyle" kind="hero" />
          </div>

          {/* Gradient overlay — dark at bottom for legibility */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(44,24,16,0.78) 0%, rgba(44,24,16,0.18) 55%, transparent 100%)",
            }}
          />

          {/* Text overlay — pinned to bottom */}
          <div
            className="belta-about-hero-text"
            style={{
              position: "absolute",
              bottom: 0,
              insetInlineStart: 0,
              insetInlineEnd: 0,
              padding: "40px 56px",
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "var(--fs-eyebrow)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-eyebrow)",
                textTransform: "uppercase",
                color: "rgba(245,239,230,0.72)",
                marginBottom: "14px",
                lineHeight: 1,
              }}
            >
              {lang === "en" ? "About Beltà" : "عن بيلتا"}
            </span>

            <h1
              className="belta-about-hero-h1"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "48px",
                fontWeight: 600,
                lineHeight: "var(--lh-snug)",
                letterSpacing: "var(--tracking-tight)",
                color: "var(--fg-on-dark)",
                margin: 0,
              }}
            >
              {lang === "en" ? (
                <>
                  Not all scarves are{" "}
                  <em style={{ fontStyle: "italic", color: "var(--belta-blush)" }}>
                    created equal
                  </em>
                </>
              ) : (
                <>
                  ليست كل الأوشحة{" "}
                  <em style={{ fontStyle: "italic", color: "var(--belta-blush)" }}>
                    سواء
                  </em>
                </>
              )}
            </h1>
          </div>
        </div>

        {/* ── Brand story paragraph ──────────────────────────────────────────── */}
        <div
          className="belta-page-pad"
          style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}
        >
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
              ? "Beltà is a Lebanese artisan scarf house. Each piece is designed with an interior eye — drawn in Beirut, woven with care, and released in limited numbers. We work with a small circle of weavers who understand that precision and poetry are not opposites. When a piece is gone, it is gone."
              : "بيلتا دار وشاح لبنانية حرفية. تُصمَّم كل قطعة بعين داخلية — مرسومة في بيروت، منسوجة باعتناء، وتُطلَق بأعداد محدودة. نعمل مع حلقة صغيرة من النساجين الذين يدركون أن الدقة والشعر ليسا ضدين. حين تنتهي القطعة، لن تعود."}
          </p>
        </div>

        {/* ── Section 2: Timeline ────────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: "var(--container-narrow)",
            margin: "0 auto",
            padding: "0 32px 96px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "40px",
              fontWeight: 600,
              lineHeight: "var(--lh-snug)",
              letterSpacing: "var(--tracking-tight)",
              color: "var(--fg)",
              margin: "56px 0 52px",
            }}
          >
            {lang === "en" ? "Our story" : "حكايتنا"}
          </h2>

          {/* Vertical timeline */}
          <div style={{ position: "relative", paddingInlineStart: "36px" }}>
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                insetInlineStart: "7px",
                top: "6px",
                bottom: "6px",
                width: "1px",
                background: "var(--border)",
              }}
            />

            {milestones.map((m, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  paddingBottom: i < milestones.length - 1 ? "52px" : 0,
                }}
              >
                {/* Terracotta dot */}
                <div
                  style={{
                    position: "absolute",
                    insetInlineStart: "-29px",
                    top: "6px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "var(--brand)",
                    border: "2px solid var(--bg)",
                    boxShadow: "0 0 0 2px var(--brand)",
                  }}
                />

                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--fs-eyebrow)",
                    fontWeight: 500,
                    letterSpacing: "var(--tracking-eyebrow)",
                    textTransform: "uppercase",
                    color: "var(--brand)",
                    marginBottom: "10px",
                    lineHeight: 1,
                  }}
                >
                  {m.year}
                </span>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    fontWeight: 600,
                    lineHeight: "var(--lh-snug)",
                    color: "var(--fg)",
                    margin: "0 0 12px",
                  }}
                >
                  {m.heading}
                </h3>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--fs-body)",
                    lineHeight: "var(--lh-relaxed)",
                    color: "var(--fg-muted)",
                    margin: 0,
                    maxWidth: "520px",
                  }}
                >
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
