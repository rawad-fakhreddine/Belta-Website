"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(
    searchParams.get("error") ?? null
  );

  // Already logged in? Send home
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(next);
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
          position: "relative",
        }}
      >
        {/* Close / back to home */}
        <Link
          href="/"
          aria-label="Back to home"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "var(--radius-md)",
            color: "var(--fg-muted)",
            textDecoration: "none",
            fontSize: "20px",
            lineHeight: 1,
            transition: "color 180ms var(--ease-out)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
        >
          ×
        </Link>

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

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "40px",
            fontWeight: 600,
            lineHeight: "var(--lh-snug)",
            letterSpacing: "var(--tracking-tight)",
            color: "var(--fg)",
            margin: "0 0 32px",
            textAlign: "center",
          }}
        >
          Welcome back
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <AuthField
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={setEmail}
            required
            autoComplete="email"
          />

          <AuthField
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
          />

          {/* Error message */}
          {error && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--danger)",
                margin: 0,
                lineHeight: "var(--lh-normal)",
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <SubmitButton loading={loading} label="Sign in" />

          {/* Forgot password */}
          <div style={{ textAlign: "center" }}>
            <GhostLink href="/auth/forgot-password">
              Forgot password?
            </GhostLink>
          </div>
        </form>

        {/* Register link */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--fg-subtle)",
            textAlign: "center",
            margin: "24px 0 0",
          }}
        >
          {"Don't have an account? "}
          <GhostLink href="/auth/register">Create one →</GhostLink>
        </p>
      </div>
    </div>
  );
}

/* ─── Shared field sub-components ─────────────────────────────────────────── */

function AuthField({
  label,
  type,
  placeholder,
  value,
  onChange,
  required,
  autoComplete,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
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
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "11px 14px",
          border: focused ? "1px solid var(--brand)" : "1px solid var(--border-strong)",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-raised)",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--fg)",
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
        width: "100%",
        fontFamily: "var(--font-body)",
        fontSize: "15px",
        fontWeight: 500,
        letterSpacing: "0.01em",
        padding: "13px 20px",
        borderRadius: "var(--radius-md)",
        border: "none",
        background: loading
          ? "var(--brand-soft)"
          : hovered
          ? "var(--brand-hover)"
          : "var(--brand)",
        color: "var(--fg-on-brand)",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.72 : 1,
        transition: "background 280ms var(--ease-out)",
        lineHeight: 1,
        marginTop: "4px",
      }}
    >
      {loading ? "Signing in…" : label}
    </button>
  );
}

function GhostLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "13px",
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
