"use client";

import { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const isRtl = lang === "ar";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "64px 32px 96px",
          }}
        >
          {/* ── Page heading ─────────────────────────────────────────────── */}
          <div style={{ marginBottom: "56px" }}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "var(--fs-eyebrow)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-eyebrow)",
                textTransform: "uppercase",
                color: "var(--brand)",
                marginBottom: "12px",
                lineHeight: 1,
              }}
            >
              {lang === "en" ? "We'd love to hear from you" : "يسعدنا التواصل معك"}
            </span>
            <h1
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
              {lang === "en" ? "Get in touch" : "تواصلي معنا"}
            </h1>
          </div>

          {/* ── Two-column layout ────────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
              alignItems: "start",
            }}
          >
            {/* ── Left: contact info ──────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
            >
              <ContactItem
                label={lang === "en" ? "Instagram" : "إنستغرام"}
                value="@belta.scarfs"
                href="https://instagram.com/belta.scarfs"
              />

              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    color: "var(--fg-muted)",
                    margin: "0 0 8px",
                    textTransform: "uppercase",
                  }}
                >
                  {lang === "en" ? "WhatsApp" : "واتساب"}
                </p>
                <WhatsAppButton lang={lang} />
              </div>

              <ContactItem
                label={lang === "en" ? "Email" : "البريد الإلكتروني"}
                value="hello@belta.com"
                href="mailto:hello@belta.com"
              />

              <div
                style={{
                  paddingTop: "24px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--fs-small)",
                    lineHeight: "var(--lh-relaxed)",
                    color: "var(--fg-subtle)",
                    margin: 0,
                  }}
                >
                  {lang === "en"
                    ? "We're a small team — please allow 1–2 business days for a reply. For urgent orders, WhatsApp is fastest."
                    : "نحن فريق صغير — يرجى السماح بـ 1-2 أيام عمل للرد. للطلبات العاجلة، واتساب هو الأسرع."}
                </p>
              </div>
            </div>

            {/* ── Right: contact form ─────────────────────────────────── */}
            <div>
              {submitted ? (
                <div
                  style={{
                    padding: "40px",
                    background: "var(--surface)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border)",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--fs-h3)",
                      color: "var(--fg)",
                      margin: "0 0 12px",
                    }}
                  >
                    {lang === "en" ? "Message sent" : "تم إرسال رسالتك"}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--fs-body)",
                      color: "var(--fg-muted)",
                      margin: 0,
                    }}
                  >
                    {lang === "en"
                      ? "Thank you — we'll be in touch soon."
                      : "شكراً لك — سنتواصل معك قريباً."}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
                  <Field
                    label={lang === "en" ? "Name" : "الاسم"}
                    type="text"
                    placeholder={lang === "en" ? "Your name" : "اسمك"}
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    required
                  />
                  <Field
                    label={lang === "en" ? "Email" : "البريد الإلكتروني"}
                    type="email"
                    placeholder={lang === "en" ? "your@email.com" : "بريدك@example.com"}
                    value={form.email}
                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    required
                  />
                  <TextareaField
                    label={lang === "en" ? "Message" : "الرسالة"}
                    placeholder={
                      lang === "en"
                        ? "Tell us what's on your mind…"
                        : "أخبرينا ما الذي يدور في ذهنك…"
                    }
                    value={form.message}
                    onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                    required
                  />
                  <SubmitButton lang={lang} />
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function ContactItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.02em",
          color: "var(--fg-muted)",
          margin: "0 0 6px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      <a
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--fs-body)",
          color: hovered ? "var(--brand-hover)" : "var(--brand)",
          textDecoration: hovered ? "underline" : "none",
          textUnderlineOffset: "3px",
          transition: "color 280ms var(--ease-out)",
        }}
      >
        {value}
      </a>
    </div>
  );
}

function WhatsAppButton({ lang }: { lang: "en" | "ar" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://wa.me/"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: "0.01em",
        padding: "10px 20px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-strong)",
        background: hovered ? "var(--fg)" : "var(--bg-raised)",
        color: hovered ? "var(--fg-on-dark)" : "var(--fg)",
        textDecoration: "none",
        cursor: "pointer",
        transition:
          "background 280ms var(--ease-out), color 280ms var(--ease-out), border-color 280ms var(--ease-out)",
        lineHeight: 1,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      {lang === "en" ? "Message on WhatsApp" : "راسلينا على واتساب"}
    </a>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--fg-muted)",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "11px 14px",
          border: focused
            ? "1px solid var(--brand)"
            : "1px solid var(--border-strong)",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-raised)",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--fg)",
          outline: "none",
          boxShadow: focused
            ? "0 0 0 3px rgba(139,69,19,0.15)"
            : "none",
          transition:
            "border-color 280ms var(--ease-out), box-shadow 280ms var(--ease-out)",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function TextareaField({
  label,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--fg-muted)",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        required={required}
        rows={6}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "11px 14px",
          border: focused
            ? "1px solid var(--brand)"
            : "1px solid var(--border-strong)",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-raised)",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--fg)",
          outline: "none",
          boxShadow: focused
            ? "0 0 0 3px rgba(139,69,19,0.15)"
            : "none",
          transition:
            "border-color 280ms var(--ease-out), box-shadow 280ms var(--ease-out)",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function SubmitButton({ lang }: { lang: "en" | "ar" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="submit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        alignSelf: "flex-start",
        fontFamily: "var(--font-body)",
        fontSize: "15px",
        fontWeight: 500,
        letterSpacing: "0.01em",
        padding: "14px 28px",
        borderRadius: "var(--radius-md)",
        border: "none",
        background: hovered ? "var(--brand-hover)" : "var(--brand)",
        color: "var(--fg-on-brand)",
        cursor: "pointer",
        transition: "background 280ms var(--ease-out)",
        lineHeight: 1,
      }}
    >
      {lang === "en" ? "Send message" : "إرسال الرسالة"}
    </button>
  );
}
