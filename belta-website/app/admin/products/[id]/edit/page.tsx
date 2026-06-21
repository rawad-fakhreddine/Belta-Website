"use client";

export const dynamic = "force-dynamic";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, type ProductRow } from "@/lib/supabase";

type BadgeType = "" | "new" | "final" | "other";

interface FormState {
  name:          string;
  name_ar:       string;
  material:      string;
  material_ar:   string;
  material_type: "silk" | "cotton" | "modal";
  price:         string;
  badgeType:     BadgeType;
  badgeLabel:    string;
  active:        boolean;
}

function dbToForm(p: ProductRow): FormState {
  let badgeType: BadgeType   = "";
  let badgeLabel             = "";
  if (p.badge === "new")     { badgeType = "new"; }
  if (p.badge === "final")   { badgeType = "final"; }
  if (p.badge === "count")   { badgeType = "other"; badgeLabel = p.badge_label ?? ""; }
  return {
    name:          p.name,
    name_ar:       p.name_ar       ?? "",
    material:      p.material,
    material_ar:   p.material_ar   ?? "",
    material_type: p.material_type,
    price:         p.price,
    badgeType,
    badgeLabel,
    active:        p.active,
  };
}

type Params = Promise<{ id: string }>;

export default function EditProductPage({ params }: { params: Params }) {
  const { id }   = use(params);
  const router   = useRouter();

  const [product, setProduct]   = useState<ProductRow | null>(null);
  const [form, setForm]         = useState<FormState | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", Number(id))
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); }
        else { setProduct(data); setForm(dbToForm(data)); }
        setLoadingPage(false);
      });
  }, [id]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => f ? { ...f, [k]: v } : f);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);

    let badge:       "new" | "count" | "final" | null = null;
    let badge_label: string | null                     = null;
    if (form.badgeType === "new")   { badge = "new";   }
    if (form.badgeType === "final") { badge = "final"; }
    if (form.badgeType === "other") { badge = "count"; badge_label = form.badgeLabel || null; }

    const { error: dbErr } = await supabase
      .from("products")
      .update({
        name:          form.name,
        name_ar:       form.name_ar      || null,
        material:      form.material,
        material_ar:   form.material_ar  || null,
        material_type: form.material_type,
        price:         form.price,
        badge,
        badge_label,
        active:        form.active,
      })
      .eq("id", Number(id));

    if (dbErr) { setError(dbErr.message); setSaving(false); return; }
    router.push("/admin/products");
  };

  if (loadingPage) return <Skeleton />;
  if (notFound || !form) return <NotFound />;

  return (
    <div className="belta-admin-content-pad" style={{ padding: "40px 48px", maxWidth: "860px" }}>
      {/* Heading */}
      <div style={{ marginBottom: "36px" }}>
        <p style={eyebrow}>Products</p>
        <h1 style={pageTitle}>
          Edit{" "}
          <em style={{ color: "#8B4513", fontStyle: "italic" }}>{product?.name}</em>
        </h1>
      </div>

      {/* Card */}
      <div style={cardStyle}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          <Row>
            <Field label="Name (English)" required>
              <Input value={form.name} onChange={(v) => set("name", v)} placeholder="e.g. Carmin" required />
            </Field>
            <Field label="الاسم بالعربية">
              <Input value={form.name_ar} onChange={(v) => set("name_ar", v)} placeholder="مثال: كارمين" dir="rtl" arabic />
            </Field>
          </Row>

          <Row>
            <Field label="Material (English)" required>
              <Input value={form.material} onChange={(v) => set("material", v)} placeholder="e.g. 100% Silk" required />
            </Field>
            <Field label="المادة بالعربية">
              <Input value={form.material_ar} onChange={(v) => set("material_ar", v)} placeholder="مثال: حرير 100%" dir="rtl" arabic />
            </Field>
          </Row>

          <Row>
            <Field label="Material type" required>
              <Select value={form.material_type} onChange={(v) => set("material_type", v as FormState["material_type"])}>
                <option value="silk">Silk</option>
                <option value="cotton">Cotton</option>
                <option value="modal">Modal</option>
              </Select>
            </Field>
            <Field label="Price" required>
              <Input value={form.price} onChange={(v) => set("price", v)} placeholder="e.g. 120" type="number" min="0" required />
            </Field>
          </Row>

          <Field label="Badge">
            <Select value={form.badgeType} onChange={(v) => set("badgeType", v as BadgeType)}>
              <option value="">None</option>
              <option value="new">NEW</option>
              <option value="final">FINAL PIECE</option>
              <option value="other">Other…</option>
            </Select>
            {form.badgeType === "other" && (
              <div style={{ marginTop: "8px" }}>
                <Input value={form.badgeLabel} onChange={(v) => set("badgeLabel", v)} placeholder="e.g. 42 pieces" required />
              </div>
            )}
          </Field>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              style={{ width: "18px", height: "18px", borderRadius: "4px", accentColor: "#8B4513", cursor: "pointer", flexShrink: 0 }}
            />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#2C1810" }}>
              Active{" "}
              <span style={{ color: "#8A766A" }}>(visible in the storefront)</span>
            </span>
          </label>

          {error && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#A23A26", margin: 0 }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingTop: "8px", borderTop: "1px solid #E2D5C3" }}>
            <SubmitBtn loading={saving} label="Save changes" />
            <Link
              href="/admin/products"
              style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#8B4513", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Shared style tokens ──────────────────────────────────────────────────── */

const eyebrow: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500,
  letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A766A", margin: "0 0 8px",
};
const pageTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)", fontSize: "40px", fontWeight: 600,
  color: "#2C1810", margin: 0, lineHeight: 1.2,
};
const cardStyle: React.CSSProperties = {
  background: "#FBF7F0", border: "1px solid #E2D5C3",
  borderRadius: "14px", boxShadow: "0 2px 6px rgba(44,24,16,0.06)", padding: "32px",
};

