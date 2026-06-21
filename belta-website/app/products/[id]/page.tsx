"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { supabase, type ProductRow } from "@/lib/supabase";
import { useCart } from "@/lib/cart";
import PhotoZone from "@/components/PhotoZone";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BADGE_STYLES: Record<string, { background: string; color: string }> = {
  new:   { background: "var(--belta-blush)",     color: "var(--belta-terracotta-deep)" },
  count: { background: "var(--belta-sage-soft)", color: "#3F5238" },
  final: { background: "var(--belta-brown)",     color: "var(--fg-on-dark)" },
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<ProductRow | null>(null);
  const [status,  setStatus]  = useState<"loading" | "found" | "not-found">("loading");
  const [lang,    setLang]    = useState<"en" | "ar">("en");

  // Order form
  const [qty,      setQty]      = useState(1);
  const [custName, setCustName] = useState("");
  const [phone,    setPhone]    = useState("");
  const [address,  setAddress]  = useState("");
  const [email,    setEmail]    = useState("");
  const [added,    setAdded]    = useState(false);
  const [waError,  setWaError]  = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("active", true)
        .single();

      if (error || !data) { setStatus("not-found"); return; }
      setProduct(data as ProductRow);
      setStatus("found");
    }
    fetchProduct();
  }, [id]);

  // Pre-fill order form from signed-in user's profile
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const m = user.user_metadata ?? {};
      if (m.full_name) setCustName(m.full_name);
      if (m.phone)     setPhone(m.phone);
      const addrParts = [m.address, m.city].filter(Boolean);
      if (addrParts.length) setAddress(addrParts.join(", "));
      if (user.email)  setEmail(user.email);
    });
  }, []);

  const handleAddToBag = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name:      product.name,
      name_ar:   product.name_ar,
      material:  product.material,
      price:     product.price,
      quantity:  qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleWhatsApp = () => {
    if (!product) return;
    if (!custName.trim() || !phone.trim() || !address.trim()) {
      setWaError(true);
      setTimeout(() => setWaError(false), 3000);
      return;
    }
    const lines = [
      lang === "en" ? "Hi! I'd like to place an order from Beltà:" : "مرحبا! أريد تقديم طلب من Beltà:",
      "",
      lang === "en" ? `Product: ${product.name}` : `المنتج: ${product.name_ar ?? product.name}`,
      lang === "en" ? `Quantity: ${qty}` : `الكمية: ${qty}`,
      lang === "en" ? `Price: ${product.price}` : `السعر: ${product.price}`,
      "",
      lang === "en" ? `Name: ${custName}` : `الاسم: ${custName}`,
      lang === "en" ? `Phone: ${phone}` : `الهاتف: ${phone}`,
      lang === "en" ? `Address: ${address}` : `العنوان: ${address}`,
      ...(email.trim() ? [lang === "en" ? `Email: ${email}` : `البريد: ${email}`] : []),
    ];
    window.open(
      `https://wa.me/96171483747?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank"
    );
  };

  const isRtl = lang === "ar";

  return (
    <>
      <AnnouncementBar lang={lang} />
      <Navbar lang={lang} onLangChange={setLang} />

      <main style={{ background: "var(--bg)", minHeight: "70vh" }}>
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "40px 32px 96px",
            direction: isRtl ? "rtl" : "ltr",
          }}
        >
          {/* Back link */}
          <BackLink lang={lang} />

          {status === "loading" && <LoadingSkeleton />}

          {status === "not-found" && <NotFound lang={lang} />}

          {status === "found" && product && (
            <div className="belta-pd-layout">

              {/* ── Left: image ──────────────────────────────────────────── */}
              <div
                style={{
                  aspectRatio: "4 / 5",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  background: "var(--surface)",
                  boxShadow: "var(--shadow-md)",
                  position: "sticky",
                  top: "88px",
                }}
              >
                <PhotoZone />
              </div>

              {/* ── Right: info + form ───────────────────────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0", paddingTop: "8px" }}>

                {/* Badge */}
                {product.badge && (
                  <span
                    style={{
                      ...BADGE_STYLES[product.badge],
                      display: "inline-block",
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      fontWeight: 500,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      lineHeight: 1,
                      alignSelf: "flex-start",
                      marginBottom: "20px",
                    }}
                  >
                    {product.badge_label ?? product.badge}
                  </span>
                )}

                {/* Product name */}
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 5vw, 52px)",
                    fontWeight: 600,
                    lineHeight: "var(--lh-tight)",
                    letterSpacing: "var(--tracking-tight)",
                    color: "var(--fg)",
                    margin: "0 0 6px",
                  }}
                >
                  {lang === "ar" && product.name_ar ? product.name_ar : product.name}
                </h1>

                {/* Arabic secondary name */}
                {lang === "en" && product.name_ar && (
                  <p
                    style={{
                      fontFamily: "var(--font-arabic)",
                      fontSize: "20px",
                      color: "var(--fg-muted)",
                      margin: "0 0 16px",
                      lineHeight: "var(--lh-relaxed)",
                    }}
                  >
                    {product.name_ar}
                  </p>
                )}

                {/* Material */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--fs-small)",
                    color: "var(--fg-subtle)",
                    letterSpacing: "0.04em",
                    margin: "0 0 20px",
                    lineHeight: "var(--lh-normal)",
                  }}
                >
                  {lang === "ar" && product.material_ar ? product.material_ar : product.material}
                </p>

                {/* Price */}
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "36px",
                    fontWeight: 400,
                    color: "var(--fg)",
                    margin: "0 0 28px",
                    lineHeight: 1,
                  }}
                >
                  {product.price}
                </p>

                {/* Quantity */}
                <div style={{ marginBottom: "32px" }}>
                  <label
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--fg-muted)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    {lang === "en" ? "Quantity" : "الكمية"}
                  </label>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      border: "1px solid var(--border-strong)",
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                    }}
                  >
                    <StepButton onClick={() => setQty(Math.max(1, qty - 1))} aria="Decrease quantity">
                      <Minus size={14} strokeWidth={2} />
                    </StepButton>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "var(--fg)",
                        minWidth: "48px",
                        textAlign: "center",
                        padding: "10px 4px",
                        userSelect: "none",
                      }}
                    >
                      {qty}
                    </span>
                    <StepButton onClick={() => setQty(qty + 1)} aria="Increase quantity">
                      <Plus size={14} strokeWidth={2} />
                    </StepButton>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "var(--border)", marginBottom: "32px" }} />

                {/* Order details heading */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--fg-muted)",
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    margin: "0 0 20px",
                  }}
                >
                  {lang === "en" ? "Your details" : "بياناتك"}
                </p>

                {/* Form fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
                  <OrderField
                    label={lang === "en" ? "Full name" : "الاسم الكامل"}
                    placeholder={lang === "en" ? "Your name" : "اسمك"}
                    value={custName}
                    onChange={setCustName}
                    required
                  />
                  <OrderField
                    label={lang === "en" ? "Phone number" : "رقم الهاتف"}
                    placeholder={lang === "en" ? "+961 XX XXX XXX" : "٩٦١+"}
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    required
                  />
                  <OrderField
                    label={lang === "en" ? "Address & city" : "العنوان والمدينة"}
                    placeholder={lang === "en" ? "Street, area, city" : "الشارع، المنطقة، المدينة"}
                    value={address}
                    onChange={setAddress}
                    required
                    multiline
                  />
                  <OrderField
                    label={lang === "en" ? "Email (optional)" : "البريد الإلكتروني (اختياري)"}
                    placeholder={lang === "en" ? "your@email.com" : "بريدك الإلكتروني"}
                    type="email"
                    value={email}
                    onChange={setEmail}
                  />
                </div>

                {/* Validation hint */}
                {waError && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      color: "var(--danger)",
                      margin: "0 0 16px",
                      lineHeight: "var(--lh-normal)",
                    }}
                  >
                    {lang === "en"
                      ? "Please fill in your name, phone, and address to order via WhatsApp."
                      : "يرجى ملء الاسم والهاتف والعنوان للطلب عبر واتساب."}
                  </p>
                )}

                {/* CTA buttons */}
                <div className="belta-pd-ctas">
                  {/* Add to bag */}
                  <AddToBagButton added={added} onClick={handleAddToBag} lang={lang} />

                  {/* WhatsApp */}
                  <WhatsAppButton onClick={handleWhatsApp} lang={lang} />
                </div>

                {/* Shipping note */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--fg-subtle)",
                    margin: "20px 0 0",
                    lineHeight: "var(--lh-relaxed)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {lang === "en"
                    ? "Free shipping within Lebanon · Limited pieces"
                    : "شحن مجاني داخل لبنان · طبعات محدودة"}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer lang={lang} />

      <style>{`
        .belta-pd-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: start;
        }
        .belta-pd-ctas {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 768px) {
          .belta-pd-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .belta-pd-ctas {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function BackLink({ lang }: { lang: "en" | "ar" }) {
  return (
    <Link
      href="/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        fontWeight: 500,
        color: "var(--fg-muted)",
        textDecoration: "none",
        letterSpacing: "0.04em",
        marginBottom: "40px",
        transition: "color 180ms var(--ease-out)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
    >
      {lang === "en" ? "← Collection" : "المجموعة →"}
    </Link>
  );
}

function OrderField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required,
  multiline,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  const sharedStyle: React.CSSProperties = {
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
    resize: "none",
    lineHeight: "var(--lh-normal)",
  };

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
        {required && (
          <span style={{ color: "var(--brand)", marginInlineStart: "3px" }}>*</span>
        )}
      </label>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          value={value}
          rows={3}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          style={sharedStyle}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          style={sharedStyle}
        />
      )}
    </div>
  );
}

