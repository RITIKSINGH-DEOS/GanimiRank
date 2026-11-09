from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "1.0.0"
    service: str = "SAGRank Backend Core"

class KeywordAnalyzeRequest(BaseModel):
    keyword: str = Field(..., min_length=2, description="Target keyword or seed topic")
    country: str = Field(default="in", description="Country code e.g. in, us, uk, worldwide")
    language: str = Field(default="en", description="Language code e.g. en, hi")
    local_geo: Optional[str] = Field(default=None, description="Optional local city target e.g. Lucknow")
    intent_filter: Optional[str] = Field(default="all", description="all, informational, commercial, question")
    force_refresh: Optional[bool] = Field(default=False, description="Bypass local cache and re-scan live")

class SERPResultItem(BaseModel):
    position: int
    title: str
    url: str
    domain: str
    snippet: str
    is_weak_spot: bool
    weak_spot_type: Optional[str] = None # reddit, quora, forum, unoptimized_title, directory
    title_has_exact_keyword: bool

class CompetitorTopicItem(BaseModel):
    position: int
    title: str
    keyword: str
    search_volume: str # e.g. "~14,500 / mo"
    volume_numeric: int # 14500
    competition_level: str # Low, Medium, High
    competition_score: int # 0 to 100
    kgr_status: str # e.g. "KGR < 0.25 (Easy Rank)", "Moderate Supply", "High Authority Battle"
    intent: str # Informational, Commercial, Local Guide

class AeoGeoAnalysis(BaseModel):
    has_ai_overview: bool
    has_featured_snippet: bool
    aeo_potential_score: int # 0 to 100
    ai_citation_weakness: bool
    citation_source_type: Optional[str] = None
    recommended_format: str # table, bullet_list, 40_word_summary
    actionable_tip: str

class KeywordAnalyzeResponse(BaseModel):
    keyword: str
    country: str
    local_geo: Optional[str]
    opportunity_score: int # 0 to 100
    verdict: str # GOLDMINE, MODERATE, SKIP
    demand_level: str # HIGH, MEDIUM, MICRO
    estimated_monthly_volume: str = "~350 / mo"
    volume_numeric: int = 350
    kgr_ratio: float = 0.01
    allintitle_count: int
    weak_spots_found: int
    total_serp_scanned: int
    serp_results: List[SERPResultItem] = []
    competitor_topics: List[CompetitorTopicItem] = []
    aeo_geo: AeoGeoAnalysis
    related_keywords: List[str] = []
    high_ctr_titles: List[str] = []
    people_also_ask: List[str] = []
