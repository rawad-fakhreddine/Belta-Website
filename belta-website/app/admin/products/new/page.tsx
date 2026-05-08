"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

const INIT: FormState = {
  name: "", name_ar: "", material: "", material_ar: "",
  material_type: "silk", price: "", badgeType: "", badgeLabel: "", active: true,
};

export default function NewProductPage() {
  const router           = useRouter();
  const [form, setForm]  = useState<FormState>(INIT);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let badge:       "new" | "count" | "final" | null = null;
    let badge_label: string | null                     = null;

    if (form.badgeType === "new")   { badge = "new";   }
    if (form.badgeType === "final") { badge = "final"; }
    if (form.badgeType === "other") { badge = "count"; badge_label = form.badgeLabel || null; }

    const { error: dbErr } = await supabase.from("products").insert({
      name:          form.name,
      name_ar:       form.name_ar      || null,
      material:      form.material,
      material_ar:   form.material_ar  || null,
      material_type: form.material_type,
      price:         form.price,
      badge,
      badge_label,
      active:        form.active,
    });

    if (dbErr) { setError(dbErr.message); setLoading(false); return; }
    router.push("/admin/products");
  };

  return (
    <div className="belta-admin-content-pad" style={{ padding: "40px 48px", maxWidth: "860px" }}>
      {/* Heading */}
      <div style={{ marginBottom: "36px" }}>
        <p style={eyebrow}>Products</p>
        <h1 style={pageTitle}>Add product</h1>
      </div>

      {/* Card */}
      <div style={card}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Name row */}
          <Row>
            <Field label="Name (English)" required>
              <Input value={form.name} onChange={(v) => set("name", v)} placeholder="e.g. Carmin" required />
            </Field>
            <Field label="الاسم بالعربية">
              <Input value={form.name_ar} onChange={(v) => set("name_ar", v)} placeholder="مثال: كارمين" dir="rtl" arabic />
            </Field>
          </Row>

          {/* Material row */}
          <Row>
            <Field label="Material (English)" required>
              <Input value={form.material} onChange={(v) => set("material", v)} placeholder="e.g. 100% Silk" required />
            </Field>
            <Field label="المادة بالعربية">
              <Input value={form.material_ar} onChange={(v) => set("material_ar", v)} placeholder="مثال: حرير 100%" dir="rtl" arabic />
            </Field>
          </Row>

          {/* Type + Price */}
          <Row>
            <Field label="Material type" required>
              <Select value={form.material_type} onChange={(v) => set("material_type", v as FormState["material_type"])}>
                <option value="silk">Silk</option>
                <option value="cotton">Cotton</option>
                <option value="modal">Modal</option>
              </Select>
            </Field>
            <Field label="Price" required>
              <Input
                value={form.price}
                onChange={(v) => set("price", v)}
                placeholder="e.g. 120"
                type="number"
                min="0"
                required
              />
            </Field>
          </Row>

          {/* Badge */}
          <Field label="Badge">
            <Select value={form.badgeType} onChange={(v) => set("badgeType", v as BadgeType)}>
              <option value="">None</option>
              <option value="new">NEW</option>
              <option value="final">FINAL PIECE</option>
              <option value="other">Other…</option>
            </Select>
            {form.badgeType === "other" && (
              <div style={{ marginTop: "8px" }}>
                <Input
                  value={form.badgeLabel}
                  onChange={(v) => set("badgeLabel", v)}
                  placeholder="e.g. 42 pieces"
                  required
                />
              </div>
            )}
          </Field>

          {/* Active */}
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

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingTop: "8px", borderTop: "1px solid #E2D5C3" }}>
            <SubmitBtn loading={loading} label="Add product" />
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

/* ── Shared layout/style tokens ───────────────────────────────────────────── */

const eyebrow: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500,
  letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A766A", margin: "0 0 8px",
};
const pageTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)", fontSize: "40px", fontWeight: 600,
  color: "#2C1810", margin: 0, lineHeight: 1.2,
};
const card: React.CSSProperties = {
  background: "#FBF7F0", border: "1px solid #E2D5C3",
  borderRadius: "14px", boxShadow: "0 2px 6px rgba(44,24,16,0.06)", padding: "32px",
};

/* ── Field components ─────────────────────────────────────────────────────── */

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
      {children}
    </div>
  );
}

function Field({
  label, required, children,
}: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label style={{
          fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500,
          color: "#5A4438", letterSpacing: "0.02em",
        }}>
          {label}
          {required && <span style={{ color: "#A23A26", marginInlineStart: "2px" }}>*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

function Input({
  value, onChange, placeholder, required, dir, arabic, type, min,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
  arabic?: boolean;
  type?: string;
  min?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type ?? "text"}
      min={min}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      dir={dir}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "11px 14px",
        border: focused ? "1px solid #8B4513" : "1px solid #C9B8A3",
        borderRadius: "8px",
        background: "#FBF7F0",
        fontFamily: arabic ? "var(--font-arabic)" : "var(--font-body)",
        fontSize: "14px", color: "#2C1810", outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(139,69,19,0.15)" : "none",
        transition: "border-color 280ms var(--ease-out), box-shadow 280ms var(--ease-out)",
        boxSizing: "border-box",
      }}
    />
  );
}

function Select({
  value, onChange, children,
}: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "11px 36px 11px 14px",
        border: focused ? "1px solid #8B4513" : "1px solid #C9B8A3",
        borderRadius: "8px",
        background: "#FBF7F0",
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500,
        letterSpacing: "0.01em", padding: "12px 24px",
        borderRadius: "8px", border: "none",
        background: loading ? "#A8623A" : hovered ? "#6E3610" : "#8B4513",
        color: "#F5EFE6",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.72 : 1,
        transition: "background 280ms var(--ease-out)", lineHeight: 1,
      }}
    >
      {loading ? "Saving…" : label}
    </button>
  );
}
