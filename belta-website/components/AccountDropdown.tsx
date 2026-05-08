"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

interface AccountDropdownProps {
  isOpen: boolean;
  user: User | null;
  onSignOut: () => Promise<void>;
  lang?: "en" | "ar";
}

export default function AccountDropdown({
  isOpen,
  user,
  onSignOut,
  lang = "en",
}: AccountDropdownProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 12px)",
        insetInlineEnd: 0,
        width: "220px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 10,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(-6px)",
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 220ms var(--ease-out), transform 220ms var(--ease-out)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {user ? (
        <SignedInView user={user} onSignOut={onSignOut} lang={lang} />
      ) : (
        <SignedOutView lang={lang} />
      )}
    </div>
  );
}

/* ─── Signed-out state ────────────────────────────────────────────────────── */

function SignedOutView({ lang }: { lang: "en" | "ar" }) {
  return (
    <>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--fg-subtle)",
          margin: 0,
        }}
      >
        {lang === "en" ? "My account" : "حسابي"}
      </p>

      <SignInButton lang={lang} />

      <Link
        href="/auth/register"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "var(--fg-muted)",
          textAlign: "center",
          textDecoration: "none",
          lineHeight: 1,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
      >
        {lang === "en" ? "Create account" : "إنشاء حساب"}
      </Link>
    </>
  );
}

/* ─── Signed-in state ─────────────────────────────────────────────────────── */

function SignedInView({
  user,
  onSignOut,
  lang,
}: {
  user: User;
  onSignOut: () => Promise<void>;
  lang: "en" | "ar";
}) {
  const [signingOut, setSigningOut] = useState(false);

  const email = user.email ?? "";
  const displayEmail = email.length > 22 ? email.slice(0, 20) + "…" : email;

  const handleSignOut = async () => {
    setSigningOut(true);
    await onSignOut();
  };

  return (
    <>
      {/* Email */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          color: "var(--fg-subtle)",
          margin: 0,
          letterSpacing: "0.01em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={email}
      >
        {displayEmail}
      </p>

      {/* Hairline divider */}
      <div style={{ height: "1px", background: "var(--border)" }} />

      {/* My account link */}
      <Link
        href="/account"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "var(--fg)",
          textDecoration: "none",
          lineHeight: 1,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg)")}
      >
        {lang === "en" ? "My account" : "حسابي"}
      </Link>

      {/* Sign out button */}
      <SignOutButton
        lang={lang}
        loading={signingOut}
        onClick={handleSignOut}
      />
    </>
  );
}

/* ─── Button sub-components ───────────────────────────────────────────────── */

function SignInButton({ lang }: { lang: "en" | "ar" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href="/auth/login"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        width: "100%",
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: "0.01em",
        padding: "11px 16px",
        borderRadius: "var(--radius-md)",
        background: hovered ? "var(--brand-hover)" : "var(--brand)",
        color: "var(--fg-on-brand)",
        textDecoration: "none",
        textAlign: "center",
        transition: "background 280ms var(--ease-out)",
        lineHeight: 1,
        boxSizing: "border-box",
      }}
    >
      {lang === "en" ? "Sign in" : "تسجيل الدخول"}
    </Link>
  );
}

function SignOutButton({
  lang,
  loading,
  onClick,
}: {
  lang: "en" | "ar";
  loading: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        fontWeight: 400,
        padding: "8px 12px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-strong)",
        background: hovered ? "var(--bg-alt)" : "transparent",
        color: hovered ? "var(--fg)" : "var(--fg-muted)",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.55 : 1,
        transition: "background 280ms var(--ease-out), color 280ms var(--ease-out)",
        lineHeight: 1,
        textAlign: "center",
      }}
    >
      {loading
        ? lang === "en" ? "Signing out…" : "جارٍ الخروج…"
        : lang === "en" ? "Sign out" : "تسجيل الخروج"}
    </button>
  );
}
