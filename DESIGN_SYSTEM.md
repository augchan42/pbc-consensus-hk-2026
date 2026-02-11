# Design System — Plum Blossom Computer (梅花電腦)

Dark terminal / command center / monochrome with neon green accent / brutalist monospace / information-dense dashboard.

## Background Layers

| Token | Hex | Usage |
|-------|-----|-------|
| Page | `#0a0a0a` | Full-page background |
| Panel | `#141414` | Card/panel surfaces |
| Popover | `#1a1a1a` | Elevated surfaces (help, tooltips) |
| Divider | `#2a2a2a` | Borders, separators, progress bar tracks |
| Button border | `#3a3a3a` | Interactive element borders |

## Text Hierarchy

All text uses the Tailwind neutral gray scale on dark backgrounds.

| Role | Tailwind Class | Approx Hex | Example |
|------|---------------|------------|---------|
| Primary | `text-gray-200` | `#e5e5e5` | Panel body text, values |
| Secondary | `text-gray-300` | `#d4d4d4` | Observation labels |
| Tertiary | `text-gray-400` | `#a3a3a3` | Zodiac signs, element names |
| Muted | `text-gray-500` | `#737373` | Degrees, dates, ratios |
| Section header | `text-gray-600` | `#525252` | "OBSERVATIONS", "INTERPRETATION" |
| Micro label | `text-gray-600` at 10px | `#525252` | "Computed", "Observed", "Derived" |

## Accent Colors

| Color | Value | Usage |
|-------|-------|-------|
| Neon green | `#44ff88` | Primary accent — active values, hexagram unicode glyphs, progress bars, "ACT" bias, accepted toggle, pulse dot |
| Amber | `text-amber-500/80` / `border-amber-800` | Help text, tooltip commentary, image (象) text |
| Blue | `bg-blue-900/20` / `text-blue-400` / `border-blue-800` | "OBSERVE" bias state |
| Red | `text-red-400` — `text-red-500` / `border-red-900` | "CAUTION" bias, retrograde marker, rejected toggle |
| Neutral gray | `bg-gray-900/20` / `text-gray-400` / `border-gray-700` | "NEUTRAL" bias state |

### Bias Color Mapping

| Bias | Background | Text | Border |
|------|-----------|------|--------|
| ACT | `bg-green-900/20` | `text-[#44ff88]` | `border-green-800` |
| OBSERVE | `bg-blue-900/20` | `text-blue-400` | `border-blue-800` |
| CAUTION | `bg-red-900/20` | `text-red-400` | `border-red-800` |
| NEUTRAL | `bg-gray-900/20` | `text-gray-400` | `border-gray-700` |

## Typography

| Property | Value |
|----------|-------|
| Font family | `font-mono` (system monospace) — used everywhere |
| Base content size | `text-xl` (~20px) |
| Panel headers | `text-xl uppercase tracking-wider` in gray-500 |
| Large glyphs (hexagram unicode) | `text-3xl` in panels, `text-6xl` for featured display |
| Micro labels | `text-[10px] font-mono uppercase` in gray-600 |
| Help / tooltip text | `text-xs` or `text-sm` in `font-mono` |
| Page title | `text-3xl font-mono uppercase tracking-wider` in gray-200 |
| Subtitle | `text-xl font-mono` in gray-500 |

## Panel Structure

Every data panel follows this anatomy:

```
┌─────────────────────────────────────────────┐  bg-[#141414]
│  PANEL TITLE          [Micro Label]    [?]  │  border-b border-[#2a2a2a]
├─────────────────────────────────────────────┤
│                                             │
│  Content in font-mono text-xl text-gray-200 │  p-4
│                                             │
│  ─────────── border-t border-[#2a2a2a] ──── │
│                                             │
│  Subsection                                 │  pt-3 or pt-4
│                                             │
└─────────────────────────────────────────────┘  border border-[#2a2a2a] rounded-sm
```

- **Header:** `px-4 py-3` with title left (gray-500 uppercase) + help `?` button right
- **Content:** `p-4 font-mono text-xl text-gray-200`
- **Sections:** separated by `border-t border-[#2a2a2a]`
- **Corner radius:** `rounded-sm` (2px) — deliberately minimal

## Grid Layout

```
Desktop (lg): 3-column grid
Tablet (md):  2-column grid
Mobile:       1-column stack

gap: 8px (gap-2)
margin-bottom: 8px (mb-2)
```

Panel order: Hexagram Core | Macro Cycle | Four Pillars | Planetary | Operational Scale | Oracle

Reasoning Tree sits full-width below the grid.

## Interactive Elements

| Element | Default | Hover | Active |
|---------|---------|-------|--------|
| Expand arrow | gray-500 | gray-300 | — |
| Help `?` button | gray-600 | amber-500 | — |
| Toggle button | 8x8 bordered square | — | green/red/gray per state |
| Copy button | gray-600 (14px SVG) | gray-400 | checkmark for 1.5s |
| Panel help popover | amber-800 border | — | max-w-lg, scrollable |
| InfoTip tooltip | amber-800/50 border | — | max-w-md, scrollable |

## Progress Bars

- Track: `h-2 bg-[#2a2a2a] rounded-full`
- Fill: `bg-[#44ff88] rounded-full` (Shi generation bar)
- Yuan bar uses `h-1 bg-gray-600` (subtler, thinner)

## Key Design Principles

1. **Monospace everything.** No sans-serif, no serif. The aesthetic is terminal/instrument.
2. **Nearly black backgrounds.** Three tiers: `#0a0a0a` → `#141414` → `#1a1a1a`.
3. **Single accent color.** `#44ff88` neon green carries all emphasis. Other colors are semantic (bias states, warnings).
4. **Amber for commentary.** All explanatory/help text uses the amber palette — it reads as "annotation" vs "data".
5. **Uppercase sparingly.** Section headers and panel titles only. Content text is mixed case.
6. **Minimal radius.** `rounded-sm` (2px) on panels. `rounded-full` only on progress bars and the pulse dot.
7. **Dense but scannable.** `text-xl` base size with tight spacing. Information-rich without clutter.
