# Beltà Scarfs — CLAUDE.md

> Single-file handoff for engineering. Everything you need to build a pixel-faithful Beltà site without re-reading the whole design system.
>
> Companion files in this project: `colors_and_type.css` (drop-in tokens + base type), `assets/` (logo, monogram, vendored Lucide icons), `fonts/` (TTFs), `ui_kits/website/` (reference React kit).

---

## 0. Brand in one paragraph

Beltà is a Lebanese boutique scarf house. Voice is editorial, feminine, restrained — closer to a luxury magazine than to a tech product. The world is **warm**: terracotta and cream do 80% of every screen. There is no pure black, no pure white, no cool grays, no bluish gradients, no emoji. Bilingual EN ⇄ AR with Arabic always co-equal (same hierarchy, same visual weight), set right-to-left in `dir="rtl"`.

---

## 1. Colors

All values are exact hex. Use `oklch()` derivatives only if you need additional steps; never invent new hues.

### Brand palette

| Token | Hex | Role |
|---|---|---|
| `--belta-terracotta` | `#8B4513` | Primary brand · all primary buttons · links |
| `--belta-terracotta-deep` | `#6E3610` | Hover / pressed state of brand |
| `--belta-terracotta-soft` | `#A8623A` | Lighter brand accent |
| `--belta-cream` | `#F5EFE6` | Page background — the default canvas |
| `--belta-cream-warm` | `#EFE7DA` | Card background, alt surface |
| `--belta-cream-deep` | `#E8DDC9` | Faint dividers |
| `--belta-blush` | `#E8C9C1` | Accent — tags, "New" badge, soft fills |
| `--belta-blush-soft` | `#F2DDD7` | Hover tint over blush |
| `--belta-sage` | `#B5C4B1` | Secondary — quiet accent for editorial moments |
| `--belta-sage-soft` | `#CFD8CC` | Sage fill |
| `--belta-brown` | `#2C1810` | Body text · footer / announcement-bar background |
| `--belta-brown-soft` | `#5A4438` | Secondary text |
| `--belta-brown-mute` | `#8A766A` | Tertiary text, captions |

### Semantic tokens (preferred — use these, not raw hex)

| Token | Hex | Notes |
|---|---|---|
| `--bg` | `#F5EFE6` | Page |
| `--bg-alt` | `#EFE7DA` | Alt surface |
| `--bg-raised` | `#FBF7F0` | Slight lift over cream (form inputs, etc.) |
| `--bg-inverse` | `#2C1810` | Footer, announcement bar |
| `--surface` | `#FBF7F0` | Card surface |
| `--surface-soft` | `#EFE7DA` | |
| `--surface-blush` | `#F2DDD7` | |
| `--surface-sage` | `#CFD8CC` | |
| `--fg` | `#2C1810` | Primary text |
| `--fg-muted` | `#5A4438` | Secondary text |
| `--fg-subtle` | `#8A766A` | Tertiary text, captions |
| `--fg-on-dark` | `#F5EFE6` | Cream text on brown / terracotta |
| `--fg-on-brand` | `#F5EFE6` | Cream on terracotta button |
| `--brand` | `#8B4513` | |
| `--brand-hover` | `#6E3610` | |
| `--brand-soft` | `#A8623A` | |
| `--accent` | `#E8C9C1` | Blush |
| `--accent-2` | `#B5C4B1` | Sage |
| `--border` | `#E2D5C3` | Hairline |
| `--border-strong` | `#C9B8A3` | Emphasis border |
| `--border-on-dark` | `#4A2E22` | On brown surfaces |
| `--link` | `#8B4513` | |
| `--link-hover` | `#6E3610` | |

### Status colors (warm — never flat reds/greens)

| Token | Hex | Use |
|---|---|---|
| `--success` | `#7E9476` | Sage-derived; order confirmed |
| `--warning` | `#C68B3F` | Warm amber; low stock |
| `--danger` | `#A23A26` | Warm rust; form error |
| `--info` | `#6E574A` | Warm brown; neutral notice |

