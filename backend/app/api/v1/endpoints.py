from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.keyword import (
    HealthResponse,
    KeywordAnalyzeRequest,
    KeywordAnalyzeResponse
)
from app.services.expansion_engine import expand_keywords, fetch_google_suggestions
from app.services.serp_engine import extract_allintitle_count, scrape_top_serp
from app.services.aeo_geo_engine import analyze_aeo_geo_readiness
from app.services.scoring_engine import calculate_opportunity
from app.services.title_engine import generate_high_ctr_titles, generate_paa_questions
from app.services.cache_service import get_cached_analysis, save_cached_analysis

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def get_health():
    return HealthResponse()

@router.get("/suggest", response_model=List[str])
def get_quick_suggestions(
    q: str = Query(..., min_length=2, description="Seed query"),
    country: str = Query("in", description="Country code"),
    lang: str = Query("en", description="Language code")
):
    """Fast endpoint for live query auto-suggestions."""
    return fetch_google_suggestions(q, country=country, language=lang)

@router.post("/analyze", response_model=KeywordAnalyzeResponse)
def analyze_keyword(payload: KeywordAnalyzeRequest):
    """
    Comprehensive Guerrilla Keyword & SERP Analysis with SQLite Local Caching:
    - Cached Hit Check
    - Autocomplete Expansion
    - Real-Time Allintitle extraction (KGR)
    - Top 10 SERP Audit & Weak Spot Identification
    - AEO & GEO Readiness Score
    - Deterministic Opportunity Score (0-100), Search Volume & Verdict
    - High-CTR Title & PAA Headings Generation
    """
    try:
        # Check SQLite Cache first unless force_refresh is requested
        if not payload.force_refresh:
            cached = get_cached_analysis(payload.keyword, payload.country, payload.local_geo)
            if cached:
                return KeywordAnalyzeResponse(**cached)

        # 1. Expand keyword universe
        expanded = expand_keywords(
            seed=payload.keyword,
            country=payload.country,
            language=payload.language,
            local_geo=payload.local_geo,
            deep_scan=False
        )
        
        # 2. Extract Allintitle count
        allintitle_count = extract_allintitle_count(
            keyword=payload.keyword,
            country=payload.country
        )
        
        # 3. Scrape and audit Top 10 SERP
        serp_results = scrape_top_serp(
            keyword=payload.keyword,
            country=payload.country
        )
        
        # 4. AEO & GEO Readiness analysis
        aeo_geo = analyze_aeo_geo_readiness(
            keyword=payload.keyword,
            serp_results=serp_results
        )
        
        # 5. Opportunity Scoring, Search Volume & Verdict
        opp_score, verdict, demand_level, volume_str, volume_num, kgr_val = calculate_opportunity(
            allintitle_count=allintitle_count,
            serp_results=serp_results,
            expansion_count=len(expanded)
        )
        
        # 6. Title and PAA generation
        titles = generate_high_ctr_titles(payload.keyword, payload.local_geo)
        paa = generate_paa_questions(payload.keyword, payload.local_geo)
        
        response_data = KeywordAnalyzeResponse(
            keyword=payload.keyword,
            country=payload.country,
            local_geo=payload.local_geo,
            opportunity_score=opp_score,
            verdict=verdict,
            demand_level=demand_level,
            estimated_monthly_volume=volume_str,
            volume_numeric=volume_num,
            kgr_ratio=kgr_val,
            allintitle_count=allintitle_count,
            weak_spots_found=sum(1 for s in serp_results if s.is_weak_spot),
            total_serp_scanned=len(serp_results),
            serp_results=serp_results,
            aeo_geo=aeo_geo,
            related_keywords=expanded[:25],
            high_ctr_titles=titles,
            people_also_ask=paa
        )

        # Save to SQLite local cache
        save_cached_analysis(
            payload.keyword,
            payload.country,
            payload.local_geo,
            response_data.model_dump()
        )
        
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis pipeline error: {str(e)}")
