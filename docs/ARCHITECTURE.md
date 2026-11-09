# GanimiRank System Architecture

Technical architecture specification for **GanimiRank (गनिमी रैंक)** — Autonomous Search Intelligence & AEO/GEO Dominance Engine.

---

## 🏛️ High-Level System Architecture

```
               ┌────────────────────────────────────────────────────────┐
               │                  User Browser Client                   │
               │         Next.js 16 + Tailwind CSS v4 + 3D Canvas       │
               └───────────────────────────┬────────────────────────────┘
                                           │ HTTP REST (JSON)
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │             GanimiRank Backend (FastAPI)               │
               │              Port 8000 / Uvicorn Daemon                │
               └───────────┬───────────────────────────────┬────────────┘
                           │                               │
             48-Hour Cache │ Hits            Miss / Expired│ Fallback
                           ▼                               ▼
               ┌───────────────────────┐       ┌────────────────────────┐
               │   SQLite Local DB     │       │ External Live Engines  │
               │   (backend/data/*.db) │       │ (Zero-Key Open APIs)   │
               └───────────────────────┘       └───────────┬────────────┘
                                                           │
                               ┌───────────────────────────┴───────────────────────────┐
                               ▼                                                       ▼
               ┌───────────────────────────────┐                       ┌───────────────────────────────┐
               │ Google Autocomplete Endpoint  │                       │   DuckDuckGo Live SERP        │
               │ (suggestqueries.google.com)   │                       │   (html.duckduckgo.com)       │
               │ Real-time search suggestions  │                       │   Page 1 Organic Weak Spots   │
               └───────────────────────────────┘                       └───────────────────────────────┘
```

---

## 🧩 Decoupled Frontend Layer (`frontend/src/`)

The frontend adheres to the **MNC Feature-Driven Modular Architecture**:

```
frontend/src/
├── app/
│   ├── layout.tsx              # Root HTML wrapper, metadata, and fonts
│   ├── globals.css             # Luxury monochrome theme & glassmorphic styles
│   └── page.tsx                # Master UI Orchestrator (180 lines, zero business logic)
├── components/
│   ├── features/               # Domain-specific Feature Components
│   │   ├── analytics/
│   │   │   ├── PrimaryDials.tsx        # 4 Metric Dials (Verdict, Demand, Supply, Weak Spots)
│   │   │   ├── CompetitorTopicsTab.tsx # Competing topics, volume & competition pills
│   │   │   ├── AeoGeoTab.tsx           # AI Overview citation readiness & AEO blueprint
│   │   │   └── ContentFormulasTab.tsx  # High-CTR titles & PAA questions with 1-click copy
│   │   ├── landing/
│   │   │   └── LandingShowcase.tsx     # Hero value prop, 3 capability cards & trust strip
│   │   ├── scanner/
│   │   │   └── ScanningConsole.tsx     # Live radar console, 1.4s pacing, & shimmering skeletons
│   │   └── search/
│   │       └── SearchCommandBar.tsx    # Keyword input, geo dropdown, submit button & quick presets
│   ├── layout/
│   │   ├── Header.tsx          # Navigation bar, brand logo, status pills
│   │   └── Footer.tsx          # Minimalist brand footer
│   └── visuals/
│       └── Background3D.tsx    # Interactive 3D starlight constellation canvas
├── hooks/
│   ├── useClipboard.ts         # Async clipboard copy with auto-resetting feedback
│   └── useScanningPacer.ts     # Anti-jitter radar step pacing & smooth progress interpolation
├── lib/
│   └── exportCsv.ts            # CSV report serialization and download handler
├── services/
│   └── api.ts                  # Strongly typed API client wrappers
└── types/
    └── keyword.ts              # Domain interfaces (Single Source of Truth)
```

---

## ⚙️ Decoupled Backend Layer (`backend/app/`)

The backend separates HTTP handling, request/response contracts, and pure domain algorithms:

```
backend/
├── app/
│   ├── api/v1/endpoints.py     # REST Router: /api/v1/analyze, /api/v1/health
│   ├── core/config.py          # Pydantic BaseSettings & CORS configuration
│   ├── schemas/keyword.py      # Pydantic V2 Request & Response schemas
│   ├── services/               # Pure Domain Engines (Zero FastAPI dependencies)
│   │   ├── aeo_geo_engine.py   # AI Overview & Perplexity citation heuristics
│   │   ├── cache_service.py    # SQLite 48h persistent caching
│   │   ├── competitor_engine.py# Real-time competitor titles & demand extraction
│   │   ├── expansion_engine.py # Alphabet Soup & intent modifiers
│   │   ├── scoring_engine.py   # KGR ratio, SERP weak spot & guerrilla scoring
│   │   ├── serp_engine.py      # DuckDuckGo HTML parsing & Serper fallback
│   │   └── title_engine.py     # 7 High-CTR Headline formulas & PAA outlines
│   └── main.py                 # FastAPI application factory
├── data/                       # Local SQLite storage (gitignored)
│   └── ganimirank.db
├── tests/                      # Automated Pytest suite
│   ├── test_engines.py
│   └── test_health.py
└── pytest.ini                  # Pytest configuration (pythonpath = .)
```

---

## 🛡️ Zero-Paid-API Architecture

| Capability | Source | Endpoint | Authentication | Cost |
| :--- | :--- | :--- | :--- | :--- |
| **Search Suggestions** | Google Autocomplete | `suggestqueries.google.com` | None (Public) | $0.00 |
| **Organic SERP & Weak Spots** | DuckDuckGo Scraper | `html.duckduckgo.com` | None (Public) | $0.00 |
| **SERP Fallback (Optional)** | Serper.dev | `google.serper.dev/search` | `X-API-KEY` (Optional) | Free tier |
| **AEO & GEO Scoring** | Local Heuristic Matrix | Local CPU algorithm | None (Local Python) | $0.00 |
| **Cache Storage** | SQLite 3 | `backend/data/ganimirank.db` | Local file | $0.00 |
