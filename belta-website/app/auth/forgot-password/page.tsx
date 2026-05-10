"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectTo = "https://belta-website-sigma.vercel.app/auth/reset-password";

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          padding: "48px 40px",
        }}
      >
        {/* Wordmark */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "34px",
              fontWeight: 500,
              color: "var(--belta-terracotta)",
              letterSpacing: "-0.01em",
              textDecoration: "none",
              lineHeight: 1,
            }}
          >
            Beltà
          </Link>
        </div>

        {sent ? (
          /* ── Success state ── */
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                fontWeight: 600,
                color: "var(--fg)",
                margin: "0 0 16px",
                lineHeight: "var(--lh-snug)",
              }}
            >
              Check your email
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "var(--fg-muted)",
                margin: "0 0 32px",
                lineHeight: "var(--lh-relaxed)",
              }}
            >
              We sent a password reset link to{" "}
              <strong style={{ color: "var(--fg)" }}>{email}</strong>.
              Click the link in that email to choose a new password.
            </p>
            <GhostLink href="/auth/login">Back to sign in</GhostLink>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "40px",
                fontWeight: 600,
                lineHeight: "var(--lh-snug)",
                letterSpacing: "var(--tracking-tight)",
                color: "var(--fg)",
                margin: "0 0 12px",
                textAlign: "center",
              }}
            >
              Reset password
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "var(--fg-muted)",
                margin: "0 0 28px",
                textAlign: "center",
                lineHeight: "var(--lh-normal)",
              }}
            >
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <AuthField
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={setEmail}
                required
                autoComplete="email"
              />

              {error && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--danger)",
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}

              <SubmitButton loading={loading} label="Send reset link" />

              <div style={{ textAlign: "center" }}>
                <GhostLink href="/auth/login">Back to sign in</GhostLink>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Shared sub-components ────────────────────────────────────────────────── */

function AuthField({
  label, type, placeholder, value, onChange, required, autoComplete,
}: {
  label: string; type: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500,
          color: "var(--fg-muted)", letterSpacing: "0.02em",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "11px 14px",
          border: focused ? "1px solid var(--brand)" : "1px solid var(--border-strong)",
          borderRadius: "var(--radius-md)", background: "var(--bg-raised)",
          fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--fg)",
          outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(139,69,19,0.15)" : "none",
          transition: "border-color 280ms var(--ease-out), box-shadow 280ms var(--ease-out)",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", fontFamily: "var(--font-body)", fontSize: "15px",
        fontWeight: 500, letterSpacing: "0.01em", padding: "13px 20px",
        borderRadius: "var(--radius-md)", border: "none",
        background: loading ? "var(--brand-soft)" : hovered ? "var(--brand-hover)" : "var(--brand)",
        color: "var(--fg-on-brand)",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.72 : 1,
        transition: "background 280ms var(--ease-out)",
        lineHeight: 1, marginTop: "4px",
      }}
    >
      {loading ? "Sending…" : label}
    </button>
  );
}

function GhostLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)", fontSize: "13px",
        color: hovered ? "var(--brand-hover)" : "var(--brand)",
        textDecoration: hovered ? "underline" : "none",
        textUnderlineOffset: "3px",
        transition: "color 280ms var(--ease-out)",
      }}
    >
      {children}
    </Link>
  );
}
