// ─── Brand palette ────────────────────────────────────────────────────────────

export const COLOR = {
  // Brand
  terracotta:      "#8B4513",
  terracottaDeep:  "#6E3610",
  terracottaSoft:  "#A8623A",

  // Cream
  cream:           "#F5EFE6",
  creamWarm:       "#EFE7DA",
  creamDeep:       "#E8DDC9",

  // Blush
  blush:           "#E8C9C1",
  blushSoft:       "#F2DDD7",

  // Sage
  sage:            "#B5C4B1",
  sageSoft:        "#CFD8CC",

  // Brown
  brown:           "#2C1810",
  brownSoft:       "#5A4438",
  brownMute:       "#8A766A",

  // Semantic — backgrounds
  bg:              "#F5EFE6",
  bgAlt:           "#EFE7DA",
  bgRaised:        "#FBF7F0",
  bgInverse:       "#2C1810",

  // Semantic — surfaces
  surface:         "#FBF7F0",
  surfaceSoft:     "#EFE7DA",
  surfaceBlush:    "#F2DDD7",
  surfaceSage:     "#CFD8CC",

  // Semantic — foreground
  fg:              "#2C1810",
  fgMuted:         "#5A4438",
  fgSubtle:        "#8A766A",
  fgOnDark:        "#F5EFE6",
  fgOnBrand:       "#F5EFE6",

  // Semantic — brand
  brand:           "#8B4513",
  brandHover:      "#6E3610",
  brandSoft:       "#A8623A",

  // Semantic — accents
  accent:          "#E8C9C1",
  accent2:         "#B5C4B1",

  // Semantic — borders
  border:          "#E2D5C3",
  borderStrong:    "#C9B8A3",
  borderOnDark:    "#4A2E22",

  // Semantic — links
  link:            "#8B4513",
  linkHover:       "#6E3610",

  // Status
  success:         "#7E9476",
  warning:         "#C68B3F",
  danger:          "#A23A26",
  info:            "#6E574A",
} as const;

// ─── Font families ─────────────────────────────────────────────────────────────

export const FONT = {
  display: '"Cormorant Garamond", "EB Garamond", Georgia, "Times New Roman", serif',
  body:    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  arabic:  '"Noto Naskh Arabic", "Noto Serif Arabic", "Amiri", "Times New Roman", serif',
  mono:    'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const;

// ─── Type scale ────────────────────────────────────────────────────────────────

export const FS = {
  display: "72px",
  h1:      "56px",
  h2:      "40px",
  h3:      "28px",
  h4:      "22px",
  lead:    "19px",
  body:    "16px",
  small:   "14px",
  caption: "12px",
  eyebrow: "11px",
} as const;

// ─── Line-heights ──────────────────────────────────────────────────────────────

export const LH = {
  tight:   1.05,
  snug:    1.2,
  normal:  1.5,
  relaxed: 1.7,
} as const;

// ─── Letter-spacing ────────────────────────────────────────────────────────────

export const TRACKING = {
  display: "-0.01em",
  tight:   "-0.005em",
  normal:  "0",
  wide:    "0.04em",
  eyebrow: "0.18em",
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const SPACE = {
  1:  "4px",
  2:  "8px",
  3:  "12px",
  4:  "16px",
  5:  "24px",
  6:  "32px",
  7:  "48px",
  8:  "64px",
  9:  "96px",
  10: "128px",
} as const;

// ─── Radii ────────────────────────────────────────────────────────────────────

export const RADIUS = {
  xs:   "2px",
  sm:   "4px",
  md:   "8px",
  lg:   "14px",
  xl:   "20px",
  pill: "999px",
} as const;

// ─── Motion ───────────────────────────────────────────────────────────────────

export const EASE = {
  out:    "cubic-bezier(0.22, 0.61, 0.36, 1)",
  inOut:  "cubic-bezier(0.65, 0, 0.35, 1)",
  soft:   "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const DUR = {
  fast:      "180ms",
  base:      "280ms",
  slow:      "520ms",
  editorial: "800ms",
} as const;

// ─── Layout ───────────────────────────────────────────────────────────────────

export const LAYOUT = {
  container:       "1240px",
  containerNarrow: "880px",
  gutter:          "24px",
} as const;

// ─── CSS variable references (for use in inline styles) ───────────────────────

export const VAR = {
  // backgrounds
  bg:           "var(--bg)",
  bgAlt:        "var(--bg-alt)",
  bgRaised:     "var(--bg-raised)",
  bgInverse:    "var(--bg-inverse)",
  // surfaces
  surface:      "var(--surface)",
  // foreground
  fg:           "var(--fg)",
  fgMuted:      "var(--fg-muted)",
  fgSubtle:     "var(--fg-subtle)",
  fgOnDark:     "var(--fg-on-dark)",
  fgOnBrand:    "var(--fg-on-brand)",
  // brand
  brand:        "var(--brand)",
  brandHover:   "var(--brand-hover)",
  // accents
  accent:       "var(--accent)",
  accent2:      "var(--accent-2)",
  // borders
  border:       "var(--border)",
  borderStrong: "var(--border-strong)",
  // shadows
  shadowXs:     "var(--shadow-xs)",
  shadowSm:     "var(--shadow-sm)",
  shadowMd:     "var(--shadow-md)",
  shadowLg:     "var(--shadow-lg)",
  shadowXl:     "var(--shadow-xl)",
  // fonts
  fontDisplay:  "var(--font-display)",
  fontBody:     "var(--font-body)",
  fontArabic:   "var(--font-arabic)",
} as const;
