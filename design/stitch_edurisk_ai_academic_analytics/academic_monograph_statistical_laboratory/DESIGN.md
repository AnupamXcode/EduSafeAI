---
name: Academic Monograph & Statistical Laboratory
colors:
  surface: '#fff8f3'
  surface-dim: '#e1d9d1'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ea'
  surface-container: '#f5ece5'
  surface-container-high: '#efe7df'
  surface-container-highest: '#e9e1d9'
  on-surface: '#1e1b17'
  on-surface-variant: '#414944'
  inverse-surface: '#34302b'
  inverse-on-surface: '#f8efe7'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3e6653'
  primary: '#0a3525'
  on-primary: '#ffffff'
  primary-container: '#244c3a'
  on-primary-container: '#91bba4'
  inverse-primary: '#a5d0b8'
  secondary: '#55624e'
  on-secondary: '#ffffff'
  secondary-container: '#d5e4cb'
  on-secondary-container: '#596752'
  tertiary: '#581803'
  on-tertiary: '#ffffff'
  tertiary-container: '#762e16'
  on-tertiary-container: '#fd9777'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c0edd4'
  primary-fixed-dim: '#a5d0b8'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#264e3c'
  secondary-fixed: '#d8e7ce'
  secondary-fixed-dim: '#bccbb2'
  on-secondary-fixed: '#131f0f'
  on-secondary-fixed-variant: '#3d4a38'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59e'
  on-tertiary-fixed: '#3a0b00'
  on-tertiary-fixed-variant: '#793018'
  background: '#fff8f3'
  on-background: '#1e1b17'
  surface-variant: '#e9e1d9'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Newsreader
    fontSize: 34px
    fontWeight: '400'
    lineHeight: 42px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.005em
  title-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  title-md:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0em
  body-lg:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.005em
  body-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: DM Sans
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2.5rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies the rigor, permanence, and calm authority of premier university presses and peer-reviewed econometric journals. It rejects transient software tropes—such as neon accents, synthetic gradient glows, pillowy drop shadows, and novelty micro-interactions—in favor of structural clarity, typographic gravity, and measured whitespace.

Targeting university deans, provosts, institutional researchers, and academic advisors, the interface evokes the intellectual dignity of an archival monograph crossed with the computational precision of high-performance demographic statistical tools. Surfaces resemble archival heavy-stock vellum and pressed rag paper. Hierarchy is established strictly through proportional typography, ruling lines, and semantic density rather than simulated elevation or decorative containers.

## Colors

The palette is rooted in classical scholarly environments: deep archival green library bindings, calcified bone paper, hand-pressed linen surfaces, and mineral terracotta ink.

- **Primary (`#244C3A` / Deep Forest Green):** The institutional anchor. Used for principal navigation landmarks, authoritative action elements, critical data series markers, and primary typographic weight.
- **Secondary (`#A9B8A0` / Muted Sage):** A natural vegetative tone used for stable indicators, low-intensity secondary data sets, sub-tier structural divisions, and progress baselines.
- **Tertiary (`#C66B4E` / Terracotta):** Functional analytical emphasis. Strictly reserved for performance risk alerts, critical confidence interval bands, regression anomalies, and urgent intervention targets. Never applied decoratively.
- **Neutral (`#332F2A` / Charcoal Brown):** A deep, warm carbon ink for long-form reading, statistical labeling, and dimensional tables, offering lower glare and softer contrast than pure digital black.
- **Canvas & Structural Tones:** Canvas base is Warm Ivory (`#F8F6F0`). Surface panels use Crisp Paper White (`#FFFFFF`). Subordinate workspaces, dense matrix headers, and filter drawers utilize Warm Sand Linen (`#E6DCCB`). Structural hairline dividers utilize Architectural Vellum Border (`#D9D2C3`).

## Typography

Typography establishes analytical structure through a disciplined pairing:

- **Editorial Serif (`Newsreader`):** Applied exclusively to view headers, cohort report titles, and qualitative analytical abstracts. It conveys institutional gravitas and reflective authority. It is never used for data grids, navigation rows, or control buttons.
- **Instrument Sans (`DM Sans`):** Selected for high legibility at dense statistical scales. All numerical metrics, confidence percentages, course identifiers, student ID arrays, and tabular matrices must enable OpenType tabular figures (`font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1;`).
- **Uppercase Labels:** Used sparingly for table column headers, status markers, and metric classifications, set in `label-sm` with explicit letter tracking (`0.06em`).

## Layout & Spacing

The layout philosophy mirrors broadsheet publications and statistical compendiums. Views organize content through explicit horizontal and vertical alignment lines rather than floating islands.

