"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [linkExpired, setLinkExpired]   = useState(false);

  useEffect(() => {
    let resolved = false;

    const resolve = () => {
      if (!resolved) {
        resolved = true;
        setSessionReady(true);
      }
    };

    // A: hash-based implicit flow (dashboard emails) or PKCE via onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") resolve();
    });

    // B: PKCE flow — code arrives as a query param, exchange it browser-side
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) resolve();
      });
    }

    // C: server callback already set the session before redirecting here
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) resolve();
    });

    // If none of the above resolved after 5 s, the link is expired or already used
    const timeout = setTimeout(() => {
      if (!resolved) setLinkExpired(true);
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);

    // Sign out so the user logs in fresh with their new password
    await supabase.auth.signOut();

    setTimeout(() => router.replace("/auth/login"), 2500);
  };

  if (!sessionReady) {
    return (
      <div
        style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "var(--bg)", padding: "32px 16px",
        }}
      >
        <div
          style={{
            width: "100%", maxWidth: "440px", background: "var(--surface)",
            border: "1px solid var(--border)", borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-lg)", padding: "48px 40px", textAlign: "center",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)", fontSize: "34px", fontWeight: 500,
              color: "var(--belta-terracotta)", letterSpacing: "-0.01em",
              textDecoration: "none", lineHeight: 1, display: "block", marginBottom: "32px",
            }}
          >
            Beltà
          </Link>

          {linkExpired ? (
            <>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 600, color: "var(--fg)", margin: "0 0 12px", lineHeight: "var(--lh-snug)" }}>
                Link expired
              </h1>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--fg-muted)", margin: "0 0 24px", lineHeight: "var(--lh-relaxed)" }}>
                This reset link has already been used or has expired. Request a new one.
              </p>
              <Link
                href="/auth/forgot-password"
                style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--brand)", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                Request a new reset link
              </Link>
            </>
          ) : (
            <p style={{ fontFamily: "var(--font-body)", color: "var(--fg-muted)", fontSize: "14px" }}>
              Verifying your reset link…
            </p>
          )}
        </div>
      </div>
    );
  }

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

        {done ? (
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
              Password updated
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "var(--fg-muted)",
                margin: "0 0 8px",
                lineHeight: "var(--lh-relaxed)",
              }}
            >
              Your password has been changed. Redirecting you to sign in…
            </p>
          </div>
        ) : (
          <>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "40px",
                fontWeight: 600,
                lineHeight: "var(--lh-snug)",
                letterSpacing: "var(--tracking-tight)",
                color: "var(--fg)",
                margin: "0 0 28px",
                textAlign: "center",
              }}
            >
              New password
            </h1>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <AuthField
                label="New password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={setPassword}
                required
                autoComplete="new-password"
              />

              <AuthField
                label="Confirm new password"
                type="password"
                placeholder="Repeat your new password"
                value={confirm}
                onChange={setConfirm}
                required
                autoComplete="new-password"
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

              <SubmitButton loading={loading} label="Set new password" />
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
      {loading ? "Saving…" : label}
    </button>
  );
}
