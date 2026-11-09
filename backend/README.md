# GanimiRank Backend Service

High-performance Autonomous Search Intelligence & AEO/GEO Ranking Engine powered by **FastAPI**, **Pydantic V2**, and an **SQLite 48h Cache Engine**.

---

## 🏛️ Directory Architecture

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── endpoints.py          # FastAPI REST Route controllers & response mappers
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py                 # Pydantic BaseSettings, CORS, environment configs
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── keyword.py                # Strongly-typed Pydantic V2 Request & Response models
│   ├── services/                     # Pure business logic engines (zero HTTP dependency)
│   │   ├── __init__.py
│   │   ├── aeo_geo_engine.py         # AI Overviews, Perplexity & ChatGPT citation heuristics
│   │   ├── cache_service.py          # 48-hour local SQLite query caching service
│   │   ├── competitor_engine.py      # Autocomplete demand extraction & title synthesis
│   │   ├── expansion_engine.py       # Alphabet Soup & Search intent modifier matrices
│   │   ├── scoring_engine.py         # KGR ratio, SERP weak spot & guerrilla scoring
│   │   ├── serp_engine.py            # DuckDuckGo HTML SERP parsing & Serper.dev fallback
│   │   └── title_engine.py           # 7 High-CTR Headline formulas & PAA outlines
│   ├── __init__.py
│   └── main.py                       # FastAPI application factory & middleware setup
├── data/                             # Persistent cache & database storage
│   ├── .gitkeep
│   └── ganimirank.db                 # SQLite cache (auto-generated, gitignored)
├── tests/                            # Automated test suite (Pytest)
│   ├── __init__.py
│   ├── test_engines.py               # Unit tests for scoring, expansion, & competitor logic
│   └── test_health.py                # Health & REST endpoint integration tests
├── pytest.ini                        # Pytest configuration & module path settings
├── requirements.txt                  # Locked Python dependencies
└── README.md                         # Backend service documentation
```

---

## 🚀 Quick Start

### 1. Environment Setup
```bash
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Run Development Server
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. Run Test Suite
```bash
pytest
```