### Forbidden

`#000`, `#fff`, any cool gray (`#888` etc.), blue / purple / cyan, neon. If a value isn't in the table above or one of its `oklch` neighbors, it isn't Beltà.

---

## 2. Type

Three families, three jobs. **Loaded from local TTFs in `fonts/`** — no Google Fonts CDN.

| Family | Files | Job |
|---|---|---|
| **Cormorant Garamond** | `CormorantGaramond-Regular.ttf` (400), `CormorantGaramond-SemiBold.ttf` (600) | Display, headings, prices, product names, the Beltà wordmark. Italic = accent. |
| **Inter** | `Inter_18pt-Regular.ttf` (400), `Inter_18pt-Medium.ttf` (500) | Body, UI, navigation, labels, eyebrows. |
| **Noto Naskh Arabic** | `NotoNaskhArabic-Regular.ttf` (400) | Every Arabic glyph, headings and body alike. |

### `@font-face` (already declared in `colors_and_type.css`)

```css
@font-face { font-family: "Cormorant Garamond"; src: url("fonts/CormorantGaramond-Regular.ttf") format("truetype"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Cormorant Garamond"; src: url("fonts/CormorantGaramond-SemiBold.ttf") format("truetype"); font-weight: 500 700; font-display: swap; }
@font-face { font-family: "Inter"; src: url("fonts/Inter_18pt-Regular.ttf") format("truetype"); font-weight: 300 400; font-display: swap; }
@font-face { font-family: "Inter"; src: url("fonts/Inter_18pt-Medium.ttf") format("truetype"); font-weight: 500 700; font-display: swap; }
@font-face { font-family: "Noto Naskh Arabic"; src: url("fonts/NotoNaskhArabic-Regular.ttf") format("truetype"); font-weight: 400 700; font-display: swap; }
```

### Family CSS vars

```css
--font-display: "Cormorant Garamond", "EB Garamond", Georgia, "Times New Roman", serif;
--font-body:    "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
--font-arabic:  "Noto Naskh Arabic", "Noto Serif Arabic", "Amiri", "Times New Roman", serif;
--font-mono:    ui-monospace, "SF Mono", Menlo, Consolas, monospace;
```

### Type scale

| Token | Size | Use |
|---|---|---|
| `--fs-display` | 72 px | Hero |
| `--fs-h1` | 56 px | Page title |
| `--fs-h2` | 40 px | Section title |
| `--fs-h3` | 28 px | Subsection |
| `--fs-h4` | 22 px | Card title |
| `--fs-lead` | 19 px | Body lead-in |
| `--fs-body` | 16 px | Default body |
| `--fs-small` | 14 px | Secondary body |
| `--fs-caption` | 12 px | Captions / specs |
| `--fs-eyebrow` | 11 px | Small all-caps tracked label |

### Line-height & tracking

| Token | Value |
|---|---|
| `--lh-tight` | 1.05 (display, h1) |
| `--lh-snug` | 1.2 (h2–h4) |
| `--lh-normal` | 1.5 |
| `--lh-relaxed` | 1.7 (body, AR text) |
| `--tracking-display` | -0.01em |
| `--tracking-tight` | -0.005em |
| `--tracking-normal` | 0 |
| `--tracking-wide` | 0.04em |
| `--tracking-eyebrow` | 0.18em (always for eyebrows) |

### Casing rules

- **Sentence case** for everything: headings, CTAs, nav labels, microcopy.
- **ALL CAPS** *only* for the eyebrow micro-label above titles, with `letter-spacing: 0.18em`.
- Italic via `<em>` is allowed on display headings (often colored `var(--brand)`).

### Bilingual rules

