# UI Architecture — Hotel Analytics Pro

## Layout System

The application uses a single-page, three-column fixed layout that fills the full viewport height. There is no routing — all panels are always visible. The root element is `overflow-hidden` to prevent any scrolling at the viewport level; each column manages its own internal scroll independently.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          App.tsx (flex, h-screen)                   │
│                                                                     │
│  ┌──────────────┐  ┌────────────────────────────┐  ┌─────────────┐ │
│  │  ChatPanel   │  │       AnalyticsHub          │  │ Activity    │ │
│  │  280px fixed │  │       flex-1 (grows)        │  │ Panel       │ │
│  │              │  │                             │  │ 320px fixed │ │
│  │  - Header    │  │  - Status Bar (h-8)         │  │             │ │
│  │  - Conv List │  │  - KPI Row (4 cards)        │  │ - Log       │ │
│  │    (35% h)   │  │  - Hotel Grid (2-3 col)     │  │   (45% h)   │ │
│  │  - Chat      │  │  - Comparison Matrix        │  │ - Sources   │ │
│  │    Thread    │  │  - Research Workspace       │  │   (25% h)   │ │
│  │  - Input     │  │                             │  │ - Research  │ │
│  │    (pinned)  │  │  (inner overflow-y-auto)    │  │   (flex-1)  │ │
│  └──────────────┘  └────────────────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Column Widths

| Column | Width | Component |
|---|---|---|
| Left | `280px` (fixed, `shrink-0`) | `ChatPanel` |
| Center | `flex-1` (fills remaining) | `AnalyticsHub` |
| Right | `320px` (fixed, `shrink-0`) | `ActivityPanel` |

---

## Component Tree

```
App
├── ChatPanel
│   ├── Header (label + status indicator)
│   ├── ConversationList (mockConversations → button rows)
│   ├── ChatThread (mockChatMessages → user/assistant bubbles)
│   └── InputArea (textarea + send button + quick-action chips)
│
├── AnalyticsHub
│   ├── StatusBar (workspace name + live counters)
│   ├── KPIRow
│   │   └── MetricCard × 4 (mockKPIs)
│   ├── HotelGrid
│   │   ├── Header (label + count badge + filter tabs)
│   │   └── HotelCard × 6 (mockHotels)
│   ├── ComparisonSection
│   │   ├── Header
│   │   ├── ComparisonMatrix (hardcoded 3-hotel × 8-metric table)
│   │   └── AddHotelButton
│   └── ResearchWorkspace
│       ├── TabBar (Active Research / Saved Reports / Data Sources / Export)
│       └── ResearchCards × 2 (Dubai Q4 2024, NYC Comp Set)
│
└── ActivityPanel
    ├── ActivityLog (mockLogs → timestamped entries with type badges)
    ├── DataSources (mockSources → source status cards)
    └── QuickResearch
        ├── SearchInput
        ├── RecentSearchChips
        └── MarketPulse (mockMarketPulse → city trend indicators)
```

---

## Component Reference

### `App.tsx`
Root shell. Sets up the three-column flex layout and forces `dark` class onto `document.documentElement` via a `useEffect` on mount. No routing, no query client — this is a pure UI shell.

### `ChatPanel.tsx`
Left column. Three vertical sections:
1. **Conversation list** — 35% of column height, scrollable, renders `mockConversations`
2. **Chat thread** — flex-1, scrollable, renders `mockChatMessages` with basic markdown-bold rendering (replaces `**text**` with `<strong>`)
3. **Input area** — pinned to bottom with `shrink-0`, contains a resizable `<textarea>`, a send `<button>`, and four quick-action chips

### `AnalyticsHub.tsx`
Center column. The primary content area. Renders a thin status bar at the top (`h-8`, `shrink-0`) then an `overflow-y-auto` scroll container holding four stacked sections: KPI row, hotel grid, comparison section, and research workspace.

### `ActivityPanel.tsx`
Right column. Three fixed-height vertical sections:
1. **Activity log** — 45% height, scrollable list of `mockLogs` entries rendered as a 3-column CSS grid (time | type badge | message)
2. **Data sources** — 25% height, renders `mockSources` as bordered cards with status labels
3. **Quick research** — `flex-1` remainder, contains search input, chip row, and market pulse indicators

