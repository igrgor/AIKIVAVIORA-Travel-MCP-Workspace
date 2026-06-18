# Final Engineering Handoff — Hotel Analytics Pro

**Document Type:** Engineering Handoff  
**Prepared:** June 18, 2026  
**Version Delivered:** MVP v1.0 — UI Shell  
**Application Status:** Running (development)  
**Handoff Scope:** Frontend UI shell with static mock data; backend and integrations pending

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Implemented Features](#2-implemented-features)
3. [Current Architecture](#3-current-architecture)
4. [UI Structure](#4-ui-structure)
5. [Implemented Components](#5-implemented-components)
6. [Mock Data Sources](#6-mock-data-sources)
7. [Known Limitations](#7-known-limitations)
8. [Future Integrations](#8-future-integrations)
9. [OpenRouter Integration Plan](#9-openrouter-integration-plan)
10. [Hotel APIs Integration Plan](#10-hotel-apis-integration-plan)
11. [Image Generation Roadmap](#11-image-generation-roadmap)
12. [Development Roadmap](#12-development-roadmap)
13. [Recommended Next Phases](#13-recommended-next-phases)
14. [Deployment Notes](#14-deployment-notes)
15. [Project Status](#15-project-status)

---

## 1. Project Overview

Hotel Analytics Pro is a professional-grade hotel performance analytics and research workspace built for revenue managers, asset managers, hospitality consultants, and hotel analysts. It is designed around the Bloomberg terminal paradigm — a dense, always-visible, three-column dark interface that keeps all data contexts on screen simultaneously.

The workspace allows users to:

- Track a portfolio of hotel properties with live performance metrics (ADR, RevPAR, occupancy)
- Run AI-assisted research queries in natural language against hotel market data
- Compare competitive sets side-by-side in a structured matrix
- Monitor a live activity log of data syncs, alerts, and AI completions
- Manage connections to third-party hotel data sources
- Build and export structured market research reports

The application is built as a React + Vite single-page application inside a pnpm monorepo. The backend is an Express 5 API server sharing the same monorepo. OpenAPI-first development (Orval codegen) is the mandated contract approach when the backend is wired.

**Target User:** Senior hotel industry analyst or revenue manager who spends hours per day inside data tools. Performance, density, and precision are more important than visual simplicity.

---

## 2. Implemented Features

The following features are fully implemented in the current UI shell using static mock data.

### 2.1 Three-Column Terminal Layout
A fixed-width, full-height three-column shell that does not scroll at the root level. Each column independently manages its own internal scroll. Columns are separated by 1px borders. The layout is responsive within the center column (hotel grid switches from 2 to 3 columns at `xl` breakpoint) but the three-column shell itself is desktop-only.

### 2.2 Research Assistant Chat Panel (Left Column)
- Header with "RESEARCH ASSISTANT" label and an animated pulsing status indicator labeled "DeepSeek Active"
- Scrollable conversation history list showing 3 past sessions with title, relative timestamp, and truncated preview; active session is highlighted
- Chat thread rendering 4 alternating user/assistant messages; user messages are right-aligned with amber accent background; assistant messages are left-aligned with dark card background
- Assistant message renderer handles markdown-bold syntax (`**text**` → `<strong>`) inline
- Textarea input pinned to the column bottom with a send button and `⌘↵` keyboard hint
- Four quick-action chips: Compare Hotels, Market Report, Find Competitors, Rate Analysis

### 2.3 KPI Metrics Row (Center Column)
Four metric cards displayed in a 4-column grid showing portfolio-level aggregates:
- RevPAR Index: 112.4 (+3.2% vs LY, green)
- ADR Average: $287.50 (+1.8% vs LY, green)
- Occupancy Rate: 74.3% (−0.4% vs LY, red)
- Market Score: 8.7/10 (+0.3, green)

Each card includes a large monospace value, trend badge, and a CSS sparkline that reveals on hover.

### 2.4 Tracked Properties Grid (Center Column)
Six hotel cards in a responsive 2–3 column grid with a filter tab bar (All / 5-Star / 4-Star / Resorts / City). Each card displays: hotel name, star rating, market location, status badge, category and segment tags, ADR / RevPAR / Occ% metric cells, YoY trend indicator with arrow and color, CSS sparkline, and Compare / Analyze action buttons.

**Hotels tracked in mock data:**
- Burj Al Arab — Dubai, UAE (Ultra-Luxury, $1,245 ADR)
- The Ritz-Carlton — London, UK (Luxury, $892 ADR)
- Four Seasons — New York, USA (Luxury, $1,050 ADR)
- Marina Bay Sands — Singapore (Luxury, $678 ADR)
- Marriott Marquis — New York, USA (Upscale, $389 ADR)
- Atlantis The Palm — Dubai, UAE (Upper-Upscale, $545 ADR)

### 2.5 Comparison Matrix (Center Column)
A pre-loaded 3-hotel × 8-metric comparison table. Hotels compared: Burj Al Arab, Ritz-Carlton London, Four Seasons NY. Metrics: ADR, RevPAR, Occupancy, TRevPAR, GOPPAR, Market Share, Review Score, YoY Growth. Per-row color logic: best value subtly highlighted green, worst value subtly highlighted red. "Add Hotel to Comparison" dashed-border button below table.

### 2.6 Research Workspace (Center Column)
Tabbed section with four tabs: Active Research, Saved Reports, Data Sources, Export. Active Research tab shows two research session cards:
- Dubai Luxury Market Analysis — Q4 2024 (In Progress, 65% progress bar, tags: Dubai / Luxury / Q4-2024, notes preview, Open + Export PDF buttons)
- NYC Competitive Set Analysis (Complete, 100% green progress bar, View Results button)

### 2.7 Activity Log (Right Column)
Scrollable timestamped log of 12 events with color-coded type badges:
- **DATA** (blue) — data sync and update events
- **ALERT** (amber) — threshold breach detections
- **REPORT** (green) — report generation completions
- **SEARCH** (purple) — web research queries
- **AI** (teal) — AI analysis completions

### 2.8 Data Sources Panel (Right Column)
Five data source cards with name, connection status label (Connected / Active / Ready), and detail line:
- STR Global (Connected — 847 hotels, last sync 2m)
- HotStats (Connected — 234 hotels, last sync 15m)
- OTA Insight (Connected — rate data, last sync 5m)
- Web Research (Active — 3 searches today)
- Manual Import (Ready — upload CSV icon button)

### 2.9 Quick Research Panel (Right Column)
Search input with placeholder text, four recent-search chips (Dubai luxury 2024, NYC RevPAR, London market share, Singapore hotels), and a Market Pulse section showing YoY RevPAR trends for four cities: Dubai (+14.2%), New York (+3.1%), London (−1.8%), Singapore (+22.4%).

### 2.10 Status Bar (Center Column Top)
Thin 32px bar spanning the full center column showing: workspace name, current date/time (UTC), and four live counter pills: Hotels Tracked, Active Comparisons, Reports, Last Sync.

---

## 3. Current Architecture

```
Monorepo Root (pnpm workspaces)
│
├── artifacts/
│   ├── hotel-analytics/          ← React + Vite frontend (this delivery)
│   │   ├── src/
│   │   ├── package.json          (@workspace/hotel-analytics)
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   ├── api-server/               ← Express 5 backend (shell only, not yet consumed)
│   │   ├── src/
│   │   │   ├── app.ts
│   │   │   ├── index.ts
│   │   │   ├── lib/logger.ts
│   │   │   └── routes/
│   │   │       ├── health.ts
│   │   │       └── index.ts
│   │   └── package.json          (@workspace/api-server)
│   │
│   └── mockup-sandbox/           ← Vite design sandbox (internal tooling)
│
├── lib/
│   ├── api-spec/
│   │   └── openapi.yaml          ← API contract source of truth (health only, pending)
│   ├── api-client-react/         ← Orval-generated React Query hooks (pending)
│   ├── api-zod/                  ← Orval-generated Zod schemas (pending)
│   └── db/
│       └── src/schema/           ← Drizzle ORM schema (empty, pending)
│
├── scripts/                      ← Utility scripts
├── pnpm-workspace.yaml           ← Workspace config, catalog version pins
├── tsconfig.base.json            ← Shared strict TypeScript config
└── tsconfig.json                 ← Solution file (composite libs only)
```

### Data Flow (Current — Mock Only)
```
mockData.ts → Component props → Rendered UI
```

### Data Flow (Target — MVP v2)
```
PostgreSQL ← Drizzle ORM ← Express Routes ← OpenAPI Spec
                                                    ↓
                                              Orval Codegen
                                                    ↓
                                         React Query Hooks
                                                    ↓
                                           React Components
```

### Networking
The Replit global reverse proxy routes all traffic by path. The frontend is served at `/` and the API server is served at `/api`. Services bind to `PORT` environment variable assigned by the Replit workflow system. No hardcoded ports anywhere in application code.

---

## 4. UI Structure

```
App (flex h-screen, dark forced)
│
├── LEFT COLUMN (280px fixed, shrink-0)
│   └── ChatPanel
│       ├── Header — label + animated status dot
│       ├── ConversationList — 35% height, overflow-y-auto
│       ├── ChatThread — flex-1, overflow-y-auto, user/assistant bubbles
│       └── InputArea — shrink-0 bottom, textarea + send + chips
│
├── CENTER COLUMN (flex-1)
│   └── AnalyticsHub
│       ├── StatusBar — h-8, shrink-0, workspace name + counters
│       └── ScrollContainer (overflow-y-auto, p-6, space-y-8)
│           ├── KPIRow — grid-cols-4 → MetricCard × 4
│           ├── HotelGrid — grid-cols-2 xl:grid-cols-3 → HotelCard × 6
│           ├── ComparisonSection → ComparisonMatrix + Add button
│           └── ResearchWorkspace — tabs + ResearchCard × 2
│
└── RIGHT COLUMN (320px fixed, shrink-0)
    └── ActivityPanel
        ├── ActivityLog — h-[45%], overflow-y-auto, LogEntry × 12
        ├── DataSources — h-[25%], overflow-y-auto, SourceCard × 5
        └── QuickResearch — flex-1, search input + chips + MarketPulse
```

---

## 5. Implemented Components

### `src/App.tsx`
Root shell. Mounts the three-column flex layout and applies the `dark` class to `document.documentElement` via `useEffect` on mount. No router, no query client (pending MVP v2). Imports: `ChatPanel`, `AnalyticsHub`, `ActivityPanel`.

### `src/components/ChatPanel.tsx`
Full left column implementation. Uses `mockConversations` and `mockChatMessages` from `mockData.ts`. Renders markdown-bold inline using `dangerouslySetInnerHTML` with a regex replace (`**text**` → `<strong>`). Input area is a static `<textarea>` — no submit handler yet. Dependencies: `lucide-react` (Send, Terminal icons).

### `src/components/AnalyticsHub.tsx`
Full center column implementation. Orchestrates all center-column sub-sections. Uses `mockKPIs` and `mockHotels`. Research workspace session cards are hardcoded inline (not yet a separate component). Dependencies: `MetricCard`, `HotelCard`, `ComparisonMatrix`, `lucide-react` (Download, FolderOpen, Play).

### `src/components/ActivityPanel.tsx`
Full right column implementation. Uses `mockLogs`, `mockSources`, `mockMarketPulse`. Activity log entries render as a 3-column CSS grid (timestamp | badge | message) for alignment. Manual Import source renders an `<Upload>` icon button instead of a status label. Dependencies: `lucide-react` (Activity, Search, Upload).

### `src/components/HotelCard.tsx`
Reusable hotel property card. Accepts a single `hotel: any` prop (typed `any` — pending proper interface). Renders star icons dynamically using `Array.from({ length: hotel.stars })`. Sparkline bars use inline `style={{ height: \`${h * 3}px\` }}` with an opacity gradient. Dependencies: `lucide-react` (MapPin, Star).

### `src/components/ComparisonMatrix.tsx`
Self-contained table component. Hardcoded data array of 8 metric rows × 3 hotels. Per-row highlight logic is direct: `row.highlight` stores the column index (1-indexed) of the best value; `row.lowlight` stores the worst. No dynamic sorting yet. No external dependencies.

### `src/components/MetricCard.tsx`
KPI card. Accepts a `kpi: any` prop. Sparkline bars in bottom-right corner use `opacity: 0.5 + (i * 0.08)` for a left-to-right fade. Bars are hidden at `opacity-50` and transition to full opacity on parent hover via `group`/`group-hover` Tailwind classes. No external dependencies beyond Tailwind.

### `src/data/mockData.ts`
Central mock data store. Exports 7 typed arrays. All components import exclusively from this file — no inline hardcoded data in components except `ComparisonMatrix` (deliberate isolation for highlight logic). No runtime computation — pure static data.

### `src/index.css`
Global styles. Google Fonts import (`Inter`, `JetBrains Mono`) must remain the first line. Full dark theme palette in both `:root` and `.dark` blocks (no red placeholder values remain). Custom webkit scrollbar definitions (4px, rounded thumb). Tailwind CSS v4 import via `@import "tailwindcss"`.

---

## 6. Mock Data Sources

All data in the current UI is static and defined in `src/data/mockData.ts`. No network requests are made. No database is read.

| Export | Records | Used By | Description |
|---|---|---|---|
| `mockConversations` | 3 | `ChatPanel` | Past AI research sessions with title, time, preview |
| `mockChatMessages` | 4 | `ChatPanel` | Single conversation thread, alternating user/assistant |
| `mockKPIs` | 4 | `AnalyticsHub` → `MetricCard` | Portfolio-level aggregate metrics with sparkline bar data |
| `mockHotels` | 6 | `AnalyticsHub` → `HotelCard` | Full hotel property objects (name, stars, ADR, RevPAR, occ, market, segment, status, trend, sparkline bars) |
| `mockLogs` | 12 | `ActivityPanel` | Timestamped event log entries with type and color |
| `mockSources` | 5 | `ActivityPanel` | Data source connection cards with status |
| `mockMarketPulse` | 4 | `ActivityPanel` | City-level YoY RevPAR trend indicators |

**Replacement strategy:** When the backend is wired, every `mockData.ts` import in each component will be replaced with the corresponding Orval-generated React Query hook. Component render logic does not need to change — only the data source.

---

## 7. Known Limitations

### Functional Limitations
| Limitation | Impact | Resolution in Phase |
|---|---|---|
| No AI inference | Chat is display-only; no real responses | MVP v2 |
| No data persistence | All state is lost on refresh | MVP v2 |
| Filter tabs non-functional | Hotel grid shows all hotels regardless of tab | MVP v2 |
| Comparison matrix hardcoded | Cannot add/remove hotels from comparison | MVP v2 |
| Chat input has no submit handler | Typing in chat does nothing | MVP v2 |
| Research workspace tabs non-functional | Only Active Research tab has content | MVP v2 |
| Export PDF button non-functional | No report generation logic | MVP v3 |
| Add Hotel to Comparison non-functional | Button does nothing | MVP v2 |
| Activity log is static | Not updated by real events | MVP v2 |
| Status bar clock is static | Renders a fixed time string | MVP v2 |

### Technical Limitations
| Limitation | Impact | Resolution |
|---|---|---|
| `any` prop types on `HotelCard` and `MetricCard` | No TypeScript safety on hotel data shape | Replace with generated types after Orval codegen |
| No error boundaries | Unhandled component errors crash the whole UI | Add `<ErrorBoundary>` wrappers in MVP v2 |
| No loading states | No skeletons or spinners for async transitions | Add in MVP v2 when hooks return `isLoading` |
| No empty states | Empty hotel list or empty log shows nothing | Add `<Empty>` fallbacks in MVP v2 |
| Desktop-only layout | Below ~900px the three-column layout breaks | Accepted constraint — out of scope |
| No accessibility audit | ARIA labels, focus management not reviewed | Schedule before public launch |

---

## 8. Future Integrations

### Priority Order
1. **OpenRouter / DeepSeek** — AI chat engine (highest business value, unblocks core feature)
2. **PostgreSQL** — persistence layer (required for all CRUD and history)
3. **STR Global** — primary benchmarking data source
4. **OTA Insight** — rate shopping and rate parity data
5. **HotStats** — P&L metrics (TRevPAR, GOPPAR, labor costs)
6. **Web Research Agent** — automated search and extraction pipeline
7. **Image Generation** — property photos, chart renders, report covers

### Integration Summary Table

| Integration | Type | Auth | Data Provided | Priority |
|---|---|---|---|---|
| OpenRouter (DeepSeek) | REST + SSE | API key | AI chat completions | P0 |
| PostgreSQL (Replit) | Native | DATABASE_URL | All persistence | P0 |
| STR Global | REST API | API key + credentials | RevPAR, ADR, Occ benchmarking | P1 |
| OTA Insight | REST API | API key | Rate shopping, competitive rates | P1 |
| HotStats | REST API | API key | P&L metrics, GOPPAR, TRevPAR | P1 |
| Web research agent | LLM-orchestrated | None (via OpenRouter) | Unstructured market data | P2 |
| Replicate / Stability AI | REST API | API key | Hotel property images | P3 |
| PDF generation (Puppeteer) | Internal | None | Report exports | P2 |

---

## 9. OpenRouter Integration Plan

### Overview
Hotel Analytics Pro will use DeepSeek (`deepseek/deepseek-chat`) via OpenRouter for all AI chat inference. The confirmed available model ID (as of June 2026) is `deepseek/deepseek-chat`. The integration uses Server-Sent Events (SSE) for streaming token delivery to the frontend.

### Architecture
```
ChatPanel (fetch + ReadableStream)
    ↓  POST /api/openrouter/conversations/{id}/messages
Express Route Handler
    ↓  openrouter.chat.completions.create({ stream: true })
OpenRouter API → DeepSeek
    ↓  SSE token stream
Express → res.write(data: {...})
    ↓
ChatPanel → token appended to message in real time
    ↓
Message saved to DB on stream completion
```

### Implementation Steps

**Step 1 — Copy integration template**
```bash
cp -r .local/skills/ai-integrations-openrouter/templates/lib/* lib/
```
This creates:
- `lib/integrations-openrouter-ai/` — pre-configured OpenAI SDK client pointed at OpenRouter
- `lib/db/src/schema/conversations.ts` — Drizzle schema for `conversations` table
- `lib/db/src/schema/messages.ts` — Drizzle schema for `messages` table

**Step 2 — Environment variables**
```
AI_INTEGRATIONS_OPENROUTER_BASE_URL=<assigned by Replit AI Integrations>
AI_INTEGRATIONS_OPENROUTER_API_KEY=<assigned by Replit AI Integrations>
```
These are auto-provisioned if the user upgrades to use Replit AI Integrations. Alternatively, set `OPENROUTER_API_KEY` as a secret and construct the client manually pointing at `https://openrouter.ai/api/v1`.

**Step 3 — Add to tsconfig references**
- Add `{ "path": "./lib/integrations-openrouter-ai" }` to root `tsconfig.json`
- Add `{ "path": "../../lib/integrations-openrouter-ai" }` to `artifacts/api-server/tsconfig.json`
- Add `"@workspace/integrations-openrouter-ai": "workspace:*"` to `artifacts/api-server/package.json` dependencies

**Step 4 — Export DB schema**
Add to `lib/db/src/schema/index.ts`:
```typescript
export * from "./conversations";
export * from "./messages";
```

**Step 5 — Add OpenAPI spec entries**
Add the OpenRouter paths and schemas to `lib/api-spec/openapi.yaml` from the reference in `.local/skills/ai-integrations-openrouter/references/openapi.md`:
- `GET /openrouter/conversations`
- `POST /openrouter/conversations`
- `GET /openrouter/conversations/{id}`
- `DELETE /openrouter/conversations/{id}`
- `GET /openrouter/conversations/{id}/messages`
- `POST /openrouter/conversations/{id}/messages` (SSE stream)

**Step 6 — Run codegen**
```bash
pnpm --filter @workspace/api-spec run codegen
```

**Step 7 — Run database migration**
```bash
pnpm --filter @workspace/db run push
```

**Step 8 — Implement route handlers**
Create `artifacts/api-server/src/routes/openrouter/` with handlers for all 6 endpoints. Use the SSE streaming pattern:
```typescript
import { openrouter } from "@workspace/integrations-openrouter-ai";

const stream = await openrouter.chat.completions.create({
  model: "deepseek/deepseek-chat",
  max_tokens: 8192,
  messages: chatHistory,
  stream: true,
  system: HOTEL_ANALYTICS_SYSTEM_PROMPT,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    fullResponse += content;
    res.write(`data: ${JSON.stringify({ content })}\n\n`);
  }
}
res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
res.end();
```

**Step 9 — Wire frontend**
Replace static `mockChatMessages` in `ChatPanel.tsx` with:
- `useListOpenrouterConversations()` for conversation list
- `useGetOpenrouterConversation(id)` for message thread
- `fetch` + `ReadableStream` for SSE message streaming (do NOT use generated hook for the stream endpoint)

**System Prompt Recommendation**
The DeepSeek system prompt should include:
- Role definition: "You are a hotel analytics research assistant specializing in hospitality industry performance metrics..."
- Domain context: RevPAR, ADR, occupancy, GOPPAR, TRevPAR, competitive set analysis
- Response format guidance: use markdown tables for comparisons, bullet lists for summaries, bold for key metrics
- Scope constraint: focus on hotel industry; redirect off-topic queries

---

## 10. Hotel APIs Integration Plan

### 10.1 STR Global
STR (Smith Travel Research) is the industry standard for hotel benchmarking data — RevPAR, ADR, occupancy, supply/demand indices (Occ Index, ADR Index, RevPAR Index = MPI/ARI/RGI).

**Integration approach:** STR provides a REST API with OAuth 2.0. Data is typically pulled on a scheduled basis (daily/weekly) rather than real-time. Recommended architecture:
- Nightly cron job calls STR API for each tracked hotel's competitive set
- Results stored in a `benchmarks` Drizzle table keyed by `(hotel_id, date, metric)`
- Frontend reads from the local DB — never calls STR directly
- Activity log records each successful sync with timestamp and record count

**Key endpoints to target:**
- `/v3/benchmarks` — RevPAR/ADR/Occ for a specific property and date range
- `/v3/segments` — segment-level data (luxury, upscale, etc.)
- `/v3/markets` — market-level aggregate data

**DB schema additions needed:**
```typescript
benchmarksTable = pgTable("benchmarks", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").references(() => hotelsTable.id),
  date: date("date").notNull(),
  metric: text("metric").notNull(),       // "revpar", "adr", "occ"
  value: numeric("value", { precision: 10, scale: 2 }),
  index: numeric("index", { precision: 6, scale: 2 }), // MPI/ARI/RGI
  source: text("source").default("str_global"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 10.2 OTA Insight
OTA Insight provides rate shopping data — competitor rates across OTAs (Booking.com, Expedia, Hotels.com) and rate parity monitoring.

**Integration approach:** OTA Insight REST API with API key. Rate data is volatile (changes multiple times per day) so a more frequent sync (every 2-4 hours) is appropriate. Store the last N rate snapshots per hotel per channel.

**Key data points:**
- Competitor rates by date (rate shopping)
- Rate parity violations across OTA channels
- Pickup data (reservations made each day for future dates)

### 10.3 HotStats
HotStats provides P&L benchmarking data — TRevPAR (total revenue per available room), GOPPAR (gross operating profit per available room), labor cost benchmarks.

**Integration approach:** HotStats API with credentials. Monthly P&L data is the primary cadence (revenue and profit data finalizes month-end). Store in a separate `financial_benchmarks` table.

**Key data points:**
- TRevPAR, GOPPAR, EBITDAR
- Departmental revenue splits (rooms, F&B, spa, other)
- Labor cost per available room

### 10.4 Manual CSV Import
For hotels or markets not covered by the above APIs, the Manual Import feature in the Data Sources panel will accept CSV uploads. The backend should:
1. Accept `multipart/form-data` POST at `/api/hotels/import`
2. Parse CSV using a server-side library (e.g. `csv-parse`)
3. Validate each row against a Zod schema
4. Insert valid rows into the `hotels` and `benchmarks` tables
5. Return a structured import result (rows imported, rows skipped, errors)

---

## 11. Image Generation Roadmap

Hotel Analytics Pro has two use cases for image generation:

### 11.1 Hotel Property Photos
Hotel cards currently show no images — they are purely data-driven. For visual enrichment, property photos can be generated or sourced.

**Option A — AI Generation (Replicate / Stability AI)**
Generate photorealistic hotel exterior/lobby images using a text prompt per hotel. Example prompt pattern:
```
"Luxury hotel exterior, {hotel_name}, {city}, professional architectural photography,
golden hour lighting, 4K, ultra-detailed"
```
Generated images stored in Replit Object Storage keyed by `hotel_id`. Regenerated on demand or when hotel details change.

**Option B — Stock Images (Unsplash API)**
Query Unsplash for `"hotel {city} luxury exterior"`. Free tier allows 50 requests/hour. Store the selected image URL in the `hotels` table (`cover_image_url` column).

**Recommended implementation order:**
1. Add `cover_image_url` column to `hotels` table (nullable)
2. Implement stock image search first (Unsplash — faster, free)
3. Add AI generation as a premium alternative (higher quality, requires API key)
4. Display in `HotelCard` as a fixed-height image header above the metric cells

### 11.2 Report Cover Images
When generating PDF reports, each report should include a generated cover image representing the market or property being analyzed.

**Approach:**
- On report creation, fire an async image generation job
- Use a prompt like: `"Hotel skyline panorama, {city}, professional business report cover, dark blue tones"`
- Store in Object Storage keyed by `report_id`
- Embed in PDF using Puppeteer's `<img>` src

### 11.3 Market Visualization Charts
For richer analytics panels, future phases may generate chart images server-side (Recharts rendered via Puppeteer headless) for inclusion in exported reports. This is separate from the CSS sparklines already implemented.

---

## 12. Development Roadmap

### Phase 1 — MVP v2: Backend & AI Chat
**Estimated scope:** 2–3 development sessions

| Task | Details |
|---|---|
| Write OpenAPI spec | Hotels CRUD, conversations/messages, research sessions, benchmarks |
| Run Orval codegen | Generate React Query hooks and Zod schemas |
| Provision PostgreSQL | Via Replit built-in DB |
| Write Drizzle schema | `hotels`, `conversations`, `messages`, `research_sessions`, `benchmarks` |
| Run DB migration | `pnpm --filter @workspace/db run push` |
| Implement API routes | Hotels CRUD, OpenRouter chat with SSE streaming |
| Seed sample data | 6 hotels matching current mock data, 1 conversation |
| Wire frontend | Replace `mockData.ts` imports with generated React Query hooks |
| Activate AI chat | Real DeepSeek streaming, conversation persistence |
| Fix functional gaps | Filter tabs, comparison hotel selection, chat submit handler |

### Phase 2 — MVP v3: Data Integrations
**Estimated scope:** 3–5 development sessions

| Task | Details |
|---|---|
| STR Global integration | Nightly benchmarking sync, RevPAR/ADR/Occ indices |
| OTA Insight integration | Rate shopping data, rate parity monitoring |
| HotStats integration | P&L metrics (TRevPAR, GOPPAR) |
| Web research agent | LLM-orchestrated search + extraction via OpenRouter |
| Alert engine | Threshold breach detection, ALERT log entries |
| Scheduled sync jobs | Cron-based data refresh with activity log recording |
| CSV import | `multipart/form-data` hotel import with validation |

### Phase 3 — Reporting & Export
**Estimated scope:** 2–3 development sessions

| Task | Details |
|---|---|
| PDF generation | Puppeteer headless render of report templates |
| Report builder | UI for composing structured market reports |
| Export PDF / Excel | Download buttons functional |
| Saved Reports tab | List, open, delete, re-export saved reports |
| Hotel property images | Unsplash integration for card cover photos |
| Report cover images | AI-generated covers for PDF exports |
| Data Sources tab | Live connection management UI |

### Phase 4 — Polish & Launch
**Estimated scope:** 1–2 development sessions

| Task | Details |
|---|---|
| Accessibility audit | ARIA labels, keyboard nav, focus management |
| Error boundaries | `<ErrorBoundary>` wrappers, graceful degradation |
| Empty states | `<Empty>` components for all list/grid views |
| Loading skeletons | Skeleton placeholders while data loads |
| Live clock | Real-time UTC clock in status bar |
| Onboarding flow | First-run state with "Add your first hotel" prompt |
| Performance audit | React DevTools profiling, memo optimization |
| Deployment configuration | Production env vars, domain, TLS |

---

## 13. Recommended Next Phases

### Immediate Priority (start here)

**1. Write the OpenAPI spec first.**
`lib/api-spec/openapi.yaml` is the critical path. Every subsequent step — codegen, frontend hooks, backend routes, and DB schema — is gated on having a correct spec. The spec should define these resource groups in order of importance:
- `/hotels` (CRUD for tracked properties)
- `/openrouter/conversations` and `/messages` (AI chat persistence)
- `/research-sessions` (research project management)
- `/benchmarks` (performance data)
- `/reports` (report management)

**2. Run codegen immediately after the spec is complete.**
```bash
pnpm --filter @workspace/api-spec run codegen
```
Do not write any hand-crafted types. All types on both the client and server come from the spec via Orval.

**3. Provision the database before writing routes.**
```bash
# In the code_execution sandbox:
await createDatabase();
```
Then write the Drizzle schema files in `lib/db/src/schema/` and run `pnpm --filter @workspace/db run push`.

**4. Launch a DESIGN subagent to replace mock data in parallel with backend work.**
The design subagent can replace all `mockData.ts` imports with real React Query hooks while the main agent writes backend routes. This parallelism is critical — the frontend wiring does not block on backend completion.

### Do Not Do (common mistakes to avoid)

- **Do not write TypeScript interfaces manually** for API entities. Wait for Orval codegen and use generated types everywhere.
- **Do not call STR, HotStats, or OTA Insight directly from the frontend.** All third-party API calls must go through the Express backend. This is required for CORS compliance and secret management.
- **Do not add `pnpm run dev` to the workspace root.** Each artifact runs via the Replit workflow system with injected `PORT` and `BASE_PATH` environment variables.
- **Do not add `artifacts/hotel-analytics` to the root `tsconfig.json` references.** That solution file is for buildable lib packages only. Leaf artifact typechecks use `tsc --noEmit` independently.
- **Do not provision the database before launching the design subagent.** Database work does not gate the frontend — only the OpenAPI spec and codegen do. Front-loading DB work delays time-to-first-rendered-output.

---

## 14. Deployment Notes

### Development
The app runs via Replit's workflow system. Three workflows are active:

| Workflow | Command | Port | Path |
|---|---|---|---|
| `artifacts/hotel-analytics: web` | `pnpm --filter @workspace/hotel-analytics run dev` | Assigned | `/` |
| `artifacts/api-server: API Server` | `pnpm --filter @workspace/api-server run dev` | 8080 | `/api` |
| `artifacts/mockup-sandbox: Component Preview Server` | Internal | 8081 | `/__mockup` |

### Production (Replit Publish)
When the user clicks "Publish" in the Replit UI, the platform:
1. Runs the production build (`vite build`) for the `hotel-analytics` artifact
2. Builds the `api-server` bundle via `esbuild`
3. Diffs the development database schema against the production database and prompts for rename confirmations
4. Deploys static files to the CDN and starts the API server process
5. Assigns a `.replit.app` domain (or custom domain if configured) with TLS

**Critical before publishing:**
- All CSS custom property values must be set (no `red` placeholders) — already done
- `PORT` and `BASE_PATH` env vars must not be hardcoded — already correct
- `DATABASE_URL` must be set in the production environment — handled by Replit's Publish flow
- `AI_INTEGRATIONS_OPENROUTER_BASE_URL` and `AI_INTEGRATIONS_OPENROUTER_API_KEY` must be set before enabling AI features in production

### Production Schema Migrations
**Do not write custom migration scripts or apply DDL at server startup.** Replit's Publish flow handles schema migrations automatically by diffing the development schema (from Drizzle) against production. The correct flow is:
1. Modify `lib/db/src/schema/` files in development
2. Run `pnpm --filter @workspace/db run push` to apply to development DB
3. Click Publish — Replit diffs and applies to production, requesting rename confirmations in the UI

### Environment Variables Required for Production

| Variable | Where to set | Notes |
|---|---|---|
| `PORT` | Assigned by Replit | Do not set manually |
| `BASE_PATH` | Assigned by Replit | Do not set manually |
| `DATABASE_URL` | Assigned by Replit DB | Auto-set on Publish |
| `SESSION_SECRET` | Replit Secrets | Set before auth is added |
| `AI_INTEGRATIONS_OPENROUTER_BASE_URL` | Replit Secrets | Set when AI is activated |
| `AI_INTEGRATIONS_OPENROUTER_API_KEY` | Replit Secrets | Set when AI is activated |
| `STR_API_KEY` | Replit Secrets | Phase 2 |
| `OTA_INSIGHT_API_KEY` | Replit Secrets | Phase 2 |
| `HOTSTATS_API_KEY` | Replit Secrets | Phase 2 |

---

## 15. Project Status

### Delivery Summary

| Area | Status | Notes |
|---|---|---|
| Three-column terminal layout | Delivered | All columns, all panels, correct sizing |
| Dark theme (full palette) | Delivered | Zero red placeholder values remaining |
| Chat panel (UI shell) | Delivered | Display-only; no AI inference yet |
| KPI metric cards | Delivered | 4 cards with sparklines and trend badges |
| Hotel cards grid (6 properties) | Delivered | Full card design with all data fields |
| Comparison matrix | Delivered | 3 hotels × 8 metrics, color highlighting |
| Research workspace | Delivered | Tabs + 2 session cards + progress bars |
| Activity log | Delivered | 12 entries, 5 badge types |
| Data sources panel | Delivered | 5 sources with status |
| Market pulse panel | Delivered | 4 cities with YoY trends |
| Quick research panel | Delivered | Search input + recent search chips |
| Static mock data layer | Delivered | `mockData.ts`, 7 exports |
| TypeScript compilation | Passing | `pnpm run typecheck` clean |
| Documentation | Delivered | README, PROJECT_SCOPE, UI_ARCHITECTURE, MVP_STATUS_REPORT, FINAL_HANDOFF |

### Not Delivered (Pending Future Phases)

| Area | Target Phase | Blocker |
|---|---|---|
| AI chat inference (DeepSeek) | Phase 1 | OpenRouter integration pending |
| Database persistence | Phase 1 | No DB provisioned yet |
| Hotel CRUD operations | Phase 1 | No backend routes yet |
| Working filter tabs | Phase 1 | Requires real data and state management |
| Dynamic comparison matrix | Phase 1 | Requires hotel selection state |
| STR / HotStats / OTA Insight | Phase 2 | API credentials and DB schema needed |
| Web research agent | Phase 2 | Requires OpenRouter + LLM orchestration |
| PDF report export | Phase 3 | Requires Puppeteer and report templates |
| Hotel property images | Phase 3 | Requires image source (Unsplash or generation) |
| Accessibility compliance | Phase 4 | Not yet audited |

### Confidence Assessment

The UI shell is production-quality in visual fidelity and component structure. The architecture choices (OpenAPI-first, Drizzle ORM, Orval codegen, monorepo layout) are sound and will support the full feature roadmap without refactoring. The primary risk is the OpenRouter API key situation — the Replit AI Integrations managed key was unavailable at MVP v1 time due to account tier. If the user cannot upgrade, an alternative direct OpenRouter API key (from openrouter.ai/keys) can be stored as the `OPENROUTER_API_KEY` secret and used to construct the client manually, bypassing the Replit-managed provisioning entirely.

---

*Document prepared by Replit Agent. For questions about implementation decisions, see `UI_ARCHITECTURE.md`. For the full feature backlog, see `MVP_STATUS_REPORT.md`. For integration setup instructions, follow the skill references in `.local/skills/`.*
