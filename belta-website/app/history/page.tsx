"use client";

import { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = {
  en: [
    {
      eyebrow: "The Beginning",
      heading: "Born in Beirut",
      body: "Beltà began in a small atelier tucked into a quiet Beirut street. A designer, a bolt of silk, and an idea — that a scarf could carry the feeling of a city. The first twelve pieces sold before they were photographed.",
    },
    {
      eyebrow: "The Craft",
      heading: "Every thread matters",
      body: "We work only with artisans who understand the weight of a deadline and the patience of a woven edge. Each scarf passes through eight pairs of hands before it reaches yours. There are no shortcuts in this house.",
    },
    {
      eyebrow: "Today",
      heading: "Limited. Always.",
      body: "We release new designs in editions of forty-two or fewer. Not because we cannot make more, but because scarcity is respect — for the maker, for the material, and for the person who wears it.",
    },
  ],
  ar: [
    {
      eyebrow: "البداية",
      heading: "وُلدت في بيروت",
      body: "بدأت بيلتا في محترف صغير يختبئ في شارع هادئ ببيروت. مصمِّمة، قطعة حرير، وفكرة — أن الوشاح يمكن أن يحمل شعور مدينة. القطع الاثنتا عشرة الأولى بيعت قبل أن تُصوَّر.",
    },
    {
      eyebrow: "الحرفة",
      heading: "كل خيط مهم",
      body: "نعمل فقط مع حرفيين يفهمون ثقل الموعد النهائي وصبر الحافة المنسوجة. يمر كل وشاح بثمانية أزواج من الأيدي قبل أن يصل إليك. لا اختصارات في هذا البيت.",
    },
    {
      eyebrow: "اليوم",
      heading: "محدود. دائماً.",
      body: "نطلق تصاميم جديدة بإصدارات لا تتجاوز اثنين وأربعين قطعة. ليس لأننا لا نستطيع صنع المزيد، بل لأن الندرة احترام — للصانع، للمادة، وللشخص الذي يرتديها.",
    },
  ],
};

export default function HistoryPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const isRtl = lang === "ar";
  const sections = SECTIONS[lang];

  return (
    <>
      <AnnouncementBar lang={lang} />
      <Navbar lang={lang} onLangChange={setLang} />

      <main
        style={{
          background: "var(--bg)",
          minHeight: "70vh",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        {/* ── Hero headline ─────────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: "var(--container-narrow)",
            margin: "0 auto",
            padding: "80px 32px 64px",
            textAlign: isRtl ? "right" : "left",
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
              color: "var(--brand)",
              marginBottom: "20px",
              lineHeight: 1,
            }}
          >
            {lang === "en" ? "Our Story" : "حكايتنا"}
          </span>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-display)",
              fontWeight: 600,
              lineHeight: "var(--lh-tight)",
              letterSpacing: "var(--tracking-display)",
              color: "var(--fg)",
              margin: 0,
            }}
          >
            {lang === "en" ? (
              <>
                Designed with an{" "}
                <em style={{ fontStyle: "italic", color: "var(--brand)" }}>
                  interior
                </em>{" "}
                eye
              </>
            ) : (
              <>
                مصمَّم بعين{" "}
                <em style={{ fontStyle: "italic", color: "var(--brand)" }}>
                  داخلية
                </em>
              </>
            )}
          </h1>
        </div>

        {/* ── Three editorial sections ───────────────────────────────────── */}
        <div
          style={{
            maxWidth: "var(--container-narrow)",
            margin: "0 auto",
            padding: "0 32px 96px",
          }}
        >
          {sections.map((s, i) => (
            <div key={i}>
              {i > 0 && (
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    margin: "56px 0",
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
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
                  {s.eyebrow}
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
                  {s.heading}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--fs-lead)",
                    lineHeight: "var(--lh-relaxed)",
                    color: "var(--fg-muted)",
                    maxWidth: "640px",
                    margin: 0,
                  }}
                >
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
