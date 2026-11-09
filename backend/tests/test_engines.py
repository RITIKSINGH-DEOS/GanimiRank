from fastapi.testclient import TestClient
from app.main import app
from app.services.scoring_engine import calculate_opportunity
from app.services.aeo_geo_engine import analyze_aeo_geo_readiness
from app.services.title_engine import generate_high_ctr_titles, generate_paa_questions
from app.services.cache_service import get_cached_analysis, save_cached_analysis
from app.schemas.keyword import SERPResultItem

client = TestClient(app)

def test_opportunity_scoring_goldmine():
    mock_serp = [
        SERPResultItem(
            position=1,
            title="Reddit Discussion",
            url="https://reddit.com/r/food",
            domain="reddit.com",
            snippet="Best food",
            is_weak_spot=True,
            weak_spot_type="Reddit Community Discussion",
            title_has_exact_keyword=False
        ),
        SERPResultItem(
            position=2,
            title="Generic article",
            url="https://example.com/item",
            domain="example.com",
            snippet="Generic description",
            is_weak_spot=True,
            weak_spot_type="Un-optimized Title",
            title_has_exact_keyword=False
        )
    ]
    score, verdict, demand, vol_str, vol_num, kgr = calculate_opportunity(
        allintitle_count=8,
        serp_results=mock_serp,
        expansion_count=35
    )
    assert score >= 70
    assert verdict == "GOLDMINE"
    assert demand == "HIGH"
    assert "mo" in vol_str
    assert kgr < 0.25

def test_opportunity_scoring_skip():
    mock_serp = [
        SERPResultItem(
            position=i,
            title=f"Optimized Title {i}",
            url=f"https://authority{i}.com",
            domain=f"authority{i}.com",
            snippet="High DA snippet",
            is_weak_spot=False,
            weak_spot_type=None,
            title_has_exact_keyword=True
        ) for i in range(1, 11)
    ]
    score, verdict, demand, vol_str, vol_num, kgr = calculate_opportunity(
        allintitle_count=350,
        serp_results=mock_serp,
        expansion_count=5
    )
    assert score < 45
    assert verdict == "SKIP"
    assert demand == "MICRO"

def test_aeo_geo_engine_triggers():
    mock_serp = [
        SERPResultItem(
            position=1,
            title="Quora Answer",
            url="https://quora.com/question",
            domain="quora.com",
            snippet="User answer",
            is_weak_spot=True,
            weak_spot_type="Quora Q&A Thread",
            title_has_exact_keyword=False
        )
    ]
    analysis = analyze_aeo_geo_readiness("how to find best street food in lucknow", mock_serp)
    assert analysis.has_ai_overview is True
    assert analysis.has_featured_snippet is True
    assert analysis.ai_citation_weakness is True
    assert analysis.aeo_potential_score >= 80

def test_title_and_paa_generator():
    titles = generate_high_ctr_titles("tunday kababi", local_geo="lucknow")
    assert len(titles) >= 5
    assert any("Lucknow" in t for t in titles)

    paa = generate_paa_questions("tunday kababi", local_geo="lucknow")
    assert len(paa) >= 5
    assert any("price" in q.lower() or "cost" in q.lower() for q in paa)

def test_sqlite_caching_layer():
    dummy_data = {
        "keyword": "test-cache-query",
        "country": "in",
        "local_geo": "lucknow",
        "opportunity_score": 92,
        "verdict": "GOLDMINE",
        "demand_level": "HIGH",
        "estimated_monthly_volume": "~2,500 / mo",
        "volume_numeric": 2500,
        "kgr_ratio": 0.002,
        "allintitle_count": 5,
        "weak_spots_found": 3,
        "total_serp_scanned": 10,
        "serp_results": [],
        "aeo_geo": {
            "has_ai_overview": True,
            "has_featured_snippet": True,
            "aeo_potential_score": 85,
            "ai_citation_weakness": True,
            "citation_source_type": "Reddit",
            "recommended_format": "Table",
            "actionable_tip": "Include table"
        },
        "related_keywords": ["test kw"],
        "high_ctr_titles": ["Test Title"],
        "people_also_ask": ["Test question?"]
    }
    save_cached_analysis("test-cache-query", "in", "lucknow", dummy_data)
    cached = get_cached_analysis("test-cache-query", "in", "lucknow")
    assert cached is not None
    assert cached["opportunity_score"] == 92
    assert cached["verdict"] == "GOLDMINE"

def test_api_analyze_and_cache():
    payload = {
        "keyword": "tunday kababi lucknow",
        "country": "in",
        "language": "en",
        "local_geo": "lucknow",
        "intent_filter": "all",
        "force_refresh": False
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "estimated_monthly_volume" in data
    assert data["verdict"] in ["GOLDMINE", "MODERATE", "SKIP"]

def test_api_suggest_endpoint():
    response = client.get("/api/v1/suggest?q=seo+tips&country=in&lang=en")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