- Arabic gets its own family (`var(--font-arabic)`), set on `[lang="ar"]` and `[dir="rtl"]`.
- Set `dir="rtl"` on `<html>` (or the wrapping section) to flip layout.
- Use **CSS logical properties** (`padding-inline-start`, `border-inline-end`, `inset-inline-start`, etc.) so the layout flips automatically. Avoid `padding-left` / `right` for anything that should mirror.
- Numbers in Arabic UI use **Western Arabic numerals (0–9)** for prices and counts (matches invoicing). Eastern Arabic numerals (٠–٩) only in poetic editorial copy.
- Both languages have **co-equal hierarchy** — never style Arabic as a translation afterthought.

---

## 3. Spacing, radii, shadows, motion

### Spacing (4 px base)

| Token | px |
|---|---|
| `--space-1` | 4 |
| `--space-2` | 8 |
| `--space-3` | 12 |
| `--space-4` | 16 |
| `--space-5` | 24 |
| `--space-6` | 32 |
| `--space-7` | 48 |
| `--space-8` | 64 |
| `--space-9` | 96 |
| `--space-10` | 128 |

Sections breathe — minimum **96 px** vertical padding on hero / section blocks at desktop.

### Radii

| Token | px | Use |
|---|---|---|
| `--radius-xs` | 2 | inner frames |
| `--radius-sm` | 4 | image tiles |
| `--radius-md` | 8 | inputs, buttons |
| `--radius-lg` | 14 | cards (default) |
| `--radius-xl` | 20 | featured cards |
| `--radius-pill` | 999 | chips, badges, toggle |

Cards never use rounded-pill corners. Buttons never use 0 radius.

### Shadows (warm — mixed from brown text color)

```css
--shadow-xs:    0 1px 2px  rgba(44,24,16,0.04);
--shadow-sm:    0 2px 6px  rgba(44,24,16,0.06);
--shadow-md:    0 8px 22px rgba(44,24,16,0.08);
--shadow-lg:    0 16px 40px rgba(44,24,16,0.10);
--shadow-xl:    0 28px 64px rgba(44,24,16,0.14);
--shadow-inset: inset 0 1px 0 rgba(255,255,255,0.45);
```

Never use `rgba(0,0,0,…)`. All shadows are warm.

### Motion

```css
--ease-out:     cubic-bezier(0.22, 0.61, 0.36, 1);
--ease-in-out:  cubic-bezier(0.65, 0,    0.35, 1);
--ease-soft:    cubic-bezier(0.4,  0,    0.2,  1);
--dur-fast:     180ms;
--dur-base:     280ms;
--dur-slow:     520ms;
--dur-editorial: 800ms;
```

**Default transition is `280ms var(--ease-out)`.** Hero reveals run 800 ms. **No bounces, no spring physics, no rotations.** Fades and soft up-shifts only.

### Layout

```css
--container:        1240px;   /* default content width */
--container-narrow: 880px;    /* long-form prose */
--gutter:           24px;
```

Two-column product grids preferred over three on desktop (density hurts the boutique feeling).

---

## 4. States

### Hover

- **Link**: color → `--brand-hover` (`#6E3610`), underline fades in over 280 ms.
- **Primary button**: background → `--brand-hover`. **No scale.**
- **Secondary button**: background → `--fg`, text → `--fg-on-dark`.
- **Ghost / link button**: color → `--brand-hover`, underline appears.
- **Card**: shadow lifts `--shadow-sm` → `--shadow-md`. **No translate.**

### Press

- Brightness reduces ~4 % (or use `--brand-hover`). **No scale shrink.**

### Focus

- 2 px outline `--brand` with 2 px offset on cream surfaces.
- 2 px outline `--belta-blush` with 2 px offset on terracotta surfaces.

### Disabled

- `opacity: 0.45; cursor: not-allowed;` — no greyed-out swap.

---

## 5. Components

Each section gives the **API shape** (props), the **structure** (DOM/JSX outline), and the **specific tokens / dimensions** to use. The reference React implementation lives in `ui_kits/website/`.

### 5.1 Announcement bar — `<AnnouncementBar lang />`

Thin strip above the navbar that rotates short notices.

