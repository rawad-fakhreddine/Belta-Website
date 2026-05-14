"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase, type ProductRow } from "@/lib/supabase";
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
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [status, setStatus]   = useState<"loading" | "found" | "not-found">("loading");
  const [lang, setLang]       = useState<"en" | "ar">("en");

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("active", true)
        .single();

      if (error || !data) {
        setStatus("not-found");
        return;
      }
      setProduct(data as ProductRow);
      setStatus("found");
    }
    fetchProduct();
  }, [id]);

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
          }}
        >
          {/* Back link */}
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
            ← {lang === "en" ? "Collection" : "المجموعة"}
          </Link>

          {status === "loading" && (
            <div className="belta-product-detail-layout">
              <div
                style={{
                  aspectRatio: "4 / 5",
                  borderRadius: "var(--radius-xl)",
                  background: "var(--belta-cream-deep)",
                  animation: "belta-pulse 1.6s ease-in-out infinite",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "24px" }}>
                {[70, 50, 40, 30].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      height: i === 0 ? "40px" : "18px",
                      width: `${w}%`,
                      borderRadius: "var(--radius-sm)",
                      background: "var(--belta-cream-deep)",
                      animation: `belta-pulse 1.6s ease-in-out infinite ${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {status === "not-found" && (
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
          )}

          {status === "found" && product && (
            <div className="belta-product-detail-layout">
              {/* Image */}
              <div
                style={{
                  aspectRatio: "4 / 5",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  background: "var(--surface)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <PhotoZone />
              </div>

              {/* Info */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0",
                  paddingTop: "8px",
                }}
              >
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

                {/* Name */}
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--fs-h1)",
                    fontWeight: 600,
                    lineHeight: "var(--lh-tight)",
                    letterSpacing: "var(--tracking-tight)",
                    color: "var(--fg)",
                    margin: "0 0 8px",
                  }}
                >
                  {lang === "ar" && product.name_ar ? product.name_ar : product.name}
                </h1>

                {/* Arabic name (shown in EN mode if available) */}
                {lang === "en" && product.name_ar && (
                  <p
                    style={{
                      fontFamily: "var(--font-arabic)",
                      fontSize: "22px",
                      color: "var(--fg-muted)",
                      margin: "0 0 24px",
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
                    margin: "0 0 24px",
                    lineHeight: "var(--lh-normal)",
                  }}
                >
                  {lang === "ar" && product.material_ar ? product.material_ar : product.material}
                </p>

                {/* Price */}
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "32px",
                    fontWeight: 400,
                    color: "var(--fg)",
                    margin: "0 0 40px",
                    lineHeight: "var(--lh-snug)",
                  }}
                >
                  {product.price}
                </p>

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    background: "var(--border)",
                    marginBottom: "40px",
                  }}
                />

                {/* WhatsApp CTA */}
                <WhatsAppButton lang={lang} productName={product.name} />

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
        .belta-product-detail-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .belta-product-detail-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </>
  );
}

function WhatsAppButton({ lang, productName }: { lang: "en" | "ar"; productName: string }) {
  const [hovered, setHovered] = useState(false);
  const message = lang === "en"
    ? `Hi! I'm interested in ordering the ${productName} scarf.`
    : `مرحبا! أريد طلب وشاح ${productName}.`;
  const href = `https://wa.me/96170000000?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        fontFamily: "var(--font-body)",
        fontSize: "15px",
        fontWeight: 500,
        letterSpacing: "0.01em",
        padding: "14px 28px",
        borderRadius: "var(--radius-md)",
        background: hovered ? "var(--brand-hover)" : "var(--brand)",
        color: "var(--fg-on-brand)",
        textDecoration: "none",
        transition: "background 280ms var(--ease-out)",
        lineHeight: 1,
        minHeight: "52px",
      }}
    >
      <WhatsAppIcon />
      {lang === "en" ? "Order via WhatsApp" : "اطلبي عبر واتساب"}
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );
}