function StepButton({ onClick, aria, children }: { onClick: () => void; aria: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={aria}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--fg-muted)",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "color 180ms var(--ease-out), background 180ms var(--ease-out)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--bg-alt)";
        (e.currentTarget as HTMLElement).style.color = "var(--fg)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "none";
        (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)";
      }}
    >
      {children}
    </button>
  );
}

function AddToBagButton({ added, onClick, lang }: { added: boolean; onClick: () => void; lang: "en" | "ar" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: "0.01em",
        padding: "14px 20px",
        borderRadius: "var(--radius-md)",
        border: added ? "none" : "1px solid var(--fg)",
        background: added
          ? "var(--success)"
          : hovered
          ? "var(--fg)"
          : "transparent",
        color: added || hovered ? "var(--fg-on-dark)" : "var(--fg)",
        cursor: "pointer",
        transition: "background 280ms var(--ease-out), color 280ms var(--ease-out), border-color 280ms var(--ease-out)",
        lineHeight: 1,
        minHeight: "52px",
      }}
    >
      {added
        ? lang === "en" ? "Added ✓" : "تمت الإضافة ✓"
        : lang === "en" ? "Add to bag" : "أضيفي للحقيبة"}
    </button>
  );
}

function WhatsAppButton({ onClick, lang }: { onClick: () => void; lang: "en" | "ar" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: "0.01em",
        padding: "14px 20px",
        borderRadius: "var(--radius-md)",
        border: "none",
        background: hovered ? "var(--brand-hover)" : "var(--brand)",
        color: "var(--fg-on-brand)",
        cursor: "pointer",
        transition: "background 280ms var(--ease-out)",
        lineHeight: 1,
        minHeight: "52px",
      }}
    >
      <WhatsAppIcon />
      {lang === "en" ? "Order via WhatsApp" : "اطلبي عبر واتساب"}
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="belta-pd-layout">
      <div
        style={{
          aspectRatio: "4 / 5",
          borderRadius: "var(--radius-xl)",
          background: "var(--belta-cream-deep)",
          animation: "belta-pulse 1.6s ease-in-out infinite",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "24px" }}>
        {[60, 40, 80, 30].map((w, i) => (
          <div
            key={i}
            style={{
              height: i === 0 ? "44px" : "18px",
              width: `${w}%`,
              borderRadius: "var(--radius-sm)",
              background: "var(--belta-cream-deep)",
              animation: `belta-pulse 1.6s ease-in-out infinite ${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function NotFound({ lang }: { lang: "en" | "ar" }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--fs-h3)",
          color: "var(--fg-muted)",
          marginBottom: "16px",
        }}
      >
        {lang === "en" ? "Product not found" : "المنتج غير موجود"}
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--brand)",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        }}
      >
        {lang === "en" ? "Back to collection" : "العودة إلى المجموعة"}
      </Link>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );
}
