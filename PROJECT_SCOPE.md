# Project Scope — Hotel Analytics Pro

## Vision

A professional-grade hotel performance analytics workspace targeting revenue managers, asset managers, and hospitality consultants who need to monitor competitive sets, analyze market trends, and produce structured research reports. The interface is modeled on financial terminal aesthetics (Bloomberg, Reuters Eikon) — dense, precise, and designed for users who live in the data.

---

## Target Users

| Persona | Role | Primary Need |
|---|---|---|
| Revenue Manager | Monitors competitive set pricing and occupancy | Daily RevPAR/ADR benchmarking against comp set |
| Asset Manager | Oversees portfolio of owned/managed properties | Portfolio performance dashboard, YoY trend analysis |
| Hospitality Consultant | Produces market research reports for clients | AI-assisted research, market comparison, PDF export |
| Hotel Analyst | Conducts feasibility studies and competitor analysis | Web scraping, data aggregation, structured reporting |

---

## Core Feature Scope

### In Scope (MVP v1 — UI Shell)

- Three-column Bloomberg-style fixed layout
- AI research assistant chat panel (UI shell, static messages)
- Hotel property tracking cards with KPI metrics
- KPI summary dashboard (RevPAR Index, ADR, Occupancy, Market Score)
- Side-by-side hotel comparison matrix
- Activity / event log panel
- Data source connection status display
- Market pulse indicators by city
- Quick research search input and recent searches
- Research workspace with project cards and progress tracking

### In Scope (MVP v2 — Backend Integration)

- Live AI chat via DeepSeek through OpenRouter
- Persistent conversation history in PostgreSQL
- Hotel data CRUD (add, edit, delete tracked properties)
- Real database-backed comparison matrix
- Exportable PDF reports
- CSV import for manual data ingestion

### In Scope (MVP v3 — Data Integrations)

- STR Global API integration for benchmarking data
- HotStats API integration for P&L metrics
- OTA Insight API for rate shopping data
- Web research agent (automated search + extraction)
- Scheduled data sync with activity log entries
- Alert engine for threshold breaches (occupancy drops, ADR changes)

### Out of Scope

- Mobile or tablet layout (desktop-only tool)
- Multi-user collaboration or real-time presence
- Direct booking engine integration
- Guest review sentiment analysis (NLP)
- Revenue forecasting models (ML inference)
- White-labeling or multi-tenant architecture
- Map-based property visualization

---

## Constraints

| Constraint | Detail |
|---|---|
| No API keys in MVP v1 | All data is static mock data; no live integrations |
| Desktop-only layout | Three fixed columns at 280px / flex / 320px require minimum ~900px viewport |
| Dark mode only | The terminal aesthetic requires forced dark mode; light mode is not planned |
| No routing in MVP v1 | Single-page layout; no multi-page navigation |
| TypeScript strict mode | All code must pass `pnpm run typecheck` |

---

## Success Metrics

| Metric | Target |
|---|---|
| Time to first meaningful data view | < 2 seconds on load |
| Hotels tracked in MVP v2 | Up to 50 properties per workspace |
| AI query response time | < 5 seconds via streaming SSE |
| Comparison matrix size | Up to 5 hotels side-by-side |
| Report generation time | < 30 seconds for standard market report |

---

## Technical Boundaries

- **Frontend only in MVP v1.** The `api-server` artifact exists in the monorepo but is not consumed by the frontend yet.
- **pnpm monorepo.** All packages use `@workspace/` namespace. Shared types go in `lib/`. Do not duplicate types between `api-server` and `hotel-analytics`.
- **OpenAPI-first for backend.** When the backend is wired, all endpoints must be defined in `lib/api-spec/openapi.yaml` first, with Orval codegen producing the typed hooks consumed by the frontend.
- **No direct database access from the frontend.** All data goes through the Express API server.

---

## Milestones

| Milestone | Description | Status |
|---|---|---|
| M1 — UI Shell | Three-column layout, all panels, mock data | Complete |
| M2 — AI Chat | DeepSeek streaming chat via OpenRouter | Pending |
| M3 — Persistence | PostgreSQL schema, hotel CRUD, conversation history | Pending |
| M4 — Data Sources | STR, HotStats, OTA Insight API connections | Pending |
| M5 — Reports | PDF export, scheduled syncs, alert engine | Pending |
| M6 — Web Research | Automated search agent, data extraction pipeline | Pending |
