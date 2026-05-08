"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface FormState {
  subject: string;
  preview: string;
  message: string;
}

const INIT: FormState = { subject: "", preview: "", message: "" };

type SendStatus = "idle" | "sending" | "success" | "error";

export default function CampaignsPage() {
  const [form, setForm]               = useState<FormState>(INIT);
  const [subCount, setSubCount]       = useState<number | null>(null);
  const [status, setStatus]           = useState<SendStatus>("idle");
  const [sentCount, setSentCount]     = useState<number>(0);
  const [errorMsg, setErrorMsg]       = useState<string>("");

  // Fetch subscriber count on mount
  useEffect(() => {
    supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setSubCount(count ?? 0));
  }, []);

  const set = <K extends keyof FormState>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/send-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? "Unknown error");
        setStatus("error");
        return;
      }

      setSentCount(data.count);
      setStatus("success");
      setForm(INIT);
    } catch {
      setErrorMsg("Network error — please try again");
      setStatus("error");
    }
  };

  return (
    <div className="belta-admin-content-pad" style={{ maxWidth: "760px" }}>

      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <p style={eyebrow}>Admin</p>
        <h1 style={pageTitle}>Email campaigns</h1>
      </div>

      {/* ── Stat card ───────────────────────────────────────────────────── */}
      <div style={{ ...card, marginBottom: "28px", display: "flex", alignItems: "center", gap: "20px" }}>
        <div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#5A4438", margin: "0 0 6px", letterSpacing: "0.02em" }}>
            Total subscribers
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 600, color: "#8B4513", margin: 0, lineHeight: 1 }}>
            {subCount === null ? "—" : subCount}
          </p>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#8A766A", margin: 0, lineHeight: 1.6 }}>
          All active newsletter<br />subscribers will receive<br />this campaign.
        </p>
      </div>

      {/* ── Success banner ───────────────────────────────────────────────── */}
      {status === "success" && (
        <div style={{
          marginBottom: "24px",
          padding: "16px 20px",
          background: "rgba(126,148,118,0.12)",
          border: "1px solid rgba(126,148,118,0.35)",
          borderRadius: "10px",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "#4D6B45",
        }}>
          Sent to {sentCount} subscriber{sentCount !== 1 ? "s" : ""} successfully.
        </div>
      )}

      {/* ── Form card ───────────────────────────────────────────────────── */}
      <div style={card}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          <Field label="Subject line" required>
            <Input
              value={form.subject}
              onChange={(v) => set("subject", v)}
              placeholder="e.g. New arrivals — Spring 2025"
              required
            />
          </Field>

          <Field label="Preview text" hint="Short teaser shown in the inbox before opening">
            <Input
              value={form.preview}
              onChange={(v) => set("preview", v)}
              placeholder="e.g. Four new pieces, limited edition"
            />
          </Field>

          <Field label="Message body" required>
            <Textarea
              value={form.message}
              onChange={(v) => set("message", v)}
              placeholder={"Write your message here. Each new line becomes a paragraph in the email.\n\nYou can write multiple paragraphs."}
              rows={8}
              required
            />
          </Field>

          {status === "error" && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#A23A26", margin: 0 }}>
              {errorMsg}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingTop: "8px", borderTop: "1px solid #E2D5C3" }}>
            <SendBtn loading={status === "sending"} count={subCount} />
            {status === "sending" && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#8A766A", margin: 0 }}>
                Sending…
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Style tokens ─────────────────────────────────────────────────────────── */

const eyebrow: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500,
  letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A766A", margin: "0 0 8px",
};
const pageTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 600,
  color: "#2C1810", margin: 0, lineHeight: 1.2,
};
const card: React.CSSProperties = {
  background: "#FBF7F0", border: "1px solid #E2D5C3",
  borderRadius: "14px", boxShadow: "0 2px 6px rgba(44,24,16,0.06)", padding: "32px",
};

/* ── Field wrapper ────────────────────────────────────────────────────────── */

function Field({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: "#5A4438", letterSpacing: "0.02em" }}>
        {label}
        {required && <span style={{ color: "#A23A26", marginInlineStart: "2px" }}>*</span>}
      </label>
      {hint && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#8A766A", margin: "0 0 2px", lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

/* ── Input ────────────────────────────────────────────────────────────────── */

function Input({ value, onChange, placeholder, required }: {
  value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "11px 14px",
        border: focused ? "1px solid #8B4513" : "1px solid #C9B8A3",
        borderRadius: "8px", background: "#FBF7F0",
        fontFamily: "var(--font-body)", fontSize: "14px", color: "#2C1810",
        outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(139,69,19,0.15)" : "none",
        transition: "border-color 280ms var(--ease-out), box-shadow 280ms var(--ease-out)",
        boxSizing: "border-box",
      }}
    />
  );
}

/* ── Textarea ─────────────────────────────────────────────────────────────── */

function Textarea({ value, onChange, placeholder, rows, required }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows ?? 6}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "11px 14px",
        border: focused ? "1px solid #8B4513" : "1px solid #C9B8A3",
        borderRadius: "8px", background: "#FBF7F0",
        fontFamily: "var(--font-body)", fontSize: "14px", color: "#2C1810",
        outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(139,69,19,0.15)" : "none",
        transition: "border-color 280ms var(--ease-out), box-shadow 280ms var(--ease-out)",
        boxSizing: "border-box",
        resize: "vertical",
        lineHeight: "1.6",
      }}
    />
  );
}

/* ── Send button ──────────────────────────────────────────────────────────── */

function SendBtn({ loading, count }: { loading: boolean; count: number | null }) {
  const [hovered, setHovered] = useState(false);
  const label = loading
    ? "Sending…"
    : count === null
    ? "Send to all subscribers"
    : `Send to ${count} subscriber${count !== 1 ? "s" : ""}`;

  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500,
        letterSpacing: "0.01em", padding: "12px 24px", borderRadius: "8px", border: "none",
        background: loading ? "#A8623A" : hovered ? "#6E3610" : "#8B4513",
        color: "#F5EFE6", cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.72 : 1,
        transition: "background 280ms var(--ease-out)",
        lineHeight: 1, whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