- Background: `var(--belta-brown)` (`#2C1810`).
- Text: `var(--fg-on-dark)` (`#F5EFE6`).
- Type: Inter, 11 px, `font-weight: 500`, `letter-spacing: 0.18em`, `text-transform: uppercase`.
- Height: 36 px. Padding: `9px 16px`. Centered text.
- Cycles through these four messages every **3.5 s** with a 520 ms fade + 6 px upward translate:
  - EN: `Free shipping to Lebanon`, `Limited pieces only`, `Drawn in Beirut`, `DM to order on WhatsApp`
  - AR: `شحن مجاني داخل لبنان`, `طبعات محدودة فقط`, `مرسوم في بيروت`, `للطلب راسلينا على واتساب`

### 5.2 Header / navbar — `<Header lang onLang onOpenBag bagCount onNav route />`

Sticky top, sits *under* the announcement bar.

```
[ logo group        ][   centered wordmark   ][ icon cluster + lang ]
```

- Container: `max-width: 1240px`, padding `20px 32px`, three-column grid `1fr auto 1fr`.
- Background: `rgba(245, 239, 230, 0.94)` with `backdrop-filter: blur(16px)`.
- Bottom border: `1px solid var(--border)`.
- **Sticky** (`position: sticky; top: 0; z-index: 50`).

**Left — nav links** (Inter 13 px, color `var(--fg)`, gap 26 px). Order:

| EN | AR |
|---|---|
| Home | الرئيسية |
| Shop | المتجر |
| About | عنّا |
| History | حكايتنا |
| Contact | تواصلي |

Hover / active: 1 px terracotta underline, 280 ms ease-out.

**Center — wordmark.** Cormorant Garamond, 34 px, weight 500, color `var(--belta-terracotta)`, letter-spacing -0.01em. Click → home.

**Right — icon cluster, in this exact order:**

1. `search` (Lucide), 18 px
2. `user` (account), 18 px
3. `heart` (wishlist), 18 px
4. `shopping-bag` (cart), 18 px — with **badge** showing `bagCount` when > 0
   - Badge: 16 × 16 px circle, `background: var(--brand)`, `color: var(--fg-on-brand)`, font 10 px / weight 600, positioned top: -6 px, right: -8 px.
5. **Language toggle**: text `EN | AR`, 11 px, `letter-spacing: 0.18em`, `text-transform: uppercase`.
   - Active language → `var(--brand)`; inactive → `var(--fg-muted)`.
   - Separator pipe (`|`) → `opacity: 0.5`, 6 px horizontal padding.
   - Whole label has `border-inline-start: 1px solid var(--border)` and `padding-inline-start: 14px`.
   - Click toggles between `en` and `ar`.

### 5.3 Hero — `<Hero lang onShop />`

Two-column section, `max-width: 1240px`, `padding: 64px 32px 96px`, gap 56 px.

**Left column:**

- Eyebrow (terracotta, 11 px / 0.18em / uppercase): `New this season · Spring`.
- Headline: Cormorant 56 px, italic emphasis on the noun, color `var(--brand)` for the italic word.
- Lead paragraph: 18 px / 1.7 line-height, color `var(--fg-muted)`, max-width 460 px.
- Two buttons in a row: **primary** "Shop the season" + **ghost** "From the atelier →".

**Right column** — stacked photo zones:

1. Primary: aspect-ratio `4 / 5`, full width, with **Styled / Product toggle** absolutely positioned at top-right (14 px inset).
2. Secondary below: aspect-ratio `16 / 9`. Shows the *opposite* mode of the primary (so users can see both).

**Photo zone placeholders** (until real photography lands) — see § 5.7.

### 5.4 Styled / Product toggle — `<StyledProductToggle value onChange size variant />`

Two-pill segmented control. Two variants:

- `variant="on-image"` (default) — semi-transparent cream backdrop with `backdrop-filter: blur(8px)`, used overlaid on photo zones.
- `variant="inline"` — neutral surface background.

