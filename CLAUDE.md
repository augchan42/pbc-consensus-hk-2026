# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (flat config, Next.js + TypeScript rules)
```

No test framework is configured yet.

## Architecture

**Plum Blossom Computer (梅花電腦)** — a Next.js 16 app (React 19) that synthesizes Chinese cosmological computation with astronomical data into an interactive reasoning dashboard.

### Routing & i18n

- **next-intl** handles i18n with locales `en` and `zh` (default: `en`)
- Root `/` redirects to `/en/plum-blossom`
- Locale routes live under `src/app/[locale]/` with `NextIntlClientProvider` in the locale layout
- Translation files: `messages/en.json`, `messages/zh.json`
- Middleware (`src/middleware.ts`) handles locale detection

### Computation Pipeline

The core engine is entirely client-computable (no API calls). The server page pre-computes an initial result and passes it serialized to the client component.

**Entry point:** `computePlumBlossom({ date })` in `src/lib/plumBlossomComputer/engine/compute.ts`

The computation runs through layered modules:

1. **Hexagrams** (`src/lib/plumBlossom.ts`) — Shao Yong's time-based method (時間起卦) using Prior Heaven trigram sequence. Converts Gregorian → lunar date via `lunar-javascript`, derives upper/lower trigrams and moving line from sexagenary cycle position.
2. **Year Hexagram** (`src/lib/shaoYongCalendar.ts`) — Annual hexagram from the 皇極經世書 system. 60-year Jia-Zi cycle with Fu Xi sequence mapped to King Wen numbers.
3. **Four Pillars** (in `compute.ts`) — Year/month/day/hour stem-branch pillars from `lunar-javascript`.
4. **Macro Cycles** (`src/lib/plumBlossomCorrespondences/`) — Shao Yong's cosmological framework (Yuan/Hui/Yun/Shi periods), Wu Xing elements, solar terms, stems & branches.
5. **Astronomy** (`src/lib/plumBlossomComputer/astronomy/`) — Real planetary positions and moon phase via `astronomy-engine` (VSOP87 ephemeris).
6. **Operational Scale** (`src/lib/plumBlossomComputer/cosmology/operationalScales.ts`) — Derives observation level (目/心/理) and scale (十/百/千/萬/億).
7. **Reasoning Graph** (`src/lib/plumBlossomComputer/reasoning/`) — Builds two semantic branches (Chinese Cosmology, Astronomical) with observations, interpretations, and bias signals (act/observe/avoid/neutral). Synthesis aggregates branches by majority vote with a caution principle (avoid wins ties with act).

**Output type:** `PlumBlossomComputerResult` = `{ timestamp, cosmology: CosmologyResult, reasoning: ReasoningGraph }` (defined in `src/lib/plumBlossomComputer/core/types.ts`)

### Client Interaction

`PlumBlossomClient` (`src/app/[locale]/plum-blossom/PlumBlossomClient.tsx`) renders a grid of data panels and a reasoning tree. Users can accept/reject reasoning branches, which triggers `recomputeWithToggles()` to resynthesize the overall bias without recomputing cosmology.

### Hatcher Interlinear Gloss

`src/lib/hatcher/` loads character-by-character gloss data from `src/constants/hatcher/hatcherData.json` for hexagram text display (Chinese character + pinyin + meaning).

### Key Dependencies

- `lunar-javascript` — Gregorian↔Lunar conversion, stem/branch calculation
- `astronomy-engine` — Planetary positions, moon phase (VSOP87)
- `next-intl` — i18n routing and translations
- `@radix-ui/react-tooltip`, `@radix-ui/react-popover` — UI primitives
- Tailwind CSS v4 — styling (no config file, uses `@tailwindcss/postcss`)

### Path Aliases

`@/*` maps to `./src/*` (configured in `tsconfig.json`).