### `HotelCard.tsx`
Reusable card for a tracked hotel property. Accepts a `hotel` object from `mockData.ts`. Renders:
- **Header area**: name, star rating (filled `Star` icons), location badge, status badge, category/segment tags
- **Metrics row**: ADR / RevPAR / Occ% in three equal cells; RevPAR cell is accented with a primary-color border
- **Trend row**: YoY RevPAR text + inline CSS sparkline (7 `<div>` bars with `style={{ height }}`)
- **Action footer**: "Compare" (neutral) + "Analyze" (accent) buttons

### `ComparisonMatrix.tsx`
Self-contained table component. Hardcoded data for three hotels (Burj Al Arab, Ritz-Carlton London, Four Seasons NY) across eight metrics (ADR, RevPAR, Occupancy, TRevPAR, GOPPAR, Market Share, Review Score, YoY Growth). Each row highlights the best value in green and the worst in red using Tailwind background/text utilities.

### `MetricCard.tsx`
KPI summary card. Renders a label, large monospace value, trend badge with color, and a CSS sparkline in the card's bottom-right corner. The sparkline uses `opacity` gradient (0.5 → 0.98 left-to-right) to suggest time progression.

---

## Data Layer

All data lives in `src/data/mockData.ts`. No API calls are made. Exported constants:

| Export | Type | Used By |
|---|---|---|
| `mockConversations` | `Array<{id, title, time, preview}>` | `ChatPanel` |
| `mockChatMessages` | `Array<{id, role, text}>` | `ChatPanel` |
| `mockKPIs` | `Array<{label, value, trend, trendColor, bars}>` | `AnalyticsHub` → `MetricCard` |
| `mockHotels` | `Array<HotelData>` | `AnalyticsHub` → `HotelCard` |
| `mockLogs` | `Array<{time, type, color, text}>` | `ActivityPanel` |
| `mockSources` | `Array<{name, status, statusColor, detail}>` | `ActivityPanel` |
| `mockMarketPulse` | `Array<{market, trend, color}>` | `ActivityPanel` |

---

## Theme System

The app uses a CSS custom property theme defined entirely in `src/index.css`. All colors are HSL values without the `hsl()` wrapper (consumed as `hsl(var(--token))`).

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--background` | `220 20% 8%` | Root page background |
| `--foreground` | `220 15% 92%` | Primary text |
| `--card` | `220 20% 11%` | Panel / card surfaces |
| `--border` | `220 15% 18%` | All borders and separators |
| `--muted` | `220 15% 16%` | Muted backgrounds |
| `--muted-foreground` | `220 10% 55%` | Secondary / label text |
| `--primary` | `38 92% 50%` | Amber accent (RevPAR highlight, CTA buttons) |
| `--secondary` | `220 18% 14%` | Subtle hover surfaces |
| `--accent` | `38 92% 50%` | Same as primary (user chat bubbles) |

### Typography

| Usage | Font | Class |
|---|---|---|
| Labels, UI text, headings | Inter | `font-sans` |
| Numbers, data values, timestamps | JetBrains Mono | `font-mono` |

Both fonts are loaded from Google Fonts via `@import url(...)` at the top of `index.css`.

### Scrollbars

Custom webkit scrollbars are defined globally in `index.css`:
- Track: matches `--background`
- Thumb: `--border` color, rounded
- Width: 4px (thin, terminal-style)

---

## Design Decisions

**Why no routing?** The Bloomberg terminal aesthetic requires all three panels to always be visible simultaneously. A routed multi-page approach would destroy the simultaneous-context model that makes the interface useful.

**Why CSS sparklines instead of Recharts?** Sparklines in this UI are purely decorative trend indicators, not interactive charts. Using a charting library for 7-bar decorative elements adds kilobytes of JS for zero analytical value. CSS div-based sparklines render instantly and require no layout recalculation.

**Why hardcoded comparison data in `ComparisonMatrix`?** The comparison matrix is the most complex data structure (hotel × metric × highlight logic). Keeping it self-contained in the component makes the highlight logic (best/worst per row) simpler to implement and review without a generalized algorithm. This will be refactored when the comparison is database-backed and supports arbitrary hotel selection.

**Why `any` types on component props?** The mock data shapes are defined in `mockData.ts` but not yet exported as explicit TypeScript interfaces. This was a deliberate deferral — proper interfaces will be defined when the OpenAPI spec is written and Orval generates the canonical types, ensuring the frontend types match the backend schema without duplication.

**Why forced dark mode?** The application is designed exclusively for the terminal aesthetic. Adding light-mode CSS variable values would require designing a second cohesive palette with no current user benefit. Dark-only reduces surface area for the MVP.