- Type: Inter, 11 px (or 10 px when `size="sm"`), `font-weight: 500`, `letter-spacing: 0.14em`, uppercase.
- Padding per pill: `6px 14px` (or `4px 10px` at `sm`).
- Border-radius: pill (999).
- Active pill: `background: var(--brand)`, `color: var(--fg-on-brand)`.
- Inactive pill: `background: transparent`, `color: var(--fg)`.
- Transition: 280 ms ease-out on background and color.
- Values: `'lifestyle'` (label "Styled") | `'product'` (label "Product").

### 5.5 Product grid — `<ProductGrid lang onOpenProduct />`

`max-width: 1240px`, `padding: 64px 32px`, with header row (eyebrow + h2 + "View all pieces →" link), then a **4-column grid**, gap 28 px.

#### Product card — `<ProductCard p lang onOpen />`

- Outer image area: `aspect-ratio: 4 / 5`, `border-radius: var(--radius-lg)` (14 px), `overflow: hidden`, `background: var(--surface)`, `box-shadow: var(--shadow-sm)`.
- On hover: `box-shadow: var(--shadow-md)`, 280 ms transition.
- **Photo zone** fills the area; mode controlled by per-card state, defaults to `'lifestyle'`.
- **Tag** at top-inline-start (14 px inset, pill, 10 px / 0.18em / uppercase):
  - `New` → `background: var(--belta-blush)`, `color: var(--belta-terracotta-deep)`.
  - `Final piece` → `background: var(--belta-brown)`, `color: var(--fg-on-dark)`.
  - Other counts (e.g. `42 pieces`) → `background: var(--belta-blush)`.
- **Styled/Product toggle** (size `"sm"`) at top-inline-end (14 px inset).
- Below the image, padded `16px 4px 0`:
  - Name: Cormorant 24 px / weight 500, `var(--fg)`.
  - Meta: Inter 13 px, `var(--fg-subtle)`, `letter-spacing: 0.04em`.
  - Price: Cormorant 18 px (default `<Price>`), `var(--fg)`.

### 5.6 Instagram feed — `<InstagramFeed lang />`

`max-width: 1240px`, `padding: 32px 32px 96px`. Centered header:

- Eyebrow: `@belta.scarfs · Instagram`
- H2 (Cormorant 40 px): `Follow us on Instagram`

Then a **3 × 2 grid** of square placeholders, gap 14 px, each `aspect-ratio: 1 / 1`, `border-radius: 4px`, with a dashed inner frame and centered uppercase label `POST 01`…`POST 06`. Tones rotate through `#E8C9C1`, `#C99680`, `#8B4513`, `#B5C4B1`, `#EFE7DA`, `#6E3610`.

Below the grid, centered: a primary CTA button **"Follow on Instagram ↗"** (`Follow on Instagram ↗` / `تابعينا على إنستغرام ↗`).

### 5.7 Photo zone — `<PhotoZone mode kind />`

Labeled placeholder used while real photography is sourced. Two modes:

- `mode="lifestyle"` — warm terracotta gradient (`linear-gradient(135deg, #F2DDD7 0%, #E8C9C1 30%, #C99680 65%, #8B4513 100%)`), label color `rgba(245,239,230,0.92)`.
- `mode="product"` — cream radial (`radial-gradient(ellipse at center, #FBF7F0 0%, #EFE7DA 60%, #E2D5C3 100%)`), label color `#5A4438`.

Always renders:

- Dashed inner frame, inset 14 px, color `rgba(245,239,230,0.45)` (lifestyle) or `rgba(90,68,56,0.3)` (product).
- Centered bottom label, Inter 11 px (or 10 px on small), `letter-spacing: 0.18em`, uppercase.

`kind` controls label copy:

- `kind="hero"` lifestyle: `LIFESTYLE PHOTO — woman wearing scarf, warm natural light, editorial style`.
- `kind="hero"` product: `PRODUCT FLAT SHOT — scarf only`.
- `kind="card"` / `"secondary"`: short labels `LIFESTYLE PHOTO` / `PRODUCT FLAT SHOT`.

> **For production:** swap `<PhotoZone>` calls for `<img>` with real photography. Keep the `aspect-ratio` and `border-radius` from the parent.

