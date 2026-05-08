"use client";

import { useState } from "react";

type ToggleValue = "lifestyle" | "product";
type ToggleSize  = "md" | "sm";
type ToggleVariant = "on-image" | "inline";

interface StyledProductToggleProps {
  value: ToggleValue;
  onChange: (v: ToggleValue) => void;
  size?: ToggleSize;
  variant?: ToggleVariant;
}

const PILLS: { value: ToggleValue; label: string }[] = [
  { value: "lifestyle", label: "Styled"  },
  { value: "product",   label: "Product" },
];

export default function StyledProductToggle({
  value,
  onChange,
  size = "md",
  variant = "on-image",
}: StyledProductToggleProps) {
  const isSm = size === "sm";

  const wrapperStyle: React.CSSProperties =
    variant === "on-image"
      ? {
          background: "rgba(245, 239, 230, 0.72)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: "999px",
          padding: "3px",
          display: "inline-flex",
          gap: 0,
        }
      : {
          background: "var(--surface)",
          borderRadius: "999px",
          padding: "3px",
          display: "inline-flex",
          gap: 0,
          border: "1px solid var(--border)",
        };

  return (
    <div style={wrapperStyle} role="group" aria-label="Photo mode">
      {PILLS.map((pill) => (
        <Pill
          key={pill.value}
          label={pill.label}
          active={value === pill.value}
          isSm={isSm}
          onClick={() => onChange(pill.value)}
        />
      ))}
    </div>
  );
}

function Pill({
  label,
  active,
  isSm,
  onClick,
}: {
  label: string;
  active: boolean;
  isSm: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: isSm ? "10px" : "11px",
        fontWeight: 500,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        padding: isSm ? "4px 10px" : "6px 14px",
        borderRadius: "999px",
        border: "none",
        cursor: "pointer",
        background: active
          ? "var(--brand)"
          : hovered
          ? "rgba(139, 69, 19, 0.08)"
          : "transparent",
        color: active ? "var(--fg-on-brand)" : "var(--fg)",
        transition: "background 280ms var(--ease-out), color 280ms var(--ease-out)",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