- **Grid Model:** Desktop views use a structured 12-column layout (max width 1440px) pinned within dynamic margins (`margin: 2.5rem`), operating with `1.5rem` gutters. On mobile viewports, screens compress into a fluid single-column stack with `1rem` edge margins and gutters.
- **Dividers as Form:** Separation between analytical controls and data sets is managed via `1px solid #D9D2C3` rule lines. Spacing tokens (`space-sm`, `space-md`, `space-lg`) function strictly as internal padding around dividers and text groups, ensuring content sits close to its structural boundary without clutter.
- **Density:** Compact row spacing inside tables (`space-xs` vertical padding, `space-sm` horizontal padding) permits viewing comprehensive longitudinal student cohorts without extensive scroll operations.

## Elevation & Depth

This system operates without synthetic box shadows or ambient blurs. Depth is achieved via **tonal layering and structural ruling lines**:

- **Ground Level (Base Canvas):** `#F8F6F0` (Warm Ivory) serves as the desk surface for full views.
- **Sheet Level (Working Tables & Documents):** `#FFFFFF` (Paper White) defines the analytical surface, outlined with a single, crisp hairline border (`1px solid #D9D2C3`).
- **Recessed Level (Metadata Trays & Cohort Filters):** `#E6DCCB` (Warm Sand Linen) grounds side panels, data control headers, and table head cells (`<thead>`).
- **Focus & Flyouts:** Dropdown menus, analytical tooltips, and modal inspection drawers maintain flat physical profiles with a solid 1px border (`#244C3A` or `#D9D2C3`), accompanied only by an opaque, high-precision contact silhouette: `box-shadow: 2px 2px 0px 0px rgba(51, 47, 42, 0.08);`.

## Shapes

The design system employs a **Sharp (`0`)** shape language.

Buttons, form fields, statistical cards, table matrices, tabs, and filter chips are cut strictly at `0px` border-radius. This architectural precision reflects academic print journals, microfiche slides, and early digital reference computers. Rectilinear elements guarantee alignment against grid lines, eliminating the visual friction and wasted negative space caused by curved corners on dense multi-column tables.

## Components

### Buttons & Actions
- **Primary:** Background `#244C3A`, text `#FFFFFF`, border `1px solid #244C3A`. Square corners. Hover shifts to `#1B392B`.
- **Secondary (Default):** Background `#FFFFFF`, text `#244C3A`, border `1px solid #D9D2C3`. Hover transitions to `#F8F6F0` with border `#244C3A`.
- **Destructive / High-Alert Action:** Background `#C66B4E`, text `#FFFFFF`, border `1px solid #C66B4E`. Hover shifts to `#AD563B`.
- **Inline Text Actions:** Underlined with a `1px solid #A9B8A0` offset link style that shifts to `#244C3A` on focus.

### Analytical Tables
- Headers (`<th>`) use background `#E6DCCB`, text `#332F2A`, uppercase `label-sm`, bottom border `2px solid #244C3A`, padding `space-sm space-md`.
- Body rows (`<tr>`) use background `#FFFFFF`, bottom border `1px solid #D9D2C3`, padding `space-sm space-md`. Alternating striped rows are prohibited; hover highlights row background to `#F8F6F0`.
- All metric columns align right with `font-variant-numeric: tabular-nums`.

### Status Indicators & Risk Badges
- Strictly rectangular inline indicators with a crisp border (`1px solid`).
- **Critical Risk:** Background `#FFFFFF`, border `1px solid #C66B4E`, text `#C66B4E`. Prefix with a solid terracotta square glyph (`▪`).
- **Nominal / Safe:** Background `#FFFFFF`, border `1px solid #244C3A`, text `#244C3A`.
- **Monitoring:** Background `#FFFFFF`, border `1px solid #A9B8A0`, text `#332F2A`.

### Form Inputs & Selectors
- Background `#FFFFFF`, border `1px solid #D9D2C3`, text `#332F2A`, sharp edges.
- Focus state: Border `1px solid #244C3A` with no outer glow.
- Input labels sit directly above fields in `label-sm`, followed by a sub-caption in `#332F2A` (70% opacity).

### Checkboxes & Segmented Toggles
- Custom square checkboxes: `14px x 14px`, border `1px solid #332F2A`, checked state filled with `#244C3A` exhibiting a square center check pip rather than a rounded tick.
- Segmented cohort switchers: Flat row of square edge-to-edge buttons enclosed in a single `1px solid #D9D2C3` border shell; active selection is filled with `#244C3A` and white text.