### 5.8 Buttons — `<Button variant size onClick disabled>`

Common: Inter, weight 500, `letter-spacing: 0.01em`, `border-radius: var(--radius-md)` (8 px), 280 ms ease-out transition on all properties.

| variant | resting | hover | notes |
|---|---|---|---|
| `primary` (default) | `bg: var(--brand)`, `color: var(--fg-on-brand)` | `bg: var(--brand-hover)` | All primary CTAs |
| `secondary` | transparent, `color: var(--fg)`, `border: 1px solid var(--fg)` | `bg: var(--fg)`, `color: var(--fg-on-dark)` | Lower hierarchy |
| `ghost` | transparent, `color: var(--brand)` | `color: var(--brand-hover)`, underline | Inline / link style |
| `blush` | `bg: var(--belta-blush)`, `color: var(--belta-brown)` | `bg: #DDB7AD` | Soft accent CTA |

Sizes: `sm` `8px 16px / 13px` · `md` `12px 22px / 14px` · `lg` `14px 26px / 15px`.

Disabled: `opacity: 0.45; cursor: not-allowed;` and `onClick` is suppressed.

### 5.9 Form inputs

```css
.input, .select {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--bg-raised);             /* #FBF7F0 */
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--fg);
  outline: none;
  transition: border-color 280ms var(--ease-out);
}
.input::placeholder { color: var(--fg-subtle); }
.input:focus        { border-color: var(--brand); box-shadow: 0 0 0 3px rgba(139,69,19,0.15); }
.input.error        { border-color: var(--danger); }
```

Labels: Inter 12 px, weight 500, color `var(--fg-muted)`, `letter-spacing: 0.02em`, 6 px below.

Checkboxes: 18 × 18 px, `border-radius: 4px`, unchecked `border: 1.5px solid var(--border-strong)` on `--bg-raised`; checked `background: var(--brand)`, `border-color: var(--brand)`, white tick.

### 5.10 Badges & chips

- **Status badges** (pill, 11 px / 0.12em / uppercase, padding `5px 10px`):
  - `New` — `--belta-blush` on `--belta-terracotta-deep` text.
  - `Final piece` — `--belta-brown` on cream text.
  - `42 pieces` — `--belta-sage-soft` on `#3F5238` text.
  - `Pre-order` — `--bg-raised` on `--fg-muted` text, with 1 px border `--border`.
  - `Sold out` — transparent, `var(--fg-subtle)` text, 1 px border `--border-strong`.
- **Filter chips**: pill, Inter 13 px, padding `7px 14px`, `--bg-raised` background, `--border-strong` border. Active → `var(--brand)` background, cream text.
- **Color swatches**: 26 × 26 px circles. Selected → `box-shadow: 0 0 0 2px var(--bg-raised), 0 0 0 3px var(--brand);`.

### 5.11 Cards (general)

A "card" = a piece of paper.

- `background: var(--surface)` (`#FBF7F0`).
- `border: 1px solid var(--border)` (`#E2D5C3`).
- `border-radius: 14px` (default) or 20 px featured.
- `box-shadow: var(--shadow-sm)` resting; `--shadow-md` on hover (280 ms).
- **Never** colored left-border accent. **Never** rounded-pill on a card.

### 5.12 Footer — `<Footer lang onNav />`

Dark brown footer, three-column grid `1fr auto 1fr`, `padding: 40px 32px`, `max-width: 1240px`, gap 32 px.

- Background: `var(--belta-brown)` (`#2C1810`).
- Text: `var(--fg-on-dark)` (`#F5EFE6`); muted lines at `rgba(245,239,230,0.85)`; rule lines at `rgba(245,239,230,0.08)`.
- **Left**: Beltà wordmark — Cormorant 38 px, weight 500, color `--belta-cream`, click → home.
- **Center**: same five nav links as the header (Home / Shop / About / History / Contact, AR equivalents in RTL), Inter 13 px, gap 28 px.
- **Right**: Instagram icon (Lucide `instagram`, 18 px), WhatsApp icon (inline SVG, 18 px, 1.5 px stroke), then a divider (`border-inline-start: 1px solid rgba(245,239,230,0.18)`, `padding-inline-start: 14px`) and two stacked tagline lines:
  - `Artisan Scarfs · Lebanon` (Inter, 11 px, 0.12em uppercase)
  - `وشاح يدوي · لبنان` (Noto Naskh Arabic, 13 px, no uppercase)
