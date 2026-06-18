# Hotel Analytics Pro

A Bloomberg terminal-style hotel analytics and research workspace for hospitality industry analysts. Track hotel properties, compare performance metrics, run AI-assisted research, and generate market intelligence reports — all within a single dense, data-rich interface.

---

## What It Does

Hotel Analytics Pro gives analysts a unified workspace to:

- **Monitor hotel properties** — track ADR, RevPAR, and occupancy across a portfolio of properties worldwide
- **Compare competitors** — side-by-side matrix comparing key performance indicators across hotels
- **Research markets** — AI chat assistant (DeepSeek) for natural language queries about hotel data
- **Track activity** — live log of data syncs, alerts, searches, and AI completions
- **Manage data sources** — view connection status for STR Global, HotStats, OTA Insight, and manual imports

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Icons | Lucide React |
| Fonts | Inter (UI), JetBrains Mono (data) |
| State | React local state (useState/useEffect) |
| Build | esbuild via Vite |
| Monorepo | pnpm workspaces |

---

## Running Locally

```bash
# Install dependencies
pnpm install

# Start the hotel analytics frontend
pnpm --filter @workspace/hotel-analytics run dev

# Start the API server (when backend is wired)
pnpm --filter @workspace/api-server run dev

# Full typecheck
pnpm run typecheck
```

The app is served at `http://localhost:<PORT>/` — the `PORT` environment variable is assigned by the Replit workflow system.

---

## Project Structure

```
artifacts/hotel-analytics/
├── src/
│   ├── App.tsx                    # Root layout — three-column shell
│   ├── main.tsx                   # Entry point, forces dark mode
│   ├── index.css                  # Global dark theme + custom scrollbars
│   ├── components/
│   │   ├── ChatPanel.tsx          # Left column: AI research assistant
│   │   ├── AnalyticsHub.tsx       # Center column: metrics, cards, comparison
│   │   ├── ActivityPanel.tsx      # Right column: logs, sources, market pulse
│   │   ├── HotelCard.tsx          # Individual hotel property card
│   │   ├── ComparisonMatrix.tsx   # Side-by-side hotel comparison table
│   │   ├── MetricCard.tsx         # KPI summary card with sparkline
│   │   └── ui/                    # shadcn/ui base components
│   ├── data/
│   │   └── mockData.ts            # All static sample data
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   └── pages/
│       └── not-found.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Current Status

**MVP v1 — UI Shell complete.** All components are built with static mock data. No live API integration, AI inference, or database persistence is wired yet. See `MVP_STATUS_REPORT.md` for a full breakdown.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Assigned by Replit workflow — do not hardcode |
| `BASE_PATH` | Yes | URL prefix for the app (assigned by Replit proxy) |
| `DATABASE_URL` | Future | PostgreSQL connection string for persistence |
| `AI_INTEGRATIONS_OPENROUTER_BASE_URL` | Future | OpenRouter proxy URL for DeepSeek |
| `AI_INTEGRATIONS_OPENROUTER_API_KEY` | Future | OpenRouter API key for DeepSeek |

---

## Documentation

| File | Description |
|---|---|
| `README.md` | This file — project overview and setup |
| `PROJECT_SCOPE.md` | Goals, constraints, and feature boundaries |
| `UI_ARCHITECTURE.md` | Component tree, layout system, and design decisions |
| `MVP_STATUS_REPORT.md` | What is built, what is pending, and the roadmap |
