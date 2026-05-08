import type { CSSProperties } from "react";

type Mode = "lifestyle" | "product";
type Kind = "hero" | "card" | "secondary";

interface PhotoZoneProps {
  mode: Mode;
  kind?: Kind;
  style?: CSSProperties;
  className?: string;
}

const LABEL: Record<Kind, Record<Mode, string>> = {
  hero: {
    lifestyle: "LIFESTYLE PHOTO — woman wearing scarf, warm natural light, editorial style",
    product:   "PRODUCT FLAT SHOT — scarf only",
  },
  card: {
    lifestyle: "LIFESTYLE PHOTO",
    product:   "PRODUCT FLAT SHOT",
  },
  secondary: {
    lifestyle: "LIFESTYLE PHOTO",
    product:   "PRODUCT FLAT SHOT",
  },
};

const GRADIENT: Record<Mode, string> = {
  lifestyle:
    "linear-gradient(135deg, #F2DDD7 0%, #E8C9C1 30%, #C99680 65%, #8B4513 100%)",
  product:
    "radial-gradient(ellipse at center, #FBF7F0 0%, #EFE7DA 60%, #E2D5C3 100%)",
};

const FRAME_COLOR: Record<Mode, string> = {
  lifestyle: "rgba(245, 239, 230, 0.45)",
  product:   "rgba(90, 68, 56, 0.3)",
};

const LABEL_COLOR: Record<Mode, string> = {
  lifestyle: "rgba(245, 239, 230, 0.92)",
  product:   "#5A4438",
};

export default function PhotoZone({
  mode,
  kind = "card",
  style,
  className,
}: PhotoZoneProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: GRADIENT[mode],
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Dashed inner frame */}
      <div
        style={{
          position: "absolute",
          inset: "14px",
          border: `1px dashed ${FRAME_COLOR[mode]}`,
          borderRadius: "inherit",
          pointerEvents: "none",
        }}
      />

      {/* Bottom label */}
      <div
        style={{
          position: "absolute",
          bottom: "22px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          padding: "0 28px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: kind === "hero" ? "11px" : "10px",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: LABEL_COLOR[mode],
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {LABEL[kind][mode]}
        </span>
      </div>
    </div>
  );
}