- Below all of this, a 1 px hairline rule and copyright row: `© <year> Beltà · Beirut` left, `· · ·` right, Inter 11 px, `rgba(245,239,230,0.55)`.

---

## 6. Iconography

- **System: Lucide outline.** 1.5 px stroke, rounded line-caps, no fill.
- A vendored subset lives in `assets/icons/` (`search.svg`, `user.svg`, `heart.svg`, `shopping-bag.svg`, `menu.svg`, `x.svg`, `arrow-right.svg`, `arrow-left.svg`, `chevron-down.svg`, `chevron-right.svg`, `plus.svg`, `minus.svg`, `globe.svg`, `instagram.svg`, `mail.svg`, `check.svg`, `star.svg`, `truck.svg`, `sparkles.svg`, `package.svg`).
- Sizes: 16 px (inline), **20 px (UI default)**, 24 px (hero/feature). Stroke stays 1.5 px regardless.
- Icons inherit `currentColor`.
- WhatsApp glyph isn't in Lucide — use the inline SVG embedded in `Footer.jsx` (a chat bubble + handset path, 1.5 px stroke).
- **No emoji. No unicode emoji. Ever.** Acceptable typographic ornaments only: `·` (middle dot), `—` (em dash), `→` (right arrow), `✦` (four-pointed star, U+2726).

---

## 7. RTL rules (Arabic)

1. Toggle by setting `document.documentElement.dir = 'rtl'` and `lang = 'ar'`. The CSS automatically picks up `var(--font-arabic)` via the `[lang="ar"], [dir="rtl"]` selectors in `colors_and_type.css`.
2. **Use logical properties everywhere:**
   - `padding-inline-start` / `padding-inline-end` — not `padding-left/right`.
   - `border-inline-start` / `border-inline-end` — not `border-left/right`.
   - `inset-inline-start` / `inset-inline-end` for absolute positioning — not `left` / `right`.
   - `text-align: start` / `end` — not `left` / `right`.
3. **Slide-over panels** (e.g. the bag) flip side: in LTR they translate from the right (`translateX(100%)`); in RTL they translate from the left (`translateX(-100%)`).
4. **Marquees and rotators**: don't flip the animation direction in RTL — content is still read in source order, just visually mirrored. The transform stays `translateX(-33.333%)`.
5. **Numerals**: keep prices in Western Arabic numerals (0–9) in both languages so they match invoicing. Eastern Arabic numerals (٠–٩) are reserved for editorial copy where a poetic register is wanted.
6. **Arrows in copy**: `→` in EN becomes `←` in AR (manually in copy strings) to match reading direction.
7. **Wordmark**: never set the Beltà wordmark in `var(--font-arabic)`. The wordmark is *always* Cormorant Garamond, regardless of UI language.
8. **Mixed-direction copy**: when EN and AR appear side-by-side (e.g. footer tagline), the Arabic line gets `text-align` matching the surrounding column (`right` in LTR layout, `left` in RTL layout) — set the line's parent's `text-align` and let it inherit.

---

## 8. Backgrounds & imagery

- Page background is **always** `#F5EFE6`. No exceptions.
- Hero photography is **full-bleed**, soft, golden, slightly underexposed — never crisp/digital.
- **No** repeating textures, **no** decorative gradients, **no** glassmorphism on content. The only acceptable gradient is a "protection gradient" (cream → transparent over photography) for legibility.
- Card / surface stack: `--bg` (page) → `--surface` (cards) → `--bg-raised` (form inputs sit on cards).
- Sticky header uses `rgba(245,239,230,0.94)` + `backdrop-filter: blur(16px)`. Footer + announcement bar sit on `--belta-brown`.

