"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
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
  const [scrolled, setScrolled]       = useState(false);
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [user, setUser]               = useState<SupabaseUser | null>(null);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const labels    = NAV_LINKS[lang];
  const isRtl     = lang === "ar";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setActivePanel(null); setMobileOpen(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close everything on route change
  useEffect(() => { setActivePanel(null); setMobileOpen(false); }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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
    setMobileOpen(false);
  };

  const dropdownOpen = activePanel === "account" || activePanel === "wishlist";

  const navStyle: React.CSSProperties = {
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
  };

  return (
    <>
      {/* Backdrop for account/wishlist dropdowns */}
      {dropdownOpen && (
        <div
          onClick={closeAll}
          style={{ position: "fixed", inset: 0, zIndex: 49 }}
        />
      )}

      <nav style={navStyle}>
        {/* ── DESKTOP header (hidden on mobile) ─────────────────────────── */}
        <div
          className="belta-nav-desktop"
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "20px 32px",
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
            lang="en"
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
          >
            Beltà
          </Link>

          {/* Right: icons + lang toggle */}
          <div
            style={{
              position: "relative",
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

            <div style={{ position: "relative", display: "inline-flex" }}>
              <IconButton
                label={lang === "en" ? "Cart" : "السلة"}
                active={activePanel === "cart"}
                onClick={() => toggle("cart")}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
              </IconButton>
              <CartBadge count={bagCount} />
            </div>

            <LangToggle lang={lang} onToggle={handleLangToggle} />

            <AccountDropdown
              isOpen={activePanel === "account"}
              user={user}
              onSignOut={handleSignOut}
              lang={lang}
            />
            <WishlistDropdown isOpen={activePanel === "wishlist"} lang={lang} />
          </div>
        </div>

        {/* ── MOBILE header (hidden on desktop) ─────────────────────────── */}
        <div
          className="belta-nav-mobile"
          style={{
            padding: "0 16px",
            height: "60px",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          {/* Hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="belta-touch"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--fg)",
              borderRadius: "var(--radius-md)",
              flexShrink: 0,
            }}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          {/* Wordmark — centered */}
          <Link
            href="/"
            lang="en"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 500,
              color: "var(--belta-terracotta)",
              letterSpacing: "-0.01em",
              textDecoration: "none",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            Beltà
          </Link>

          {/* Right: search + cart only */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            <IconButton
              label={lang === "en" ? "Search" : "بحث"}
              active={activePanel === "search"}
              onClick={() => toggle("search")}
            >
              <Search size={18} strokeWidth={1.5} />
            </IconButton>

            <div style={{ position: "relative", display: "inline-flex" }}>
              <IconButton
                label={lang === "en" ? "Cart" : "السلة"}
                active={activePanel === "cart"}
                onClick={() => toggle("cart")}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
              </IconButton>
              <CartBadge count={bagCount} />
            </div>
          </div>
        </div>

        {/* Search panel (works on both) */}
        <SearchPanel
          isOpen={activePanel === "search"}
          onClose={closeAll}
          lang={lang}
        />
      </nav>

      {/* ── MOBILE full-screen drawer ──────────────────────────────────────── */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "#F5EFE6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "belta-drawer-in 280ms var(--ease-out)",
          }}
        >
          {/* Close button */}
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="belta-touch"
            style={{
              position: "absolute",
              top: "12px",
              insetInlineEnd: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--fg)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          {/* Nav links */}
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "32px",
            }}
          >
            {labels.map((label, i) => (
              <Link
                key={NAV_HREFS[i]}
                href={NAV_HREFS[i]}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "18px",
                  fontWeight: pathname === NAV_HREFS[i] ? 500 : 400,
                  color: pathname === NAV_HREFS[i] ? "var(--brand)" : "var(--fg)",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  lineHeight: 1,
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Lang toggle */}
          <button
            onClick={handleLangToggle}
            aria-label="Toggle language"
            style={{
              marginTop: "48px",
              display: "flex",
              alignItems: "center",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              cursor: "pointer",
              lineHeight: 1,
              minHeight: "44px",
            }}
          >
            <span style={{ color: lang === "en" ? "var(--brand)" : "var(--fg-muted)" }}>EN</span>
            <span style={{ color: "var(--fg-muted)", opacity: 0.5, paddingInline: "6px" }}>|</span>
            <span style={{ color: lang === "ar" ? "var(--brand)" : "var(--fg-muted)" }}>AR</span>
          </button>
        </div>
      )}

      {/* Cart slide-over */}
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
      className="belta-touch"
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

function CartBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
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
      {count > 9 ? "9+" : count}
    </span>
  );
}

function LangToggle({ lang, onToggle }: { lang: "en" | "ar"; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle language"
      className="belta-touch"
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
  );
}