/* ── Field components (same as new page) ─────────────────────────────────── */

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, color: "#5A4438", letterSpacing: "0.02em" }}>
          {label}
          {required && <span style={{ color: "#A23A26", marginInlineStart: "2px" }}>*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, required, dir, arabic, type, min }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  required?: boolean; dir?: "ltr" | "rtl"; arabic?: boolean; type?: string; min?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type ?? "text"} min={min} value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} required={required} dir={dir}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "11px 14px",
        border: focused ? "1px solid #8B4513" : "1px solid #C9B8A3",
        borderRadius: "8px", background: "#FBF7F0",
        fontFamily: arabic ? "var(--font-arabic)" : "var(--font-body)",
        fontSize: "14px", color: "#2C1810", outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(139,69,19,0.15)" : "none",
        transition: "border-color 280ms var(--ease-out), box-shadow 280ms var(--ease-out)",
        boxSizing: "border-box",
      }}
    />
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value} onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "11px 36px 11px 14px",
        border: focused ? "1px solid #8B4513" : "1px solid #C9B8A3",
        borderRadius: "8px", background: "#FBF7F0",
        fontFamily: "var(--font-body)", fontSize: "14px", color: "#2C1810",
        outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(139,69,19,0.15)" : "none",
        transition: "border-color 280ms var(--ease-out), box-shadow 280ms var(--ease-out)",
        cursor: "pointer", appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238A766A' stroke-width='1.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
        boxSizing: "border-box",
      }}
    >
      {children}
    </select>
  );
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="submit" disabled={loading}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500,
        letterSpacing: "0.01em", padding: "12px 24px", borderRadius: "8px", border: "none",
        background: loading ? "#A8623A" : hovered ? "#6E3610" : "#8B4513",
        color: "#F5EFE6", cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.72 : 1, transition: "background 280ms var(--ease-out)", lineHeight: 1,
      }}
    >
      {loading ? "Saving…" : label}
    </button>
  );
}

function Skeleton() {
  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ height: "44px", width: "260px", background: "#E8DDC9", borderRadius: "8px", marginBottom: "40px", animation: "belta-pulse 1.5s ease-in-out infinite" }} />
      <div style={{ height: "480px", background: "#FBF7F0", border: "1px solid #E2D5C3", borderRadius: "14px" }} />
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: "40px 48px" }}>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#A23A26" }}>
        Product not found.
      </p>
    </div>
  );
}
