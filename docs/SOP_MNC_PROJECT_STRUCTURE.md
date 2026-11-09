# Standard Operating Procedure (SOP): Enterprise MNC Project Structure & Clean Architecture Standard

**Document ID:** SOP-ENG-001  
**Category:** Software Engineering Standards & Architecture  
**Target Audience:** Software Engineers, Tech Leads, AI Agents, Full-Stack Developers  
**Applicability:** All new and existing web applications, SaaS platforms, backends, and microservices  
**Version:** 2.0 (Tier-1 MNC / Fortune 500 Standard)

---

## 1. Executive Summary & Objective

In high-growth startups and Tier-1 MNCs (Google, Meta, Stripe, Netflix), code quality and maintainability determine shipping velocity. Codebases fail not because of complex algorithms, but because of **structural entropy**:
* 1000-line monolithic files (`page.tsx` or `app.py`).
* Business logic mixed into UI components or HTTP routes.
* Undocumented folder structures where developers waste hours finding where files belong.
* Hardcoded secrets, unhandled errors, and inconsistent naming.

**Objective of this SOP:**
Any developer or AI agent starting a new project must adhere to this SOP from **Day 1**. Following this blueprint guarantees that any engineer can clone the repository, instantly navigate the codebase, understand the domain boundaries, and contribute production-grade code without friction.

---

## 2. Core Architectural Principles (The 6 Pillars)

1. **Separation of Concerns (SoC):**
   * UI components render state; they do not perform data manipulation or HTTP requests.
   * HTTP route handlers validate requests; they do not execute business logic.
   * Business services perform domain logic; they do not interact directly with raw database connections or HTTP protocols.
2. **Single Responsibility Principle (SRP):**
   * Each file, component, and module must have one reason to change. Files exceeding 250–300 lines are immediate candidates for refactoring.
3. **Single Source of Truth (SSOT):**
   * Types, constants, and API endpoints must be defined in one canonical location and imported elsewhere. Never duplicate TypeScript interfaces or Python models across multiple files.
4. **Zero-Hardcoding Policy:**
   * URLs, ports, environment credentials, and feature flags must always read from environment configuration (`.env` via Pydantic or `process.env`).
5. **Feature-Driven Modularity:**
   * Components and services should be grouped by **business domain / feature** rather than arbitrary technical buckets.
6. **Strict Git Discipline:**
   * Never commit directly to `main`. Every change must pass through a dedicated feature branch, automated testing, and review.

---

## 3. Universal Naming Conventions

Consistency across files eliminates cognitive overload:

| Entity Type | Convention | Examples |
| :--- | :--- | :--- |
| **Folders & Directories** | `kebab-case` or lowercase | `components/features/search`, `services`, `hooks` |
| **React Components** | `PascalCase.tsx` | `SearchCommandBar.tsx`, `PrimaryDials.tsx` |
| **Custom React Hooks** | `camelCase.ts` prefixed with `use` | `useClipboard.ts`, `useScanningPacer.ts` |
| **Utility & Helper Files** | `camelCase.ts` or `kebab-case.ts` | `exportCsv.ts`, `formatDate.ts` |
| **TypeScript Types/Interfaces**| `PascalCase` within `keyword.ts` | `SERPResultItem`, `AnalyzeResponse` |
| **Python Modules & Files** | `snake_case.py` | `serp_engine.py`, `cache_service.py` |
| **Python Classes** | `PascalCase` | `KeywordAnalyzeRequest`, `DatabaseManager` |
| **Python Functions & Vars**| `snake_case` | `generate_competitor_topics()`, `local_geo` |
| **Constants / Enums** | `UPPER_SNAKE_CASE` | `MAX_SERP_ITEMS = 10`, `API_BASE_URL` |
| **Database Tables / Columns** | `snake_case` | `keyword_cache`, `created_at` |

---

## 4. Universal Monorepo / Full-Stack Root Blueprint

For full-stack applications with separate frontend and backend layers, the repository root must strictly follow this structure:

```
<project-root>/
├── .github/                      # CI/CD Workflows, GitHub issue & PR templates
│   ├── workflows/
│   │   ├── ci.yml                # Lint, build, & automated test verification
│   │   └── deploy.yml            # Deployment automation
│   └── pull_request_template.md
├── docs/                         # Official System & Engineering Documentation
│   ├── ARCHITECTURE.md           # High-level architecture, schemas, and data flow
│   ├── API_SPECIFICATION.md      # REST/GraphQL endpoints, payloads, and codes
│   ├── CHANGELOG.md              # Semantic versioning release history
│   └── SOP_PROJECT_STRUCTURE.md  # Copy of this engineering standard
├── backend/                      # Backend application service (FastAPI/Node/Go)
│   ├── app/                      # Source code
│   ├── data/                     # Local data files, databases (gitignored)
│   ├── tests/                    # Automated unit and integration tests
│   ├── requirements.txt / package.json
│   └── README.md                 # Backend-specific setup guide
├── frontend/                     # Frontend client console (Next.js/React/Vue)
│   ├── src/                      # Source code
│   ├── public/                   # Static media, icons, and assets
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md                 # Frontend-specific setup guide
├── scripts/                      # Developer automation and deployment scripts
│   ├── start.sh / start.bat      # 1-Click local development orchestrator
│   └── seed_db.py                # Database fixture/seeding utilities
├── .env.example                  # Template of required environment variables
├── .gitignore                    # Comprehensive ignore rules (secrets, venvs, builds)
├── LICENSE                       # Legal license
└── README.md                     # Project overview, value proposition & quickstart
```

