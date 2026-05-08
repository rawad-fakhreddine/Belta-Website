"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, Heart, ShoppingBag } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import SearchPanel from "@/components/SearchPanel";
import AccountDropdown from "@/components/AccountDropdown";
import WishlistDropdown from "@/components/WishlistDropdown";
import CartPanel from "@/components/CartPanel";

const NAV_LINKS = {
  en: ["Home", "Shop", "About", "History", "Contact"],
  ar: ["الرئيسية", "المتجر", "عنّا", "حكايتنا", "تواصلي"],
};

const NAV_HREFS = ["/", "/shop", "/about", "/history", "/contact"];

type PanelId = "search" | "account" | "wishlist" | "cart";

interface NavbarProps {
  lang?: "en" | "ar";
  onLangChange?: (lang: "en" | "ar") => void;
  bagCount?: number;
}

export default function Navbar({
  lang = "en",
  onLangChange,
  bagCount = 0,
}: NavbarProps) {
  const [scrolled, setScrolled]         = useState(false);
  const [activePanel, setActivePanel]   = useState<PanelId | null>(null);
  const [user, setUser]                 = useState<SupabaseUser | null>(null);
  const pathname  = usePathname();
  const router    = useRouter();
  const labels    = NAV_LINKS[lang];
  const isRtl     = lang === "ar";

  // Scroll border
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  // Escape key closes any open panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activePanel) setActivePanel(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activePanel]);

  // Close panels on route change
  useEffect(() => { setActivePanel(null); }, [pathname]);

  const toggle = (id: PanelId) =>
    setActivePanel((prev) => (prev === id ? null : id));

  const closeAll = () => setActivePanel(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    closeAll();
    router.push("/");
  };

  const handleLangToggle = () => {
    const next = lang === "en" ? "ar" : "en";
    document.documentElement.lang = next;
    document.documentElement.dir  = next === "ar" ? "rtl" : "ltr";
    onLangChange?.(next);
    closeAll();
  };

  const dropdownOpen = activePanel === "account" || activePanel === "wishlist";

  return (
    <>
      {/* Invisible backdrop — closes account/wishlist dropdowns on outside click */}
      {dropdownOpen && (
        <div
          onClick={closeAll}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 49,
          }}
        />
      )}

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(245, 239, 230, 0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom:
            scrolled || activePanel === "search"
              ? "1px solid var(--border)"
              : "1px solid transparent",
          transition: "border-color 280ms var(--ease-out)",
        }}
      >
        {/* ── Main header row ───────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "20px 32px",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Left: nav links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "26px",
              justifyContent: isRtl ? "flex-end" : "flex-start",
            }}
          >
            {labels.map((label, i) => (
              <NavLink
                key={NAV_HREFS[i]}
                href={NAV_HREFS[i]}
                active={pathname === NAV_HREFS[i]}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Center: wordmark */}
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
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
            lang="en"
          >
            Beltà
          </Link>

          {/* Right: icons + dropdowns + lang toggle */}
          <div
            style={{
              position: "relative",          // anchor for absolute dropdowns
              display: "flex",
              alignItems: "center",
              gap: "16px",
              justifyContent: isRtl ? "flex-start" : "flex-end",
            }}
          >
            <IconButton
              label={lang === "en" ? "Search" : "بحث"}
              active={activePanel === "search"}
              onClick={() => toggle("search")}
            >
              <Search size={18} strokeWidth={1.5} />
            </IconButton>

            <IconButton
              label={lang === "en" ? "Account" : "حسابي"}
              active={activePanel === "account"}
              onClick={() => toggle("account")}
            >
              <User size={18} strokeWidth={1.5} />
            </IconButton>

            <IconButton
              label={lang === "en" ? "Wishlist" : "المفضلة"}
              active={activePanel === "wishlist"}
              onClick={() => toggle("wishlist")}
            >
              <Heart size={18} strokeWidth={1.5} />
            </IconButton>

            {/* Cart + badge */}
            <div style={{ position: "relative", display: "inline-flex" }}>
              <IconButton
                label={lang === "en" ? "Cart" : "السلة"}
                active={activePanel === "cart"}
                onClick={() => toggle("cart")}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
              </IconButton>
              {bagCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    insetInlineEnd: "-8px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "var(--brand)",
                    color: "var(--fg-on-brand)",
                    fontSize: "10px",
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    pointerEvents: "none",
                  }}
                >
                  {bagCount > 9 ? "9+" : bagCount}
                </span>
              )}
            </div>

            {/* Language toggle */}
            <button
              onClick={handleLangToggle}
              aria-label="Toggle language"
              style={{
                display: "flex",
                alignItems: "center",
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                borderInlineStart: "1px solid var(--border)",
                paddingInlineStart: "14px",
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              <span style={{ color: lang === "en" ? "var(--brand)" : "var(--fg-muted)", transition: "color 280ms var(--ease-out)" }}>EN</span>
              <span style={{ color: "var(--fg-muted)", opacity: 0.5, paddingInline: "6px" }}>|</span>
              <span style={{ color: lang === "ar" ? "var(--brand)" : "var(--fg-muted)", transition: "color 280ms var(--ease-out)" }}>AR</span>
            </button>

            {/* Absolute dropdowns — anchored to the right cluster */}
            <AccountDropdown
              isOpen={activePanel === "account"}
              user={user}
              onSignOut={handleSignOut}
              lang={lang}
            />
            <WishlistDropdown isOpen={activePanel === "wishlist"} lang={lang} />
          </div>
        </div>

        {/* ── Search panel — expands below the header row ───────────────── */}
        <SearchPanel
          isOpen={activePanel === "search"}
          onClose={closeAll}
          lang={lang}
        />
      </nav>

      {/* Cart slide-over — outside nav so it covers full viewport height */}
      <CartPanel
        isOpen={activePanel === "cart"}
        onClose={closeAll}
        lang={lang}
        bagCount={bagCount}
      />
    </>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
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
        fontWeight: 400,
        color: "var(--fg)",
        textDecoration: "none",
        paddingBottom: "2px",
        borderBottom:
          active || hovered
            ? "1px solid var(--belta-terracotta)"
            : "1px solid transparent",
        transition: "border-color 280ms var(--ease-out), color 280ms var(--ease-out)",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Link>
  );
}

function IconButton({
  label,
  children,
  onClick,
  active = false,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      aria-label={label}
      onClick={onClick}
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
        color: active || hovered ? "var(--brand)" : "var(--fg)",
        transition: "color 280ms var(--ease-out)",
        borderRadius: "var(--radius-md)",
        outline: "none",
      }}
    >
      {children}
    </button>
  );
}
