import type { CSSProperties } from "react";

type Mode = "lifestyle" | "product";
type Kind = "hero" | "card" | "secondary";

interface PhotoZoneProps {
  mode?: Mode;
  kind?: Kind;
  src?: string;
  style?: CSSProperties;
  className?: string;
}

export default function PhotoZone({
  src,
  style,
  className,
}: PhotoZoneProps) {
  if (src) {
    return (
      <div
        className={className}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          ...style,
        }}
      >
        <img
          src={src}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "var(--surface-soft)",
        overflow: "hidden",
        ...style,
      }}
    />
  );
}
