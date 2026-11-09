# SAGRank Frontend Console

Luxury High-Performance Web Console for SAGRank built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Lucide React**.

---

## 🏛️ Directory Architecture

```
frontend/src/
├── app/
│   ├── favicon.ico
│   ├── globals.css             # Luxury monochrome theme & glassmorphic utility classes
│   ├── layout.tsx              # Root HTML shell, fonts & meta tags
│   └── page.tsx                # Master UI orchestrator (clean, decoupled)
├── components/
│   ├── features/               # Feature-driven modular UI components
│   │   ├── analytics/
│   │   │   ├── AeoGeoTab.tsx           # AI Overview citation readiness & AEO blueprint
│   │   │   ├── CompetitorTopicsTab.tsx # Competing topics, volume & competition pills
│   │   │   ├── ContentFormulasTab.tsx  # High-CTR titles & PAA questions with 1-click copy
│   │   │   └── PrimaryDials.tsx        # 4 Primary metric cards (Verdict, Demand, Supply, Weak Spots)
│   │   ├── landing/
│   │   │   └── LandingShowcase.tsx     # Hero value prop, 3 capability cards & trust strip
│   │   ├── scanner/
│   │   │   └── ScanningConsole.tsx     # Live radar console, 1.4s pacing, & shimmering skeletons
│   │   └── search/
│   │       └── SearchCommandBar.tsx    # Keyword input, geo dropdown, submit button & quick presets
│   ├── layout/
│   │   ├── Footer.tsx          # Minimalist brand footer
│   │   └── Header.tsx          # Top navigation bar & Live Engines indicator
│   └── visuals/
│       └── Background3D.tsx    # Interactive 3D starlight constellation canvas
├── hooks/                      # Custom reusable React hooks
│   ├── useClipboard.ts         # Async clipboard copy with auto-resetting feedback
│   └── useScanningPacer.ts     # Anti-jitter radar step pacing & smooth progress interpolation
├── lib/                        # Pure utility functions & formatters
│   └── exportCsv.ts            # Dynamic CSV serialization and download handler
├── services/                   # Typed HTTP API Client layer
│   └── api.ts                  # Engine API call contracts & error mappings
└── types/                      # Single source of truth for TypeScript interfaces
    └── keyword.ts              # Domain interfaces (SERP, Competitor, AEO, Response)
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` if you need custom API URLs:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Lint
```bash
npm run build
npm run lint
```
