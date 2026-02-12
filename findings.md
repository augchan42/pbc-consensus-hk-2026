# Findings

## Codebase Research

### Current Architecture
- **Entry point:** `src/app/[locale]/plum-blossom/page.tsx` — server component that computes `PlumBlossomComputerResult` and passes it serialized to `PlumBlossomClient`
- **Client shell:** `src/app/[locale]/plum-blossom/PlumBlossomClient.tsx` — renders header + 6-panel grid + reasoning tree
- **Data type:** `PlumBlossomComputerResult` = `{ timestamp, cosmology: CosmologyResult, reasoning: ReasoningGraph }` (defined in `src/lib/plumBlossomComputer/core/types.ts`)
- **No routing needed** — both views consume the same prop, tab state is purely client-side

### Panel Inventory (current dashboard)
| Panel | File | Data Source | Key Human Content |
|-------|------|-------------|-------------------|
| HexagramCorePanel | `components/HexagramCorePanel.tsx` | `cosmology.hexagram` | Hexagram symbol, name, meaning, moving line text, interlinear gloss |
| MacroCyclePanel | `components/MacroCyclePanel.tsx` | `cosmology.macroCycle` | Yuan/Hui/Yun/Shi hierarchy, progress bars |
| StemsBranchesPanel | `components/StemsBranchesPanel.tsx` | `cosmology.fourPillars` | 4-column stem/branch grid with element colors |
| PlanetaryPanel | `components/PlanetaryPanel.tsx` | `cosmology.planetaryPositions`, `cosmology.moonPhase` | Planet rows, zodiac signs, retrograde markers, moon phase |
| OperationalScalePanel | `components/OperationalScalePanel.tsx` | `cosmology.operationalScale` | Scale gauge, observation level |
| OraclePanel | `components/OraclePanel.tsx` | Full `result` | Blockchain commit UI, history table |
| ReasoningTreePanel | `components/ReasoningTreePanel.tsx` | `result.reasoning` | Branch cards with toggle, synthesis card |

### Data Available for Narrative (no new computation needed)
- `synthesis.overallBias` — ACT/OBSERVE/AVOID/NEUTRAL
- `synthesis.confidence` — 0-1 float
- `synthesis.rationale` — one-line summary
- `hexagramData[n].meaning` — English meaning of hexagram
- `hexagramImageText[n].en` — Image text (象) prose
- `hexagramLineText[n][line-1]` — Moving line text
- `getLineInfo(hex, line)` — register, note, phrase
- `getHatcherHexagram(n).lines[line].text` — original Chinese line text
- `getHatcherHexagram(n).lines[line].characters` — character-by-character gloss
- `MOON_PHASE_MEANINGS[phase]` — prose meaning per moon phase
- `OBSERVATION_GUIDANCE[level]` — prose guidance per observation level
- Planetary Wu Xing interactions already computed in `PlanetaryPanel.tsx` and `graphBuilder.ts`
- Macro cycle context strings already in `macroCycle.hui.context`, `.yun.context`, `.shi.context`

### Existing UI Primitives
- `InfoTip` — Radix tooltip wrapper (hover to reveal)
- `PanelHelp` — Radix popover wrapper (click `?` to reveal)
- `InterlinearGloss` — Character-by-character Chinese gloss component
- `CopyButton` — Clipboard copy (inside ReasoningTreePanel)
- Tailwind v4 with `@tailwindcss/postcss`, no config file
- Color palette: `#0a0a0a` bg, `#141414` panel bg, `#2a2a2a` borders, `#44ff88` accent, gray-500 secondary text

### Translation Keys
- `messages/en.json` and `messages/zh.json` have `PlumBlossom` namespace
- Will need new keys for tab labels and Reading view prose headings

### Key Decisions
1. **Tab switcher location:** In the existing header bar, right side (replacing or next to the timestamp)
2. **Default tab:** Reading (human-first), with URL hash or localStorage persistence optional
3. **Expand/collapse:** Simple `useState` booleans, no animation library needed
4. **Font:** System sans-serif for prose in Reading view; keep monospace for Dashboard
5. **Layout:** Single-column max-w-2xl centered for Reading view