---

## 9. Page composition (homepage as reference)

Top to bottom on `/`:

1. `<AnnouncementBar>` — 36 px, dark brown, rotating notices.
2. `<Header>` — sticky, cream blur, 5 nav links + centered wordmark + 4 icons + EN | AR.
3. `<Hero>` — split layout, photo zones with Styled / Product toggle.
4. `<ProductGrid>` — 4-column card grid, each with its own toggle.
5. `<InstagramFeed>` — 3 × 2 placeholder grid + "Follow on Instagram ↗" CTA.
6. `<Footer>` — dark brown, logo · nav · social + bilingual tagline.

Routing target ids in the kit: `home`, `product`, `checkout`, `confirmation`, plus `about` / `history` / `contact` (placeholder pages).

---

## 10. Don'ts

- ❌ `#000`, `#fff`, cool grays (`#888`, `#aaa`).
- ❌ Blue / purple / cyan / neon. Bluish gradients.
- ❌ Emoji anywhere — including transactional / error UI.
- ❌ Drop shadows from `rgba(0,0,0,…)` — always use the warm shadow tokens.
- ❌ Cards with colored left-border accents.
- ❌ `scrollIntoView` for navigation (it can mess with sticky/blur). Use `window.scrollTo({top, behavior})`.
- ❌ Hover effects that scale or rotate.
- ❌ Inter on display-scale headings; Cormorant inside buttons.
- ❌ Hand-rolled SVG illustrations of women / scarfs / objects. Use the labeled `<PhotoZone>` placeholders until real photography is in.
- ❌ Bouncy / spring animations.

---

## 11. Quick-start CSS reset for new pages

```html
<link rel="stylesheet" href="/colors_and_type.css">
```

That single import gives you:

- All `@font-face` declarations.
- All color, type, spacing, radius, shadow, motion CSS variables.
- Sensible base styles for `html`, `body`, `h1`–`h4`, `p`, `a`, `code`, `::selection`.
- Auto-applied Arabic font when `[lang="ar"]` or `[dir="rtl"]`.

You should not need any other global CSS to start building.

---

## 12. Reference React kit

`ui_kits/website/` contains a working click-through prototype of:

- `AnnouncementBar.jsx` · `Header.jsx` · `Hero.jsx` · `PhotoZone.jsx` (+ toggle) · `ProductGrid.jsx` · `InstagramFeed.jsx` · `ProductDetail.jsx` · `Bag.jsx` · `Checkout.jsx` · `Confirmation.jsx` · `JournalCard.jsx` · `Footer.jsx` · `Marquee.jsx` · `Tokens.jsx` (Eyebrow, Display, Price, Button, Icon).

Read these for exact prop shapes, JSX structure, and inline-style values. Feel free to port the same components 1:1 into your codebase (replace the inline style objects with whatever solution you use — Tailwind, CSS modules, vanilla CSS — the *values* are what matter).

## 13. Current Project State

Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase
Supabase URL: https://nssihkcwdrqsjbafanna.supabase.co
Live URL: https://belta-website-sigma.vercel.app

### Completed:
- All frontend components and public pages
- Auth pages (login, register) with name, phone, address, city, newsletter opt-in
- Admin layout with sidebar (Overview, Products, Subscribers)
- Admin products page (list, add, edit, delete, active toggle)
- Admin subscribers page
- Supabase connected with RLS
- Deployed on Vercel (auto-deploys on git push)

### Database tables:
- `products` — id, name, name_ar, material, material_ar, price, badge, active, created_at
- `newsletter_subscribers` — id, name, email, phone, address, city, subscribed_at
- `user_roles` — id, role

### Next tasks:
- Owner role assigned in Supabase
- Resend email setup for campaigns
- Email campaign sender in admin dashboard
- WhatsApp buttons on product cards
- Analytics events table and admin analytics page
- Security hardening + admin credentials change