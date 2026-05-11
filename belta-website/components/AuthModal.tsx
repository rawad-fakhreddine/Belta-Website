"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthModal() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [visible, setVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check auth state first
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setLoggedIn(!!user);
      setChecking(false);
    });
  }, []);

  // Start 4s timer only after auth check completes and user is not logged in
  useEffect(() => {
    if (checking || loggedIn) return;
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, [checking, loggedIn]);

  // Escape key to dismiss
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisible(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [visible]);

  // Body scroll lock
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setVisible(false);
    router.refresh();
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setVisible(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(44,24,16,0.55)",
          backdropFilter: "blur(4px)",
          animation: "belta-fade-in 280ms var(--ease-out) both",
        }}
      />

      {/* Modal card */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 201,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-xl)",
            padding: "40px 36px 36px",
            position: "relative",
            pointerEvents: "auto",
            animation: "belta-modal-in 320ms var(--ease-out) both",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setVisible(false)}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              background: "none",
              border: "none",
              color: "var(--fg-subtle)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 180ms var(--ease-out)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-subtle)")}
          >
            <X size={18} strokeWidth={1.5} />
          </button>

          {/* Wordmark */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Link
              href="/"
              onClick={() => setVisible(false)}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "30px",
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

          {/* Heading */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "26px",
              fontWeight: 600,
              color: "var(--fg)",
              margin: "0 0 6px",
              textAlign: "center",
              lineHeight: "var(--lh-snug)",
            }}
          >
            Welcome back
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--fg-subtle)",
              textAlign: "center",
              margin: "0 0 28px",
              lineHeight: "var(--lh-normal)",
            }}
          >
            Sign in to your Beltà account
          </p>

          {/* Form */}
          <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <ModalField
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={setEmail}
              required
              autoComplete="email"
            />
            <ModalField
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={setPassword}
              required
              autoComplete="current-password"
            />

            {error && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--danger)", margin: 0 }}>
                {error}
              </p>
            )}

            <ModalSubmitButton loading={loading} />
          </form>

          {/* Footer links */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <ModalGhostLink href="/auth/login" onClick={() => setVisible(false)}>
              Sign in with full page
            </ModalGhostLink>
            <ModalGhostLink href="/auth/register" onClick={() => setVisible(false)}>
              Create account →
            </ModalGhostLink>
          </div>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <ModalGhostLink href="/auth/forgot-password" onClick={() => setVisible(false)}>
              Forgot password?
            </ModalGhostLink>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function ModalField({
  label, type, placeholder, value, onChange, required, autoComplete,
}: {
  label: string; type: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: "var(--fg-muted)", letterSpacing: "0.02em" }}>
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
          width: "100%", padding: "10px 13px",
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

function ModalSubmitButton({ loading }: { loading: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500,
        letterSpacing: "0.01em", padding: "12px 20px", borderRadius: "var(--radius-md)", border: "none",
        background: loading ? "var(--brand-soft)" : hovered ? "var(--brand-hover)" : "var(--brand)",
        color: "var(--fg-on-brand)", cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.72 : 1, transition: "background 280ms var(--ease-out)",
        lineHeight: 1, marginTop: "4px",
      }}
    >
      {loading ? "Signing in…" : "Sign in"}
    </button>
  );
}

function ModalGhostLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)", fontSize: "12px",
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
