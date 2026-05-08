"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = {
  en: ["Home", "Shop", "About", "History", "Contact"],
  ar: ["الرئيسية", "المتجر", "عنّا", "حكايتنا", "تواصلي"],
};

const NAV_HREFS = ["/", "/shop", "/about", "/history", "/contact"];

interface FooterProps {
  lang?: "en" | "ar";
  onNav?: (href: string) => void;
}

export default function Footer({ lang = "en", onNav }: FooterProps) {
  const labels = NAV_LINKS[lang];
  const isRtl = lang === "ar";
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--belta-brown)",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          padding: "48px 32px 0",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        {/* ── Three-column main row ─────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "32px",
            alignItems: "start",
            paddingBottom: "48px",
          }}
        >
          {/* Left — wordmark */}
          <div>
            <a
              href="#home"
              lang="en"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "38px",
                fontWeight: 500,
                color: "var(--belta-cream)",
                letterSpacing: "-0.01em",
                textDecoration: "none",
                lineHeight: 1,
                display: "inline-block",
              }}
            >
              Beltà
            </a>
          </div>

          {/* Center — nav links */}
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "28px",
            }}
          >
            {labels.map((label, i) => (
              <FooterNavLink
                key={NAV_HREFS[i]}
                href={NAV_HREFS[i]}
                onClick={onNav}
              >
                {label}
              </FooterNavLink>
            ))}
          </nav>

          {/* Right — social icons + tagline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isRtl ? "flex-start" : "flex-end",
              gap: "20px",
            }}
          >
            {/* Icon row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <SocialButton label="Instagram">
                <InstagramIcon />
              </SocialButton>

              <SocialButton label="WhatsApp">
                <WhatsAppIcon />
              </SocialButton>

              {/* Divider + tagline */}
              <div
                style={{
                  borderInlineStart: "1px solid rgba(245,239,230,0.18)",
                  paddingInlineStart: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(245,239,230,0.85)",
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                  }}
                >
                  Artisan Scarfs · Lebanon
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-arabic)",
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "rgba(245,239,230,0.85)",
                    lineHeight: 1.4,
                    direction: "rtl",
                    whiteSpace: "nowrap",
                  }}
                >
                  وشاح يدوي · لبنان
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hairline rule ─────────────────────────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid rgba(245,239,230,0.08)",
          }}
        />

        {/* ── Copyright row ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "rgba(245,239,230,0.55)",
              letterSpacing: "0.02em",
            }}
          >
            © {year} Beltà · Beirut
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "rgba(245,239,230,0.55)",
              letterSpacing: "0.08em",
            }}
          >
            · · ·
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function FooterNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: (href: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onClick={onClick ? () => onClick(href) : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        fontWeight: 400,
        color: hovered ? "var(--fg-on-dark)" : "rgba(245,239,230,0.85)",
        textDecoration: "none",
        transition: "color 280ms var(--ease-out)",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Link>
  );
}

function SocialButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        padding: "4px",
        cursor: "pointer",
        color: hovered ? "var(--fg-on-dark)" : "rgba(245,239,230,0.85)",
        transition: "color 280ms var(--ease-out)",
        borderRadius: "var(--radius-sm)",
      }}
    >
      {children}
    </button>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Chat bubble */}
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      {/* Handset curve */}
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Zm0 0a5 5 0 0 0 5 5" />
      <path d="M14 14.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1Z" />
    </svg>
  );
}
