# Task Plan: Two-Tab Reading/Dashboard Architecture

## Goal
Add a "Reading" tab that presents the Plum Blossom Computer results as a progressive narrative for human consumption, alongside the existing "Dashboard" tab (current agent-optimized grid).

## Phases

### Phase 1: Tab Infrastructure
**Status:** pending
**Files:** `src/app/[locale]/plum-blossom/PlumBlossomClient.tsx`

- Add `activeTab` state: `"reading" | "dashboard"` (default: `"reading"`)
- Add tab switcher to the existing header bar — two styled buttons
- Conditionally render either `ReadingView` or the existing panel grid + reasoning tree
- Move the existing grid + reasoning tree into a fragment or keep inline with conditional rendering

**Changes:**
```
PlumBlossomClient.tsx:
- Add: import ReadingView
- Add: const [activeTab, setActiveTab] = useState<"reading" | "dashboard">("reading")
- Add: tab switcher UI in header (between title and timestamp)
- Wrap existing grid + reasoning tree in {activeTab === "dashboard" && (...)}
- Add: {activeTab === "reading" && <ReadingView result={result} toggles={toggles} onToggle={handleToggle} />}
```

### Phase 2: ReadingView Component
**Status:** pending
**Files:** `src/app/[locale]/plum-blossom/components/ReadingView.tsx` (new)

Single new component with 5 collapsible sections. Consumes `PlumBlossomComputerResult`, `toggles`, and `onToggle` (same props pattern as existing panels).

**Section 1 — The Verdict (always visible, hero card)**
- Large hexagram unicode symbol
- Bias word in display type (ACT/OBSERVE/AVOID/NEUTRAL) with color
- Confidence percentage
- One-sentence rationale
- Moon phase emoji + name
- Observation level + guidance
- Human-friendly timestamp

**Section 2 — The Hexagram Reading (auto-expanded)**
- Hexagram name + meaning as heading
- Image text (象) as italicized epigraph
- Moving line number + register tag
- Moving line Chinese text + InterlinearGloss
- Moving line note/explanation
- Year hexagram as backdrop note

**Section 3 — Celestial Context (collapsed by default)**
- Prose paragraph synthesizing planetary positions and Wu Xing interactions
- Retrograde summary as natural language
- Moon phase meaning
- Four Pillars as a compact inline strip (keep Chinese characters + element colors)
- Macro cycle as prose: Shi context sentence, with Hui/Yun breadcrumb

**Section 4 — Reasoning (collapsed by default)**
- Embed existing ReasoningTreePanel component directly
- Short intro sentence above it

**Section 5 — On-Chain Commitment (collapsed by default)**
- Embed existing OraclePanel component directly

**Visual treatment:**
- Same dark bg (#0a0a0a), same #44ff88 accent
- System sans-serif for prose, monospace for Chinese/labels
- Single-column, max-w-2xl, centered
- Leading-relaxed (1.6+) for readability
- Generous vertical padding on verdict card
- Expand/collapse via simple useState + border-left indicator

### Phase 3: Translation Keys
**Status:** pending
**Files:** `messages/en.json`, `messages/zh.json`

Add keys under `PlumBlossom` namespace:
- `tabReading` / `tabDashboard`
- `verdictTitle`
- `hexagramReadingTitle`
- `celestialContextTitle`
- `reasoningTitle`
- `onChainTitle`
- Section expand/collapse labels

### Phase 4: Build Verification
**Status:** pending

- Run `npm run build` to confirm no type errors
- Run `npm run lint` to confirm no lint issues

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tab state management | `useState` in PlumBlossomClient | Simple, no routing needed, both views use same data |
| Default tab | Reading | Human-first; agents can parse either view |
| ReadingView approach | Single component with sections | Avoids over-abstraction; sections share context |
| Prose generation | Inline template literals from existing data | No new computation; data already has `.meaning`, `.context`, etc. |
| Reuse existing panels | Embed ReasoningTreePanel + OraclePanel directly | These already work well for both audiences |
| New dependencies | None | Expand/collapse is just useState + conditional rendering |

## Non-Goals
- No changes to computation pipeline
- No changes to Dashboard view (pixel-identical)
- No new API endpoints
- No URL routing for tabs (could add later with hash)
- No animation library for expand/collapse