---

## 5. Enterprise Frontend Architecture (Next.js / React)

Inside `frontend/src/`, code must be segregated into high-cohesion layers:

```
frontend/src/
├── app/                          # Next.js App Router (Routing & Layouts ONLY)
│   ├── favicon.ico
│   ├── globals.css               # Global styles, Tailwind directives, theme variables
│   ├── layout.tsx                # Global HTML wrapper, fonts, providers
│   ├── page.tsx                  # Root route: Page Orchestrator (< 200 lines)
│   └── (routes)/                 # Additional domain routes (e.g. /dashboard/page.tsx)
├── components/                   # Reusable UI Components
│   ├── features/                 # Domain-specific Feature Components
│   │   ├── <feature-a>/          # e.g., search/SearchCommandBar.tsx
│   │   ├── <feature-b>/          # e.g., scanner/ScanningConsole.tsx
│   │   └── <feature-c>/          # e.g., analytics/PrimaryDials.tsx
│   ├── layout/                   # Global chrome & skeleton layouts
│   │   ├── Header.tsx            # Navigation bar, brand logo, status pills
│   │   ├── Footer.tsx            # Universal footer & copyright
│   │   └── Sidebar.tsx           # App navigation sidebar (if applicable)
│   ├── ui/                       # Atomic Design Primitives (design system)
│   │   ├── Button.tsx            # Styled buttons with variant props
│   │   ├── Card.tsx              # Generic glassmorphic container
│   │   ├── Modal.tsx             # Accessible dialogs
│   │   └── Tooltip.tsx           # Information tooltips
│   └── visuals/                  # Graphic canvases & animation backgrounds
│       └── Background3D.tsx      # Canvas, Three.js, or complex SVG visuals
├── hooks/                        # Custom reusable React hooks (State & Lifecycle)
│   ├── useClipboard.ts           # Copy-to-clipboard with timeout feedback
│   └── usePolling.ts             # Polling / pacer timing mechanics
├── lib/                          # Pure deterministic helper utilities
│   ├── utils.ts                  # Tailwind clsx / twMerge helpers
│   └── exportCsv.ts              # Data serialization & file downloads
├── services/                     # HTTP API Client & Networking Layer
│   └── api.ts                    # Strongly typed fetch wrappers with error handling
└── types/                        # Single Source of Truth TypeScript interfaces
    ├── api.ts                    # Generic API response envelopes
    └── keyword.ts                # Domain models & payload interfaces
```

### Frontend Rules:
1. **`app/page.tsx` is an Orchestrator:** It should only import feature components and orchestrate state flow. Never put 100-line JSX trees or inline algorithms directly in `page.tsx`.
2. **Every API call belongs in `services/`:** No component should ever write raw `fetch('http://...')` directly. Always call `api.analyzeKeyword(...)`.
3. **No Duplicate Interfaces:** Never declare `interface Item { ... }` inside a component. Put it in `src/types/` and import it.

---

## 6. Enterprise Backend Architecture (FastAPI / Python Standard)

Inside `backend/app/`, code must adhere to clean layered architecture:

```
backend/
├── app/
│   ├── api/                      # Presentation Layer (HTTP Route Controllers)
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py         # Aggregated v1 APIRouter
│   │       └── endpoints.py      # Route endpoints with Pydantic validation
│   ├── core/                     # Cross-Cutting Infrastructure
│   │   ├── __init__.py
│   │   ├── config.py             # Pydantic BaseSettings, CORS, environment loader
│   │   ├── security.py           # Authentication, tokens, rate-limiters (if applicable)
│   │   └── logging.py            # Structured JSON logger configuration
│   ├── schemas/                  # Domain Contracts (Pydantic V2 Models)
│   │   ├── __init__.py
│   │   └── keyword.py            # Request models, response models, enums
│   ├── services/                 # Domain / Business Logic Layer (Pure Python)
│   │   ├── __init__.py
│   │   ├── cache_service.py      # SQLite / Redis persistence interface
│   │   ├── serp_engine.py        # Live search retrieval logic
│   │   └── scoring_engine.py     # Deterministic scoring algorithms
│   ├── __init__.py
│   └── main.py                   # App initialization, CORS middleware, lifecycle hooks
├── data/                         # Local database & cache storage
│   ├── .gitkeep
│   └── app.db                    # Auto-generated database (gitignored)
├── tests/                        # Automated Pytest Suite
│   ├── __init__.py
│   ├── conftest.py               # Shared test fixtures & TestClient instances
│   ├── test_engines.py           # Unit tests for domain services
│   └── test_health.py            # Integration tests for HTTP endpoints
├── pytest.ini                    # Pytest environment & pythonpath configuration
├── requirements.txt              # Locked Python production dependencies
└── README.md                     # Backend service documentation
```

