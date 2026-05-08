"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Types ────────────────────────────────────────────────────────────────── */

export interface ProductFormValues {
  name:          string;
  name_ar:       string;
  material:      string;
  material_ar:   string;
  material_type: "silk" | "cotton" | "modal";
  price:         string;
  badgeType:     "" | "new" | "final" | "custom";
  badgeLabel:    string;
  active:        boolean;
}

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit:       (values: ProductFormValues) => Promise<void>;
  submitLabel:    string;
}

const DEFAULTS: ProductFormValues = {
  name:          "",
  name_ar:       "",
  material:      "",
  material_ar:   "",
  material_type: "silk",
  price:         "",
  badgeType:     "",
  badgeLabel:    "",
  active:        true,
};

/* ── Main form ────────────────────────────────────────────────────────────── */

export default function ProductForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const [values, setValues]   = useState<ProductFormValues>({ ...DEFAULTS, ...defaultValues });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const set =
    <K extends keyof ProductFormValues>(key: K) =>
    (val: ProductFormValues[K]) =>
      setValues((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      {/* Name row */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <Field label="Name (English)" required>
          <TextInput
            value={values.name}
            onChange={set("name")}
            placeholder="e.g. Carmin"
            required
          />
        </Field>
        <Field label="الاسم بالعربية">
          <TextInput
            value={values.name_ar}
            onChange={set("name_ar")}
            placeholder="مثال: كارمين"
            dir="rtl"
            arabicFont
          />
        </Field>
      </div>

      {/* Material row */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <Field label="Material (English)" required>
          <TextInput
            value={values.material}
            onChange={set("material")}
            placeholder="e.g. 100% Silk"
            required
          />
        </Field>
        <Field label="المادة بالعربية">
          <TextInput
            value={values.material_ar}
            onChange={set("material_ar")}
            placeholder="مثال: حرير 100%"
            dir="rtl"
            arabicFont
          />
        </Field>
      </div>

      {/* Material type + Price */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <Field label="Material type" required>
          <SelectInput
            value={values.material_type}
            onChange={(v) => set("material_type")(v as "silk" | "cotton" | "modal")}
          >
            <option value="silk">Silk</option>
            <option value="cotton">Cotton</option>
            <option value="modal">Modal</option>
          </SelectInput>
        </Field>
        <Field label="Price" required>
          <TextInput
            value={values.price}
            onChange={set("price")}
            placeholder="e.g. $120"
            required
          />
        </Field>
      </div>

      {/* Badge */}
      <Field label="Badge">
        <SelectInput
          value={values.badgeType}
          onChange={(v) => set("badgeType")(v as ProductFormValues["badgeType"])}
        >
          <option value="">None</option>
          <option value="new">New</option>
          <option value="final">Final piece</option>
          <option value="custom">Custom text…</option>
        </SelectInput>
        {values.badgeType === "custom" && (
          <div style={{ marginTop: "8px" }}>
            <TextInput
              value={values.badgeLabel}
              onChange={set("badgeLabel")}
              placeholder="e.g. 42 pieces"
              required
            />
          </div>
        )}
      </Field>

      {/* Active */}
      <div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={values.active}
            onChange={(e) => set("active")(e.target.checked)}
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "4px",
              accentColor: "var(--brand)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              color: "var(--fg)",
            }}
          >
            Active{" "}
            <span style={{ color: "var(--fg-subtle)" }}>
              (visible in the storefront)
            </span>
          </span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--danger)",
            margin: 0,
          }}
        >
          {error}
        </p>
      )}

      {/* Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          paddingTop: "8px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <SubmitButton loading={loading} label={submitLabel} />
        <Link
          href="/admin/products"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--fg-muted)",
            textDecoration: "none",
            transition: "color 180ms var(--ease-out)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--fg)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--fg-muted)")
          }
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

/* ── Field wrapper ────────────────────────────────────────────────────────── */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
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
            <span
              style={{ color: "var(--danger)", marginInlineStart: "2px" }}
            >
              *
            </span>
          )}
        </label>
      )}
      {children}
    </div>
  );
}

/* ── Text input ───────────────────────────────────────────────────────────── */

function TextInput({
  value,
  onChange,
  placeholder,
  required,
  dir,
  arabicFont,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
  arabicFont?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      dir={dir}
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
        fontFamily: arabicFont ? "var(--font-arabic)" : "var(--font-body)",
        fontSize: "14px",
        color: "var(--fg)",
        outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(139,69,19,0.15)" : "none",
        transition:
          "border-color 280ms var(--ease-out), box-shadow 280ms var(--ease-out)",
        boxSizing: "border-box",
      }}
    />
  );
}

/* ── Select input ─────────────────────────────────────────────────────────── */

function SelectInput({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        padding: "11px 36px 11px 14px",
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
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238A766A' stroke-width='1.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        boxSizing: "border-box",
      }}
    >
      {children}
    </select>
  );
}

/* ── Submit button ────────────────────────────────────────────────────────── */

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: "0.01em",
        padding: "12px 24px",
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
      }}
    >
      {loading ? "Saving…" : label}
    </button>
  );
}
