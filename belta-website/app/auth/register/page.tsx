"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [phone, setPhone]         = useState("");
  const [address, setAddress]     = useState("");
  const [city, setCity]           = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone:     phone   || null,
          address:   address || null,
          city:      city    || null,
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Newsletter subscription — non-critical, ignore errors
    if (newsletter) {
      await supabase.from("newsletter_subscribers").insert({
        name,
        email,
        phone:   phone   || null,
        address: address || null,
        city:    city    || null,
      });
    }

    setLoading(false);
    router.push("/");
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

        <>
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
              Create your account
            </h1>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <AuthField
                label="Name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={setName}
                required
                autoComplete="name"
              />
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
                placeholder="Create a password"
                value={password}
                onChange={setPassword}
                required
                autoComplete="new-password"
              />
              <AuthField
                label="Phone number"
                type="tel"
                placeholder="+961 XX XXX XXX"
                value={phone}
                onChange={setPhone}
                autoComplete="tel"
              />
              <AuthField
                label="Address"
                type="text"
                placeholder="Your address"
                value={address}
                onChange={setAddress}
                autoComplete="street-address"
              />
              <AuthField
                label="City"
                type="text"
                placeholder="Your city"
                value={city}
                onChange={setCity}
                autoComplete="address-level2"
              />

              {/* Newsletter opt-in */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  cursor: "pointer",
                  marginTop: "4px",
                }}
              >
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "4px",
                    accentColor: "var(--brand)",
                    cursor: "pointer",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--fg-muted)",
                    lineHeight: "var(--lh-normal)",
                    userSelect: "none",
                  }}
                >
                  Notify me about new collections and offers
                </span>
              </label>

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

              <SubmitButton loading={loading} label="Create account" />
            </form>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--fg-subtle)",
                textAlign: "center",
                margin: "24px 0 0",
              }}
            >
              {"Already have an account? "}
              <GhostLink href="/auth/login">Sign in →</GhostLink>
            </p>
          </>
      </div>
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────────────────────────── */

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
          border: focused
            ? "1px solid var(--brand)"
            : "1px solid var(--border-strong)",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-raised)",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--fg)",
          outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(139,69,19,0.15)" : "none",
          transition:
            "border-color 280ms var(--ease-out), box-shadow 280ms var(--ease-out)",
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
      {loading ? "Creating account…" : label}
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