### Backend Rules:
1. **Zero Database Calls in Routes:** Route endpoints in `api/v1/endpoints.py` must only validate inputs using Pydantic, call a service in `services/`, and return typed models.
2. **Pure Services:** Files in `services/` must be pure Python functions or classes. They should not depend on FastAPI `Request` objects, making them 100% testable via standard unit tests.
3. **Dedicated `data/` Directory:** Never dump `.db`, `.sqlite`, or cache files in the project root. Put them in `backend/data/` and add them to `.gitignore`.

---

## 7. Configuration, Secrets & Environment Governance

1. **The Golden `.env` Rule:**
   * Never, under any circumstance, commit `.env` or files containing secret API keys, tokens, or passwords to Git.
   * Every repository must include an up-to-date `.env.example` documenting all configuration keys with dummy values.
2. **Standard `.env.example` Format:**
   ```env
   # Application Environment
   ENVIRONMENT=development
   PORT=8000
   
   # Frontend Client Configuration
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   
   # Optional Third-Party Services
   SERPER_API_KEY=
   DATABASE_URL=sqlite:///./data/app.db
   ```
3. **`.gitignore` Best Practice:**
   Always include:
   * Node: `node_modules/`, `.next/`, `dist/`, `build/`
   * Python: `__pycache__/`, `*.pyc`, `venv/`, `.venv/`, `.pytest_cache/`
   * Data: `*.sqlite`, `*.sqlite3`, `*.db`, `backend/data/*.db`
   * Secrets: `.env`, `.env.local`, `.env.*.local`

---

## 8. Git Workflow & Semantic Versioning

### Branching Strategy (Trunk-Based / Gitflow):
* `main`: Production-ready, stable, deployable code. Never commit directly to `main`.
* `feat/<feature-name>`: Feature development (e.g., `feat/monochrome-landing-ui`).
* `fix/<bug-name>`: Bug fixes (e.g., `fix/anti-jitter-scanner`).
* `refactor/<scope>`: Structural refactoring (e.g., `refactor/mnc-folder-structure`).

### Conventional Commit Standards:
Every commit message must follow the Conventional Commits format:
```text
<type>(<scope>): <short imperative description>

Examples:
feat(search): add country and local geo selector dropdowns
fix(radar): eliminate card height jumping during scan state
refactor(frontend): decouple monolithic page.tsx into feature components
docs(architecture): add enterprise project structure SOP
```

Allowed types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`.

---

## 9. Day-1 Project Setup Checklist

Whenever starting a new project, execute this 10-step checklist:

- [ ] **Step 1: Initialize Git & Branching** — Create repository, set default branch to `main`, and create initial `develop` or feature branch.
- [ ] **Step 2: Setup `.gitignore`** — Add Node, Python, SQLite, OS, and `.env` ignore rules before writing any code.
- [ ] **Step 3: Establish Folder Blueprint** — Create `frontend/src/components/features`, `frontend/src/services`, `frontend/src/types`, `backend/app/api`, `backend/app/services`, and `backend/data`.
- [ ] **Step 4: Define Domain Types Early** — Write Pydantic schemas in backend and TypeScript interfaces in frontend to establish the API contract before building UI.
- [ ] **Step 5: Setup Configuration Loaders** — Implement `BaseSettings` (FastAPI) and `.env.example` template.
- [ ] **Step 6: Configure Unit Testing** — Setup `pytest.ini` with `pythonpath = .` in backend, and test runner in frontend.
- [ ] **Step 7: Build Reusable UI Atoms** — Create shared layout elements (`Header`, `Footer`) and theme styling (`globals.css`).
- [ ] **Step 8: Implement Service Layer** — Write backend business logic in decoupled service modules with automated tests.
- [ ] **Step 9: Connect Frontend Client** — Build typed fetch wrappers in `src/services/api.ts` and integrate feature components into `page.tsx`.
- [ ] **Step 10: Complete Documentation** — Add `README.md`, `docs/ARCHITECTURE.md`, and verify zero lint/type errors.

---

## 10. Summary Matrix for Developers

```
┌─────────────────────────────────────────────────────────────┐
│                   MNC ARCHITECTURE MATRIX                   │
├───────────────────┬─────────────────────────────────────────┤
│ Where do types go?│ frontend/src/types/ & backend/schemas/ │
│ Where does API go?│ frontend/src/services/api.ts            │
│ Where does UI go? │ frontend/src/components/features/<feat> │
│ Where does DB go? │ backend/data/ (gitignored)              │
│ Where do tests go?│ backend/tests/ & frontend/__tests__/    │
│ Max file length?  │ Under 250-300 lines (SRP)               │
│ Commits directly? │ NEVER to main. Feature branches only.   │
└───────────────────┴─────────────────────────────────────────┘
```

*Adherence to this SOP is mandatory for all projects to guarantee maintainability, high team velocity, and enterprise-grade software standards.*
