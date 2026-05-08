"use client";

import { useEffect, useState } from "react";

const MESSAGES = {
  en: [
    "Free shipping to Lebanon",
    "Limited pieces only",
    "Drawn in Beirut",
    "DM to order on WhatsApp",
  ],
  ar: [
    "شحن مجاني داخل لبنان",
    "طبعات محدودة فقط",
    "مرسوم في بيروت",
    "للطلب راسلينا على واتساب",
  ],
};

interface AnnouncementBarProps {
  lang?: "en" | "ar";
}

export default function AnnouncementBar({ lang = "en" }: AnnouncementBarProps) {
  const messages = MESSAGES[lang];
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out + slide up
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setVisible(true);
      }, 520);
    }, 3500);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      style={{
        background: "var(--belta-brown)",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "9px 16px",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fg-on-dark)",
          transition: "opacity 520ms var(--ease-out), transform 520ms var(--ease-out)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-6px)",
          display: "block",
          whiteSpace: "nowrap",
        }}
        lang={lang}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {messages[index]}
      </span>
    </div>
  );
}
