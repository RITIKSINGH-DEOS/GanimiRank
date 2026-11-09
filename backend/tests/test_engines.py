from fastapi.testclient import TestClient
from app.main import app
from app.services.scoring_engine import calculate_opportunity
from app.services.aeo_geo_engine import analyze_aeo_geo_readiness
from app.services.title_engine import generate_high_ctr_titles, generate_paa_questions
from app.schemas.keyword import SERPResultItem

client = TestClient(app)

def test_opportunity_scoring_goldmine():
    # Mock SERP with 4 weak spots, low allintitle, high expansion
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
    score, verdict, demand = calculate_opportunity(
        allintitle_count=8,
        serp_results=mock_serp,
        expansion_count=35
    )
    assert score >= 70
    assert verdict == "GOLDMINE"
    assert demand == "HIGH"

def test_opportunity_scoring_skip():
    # Mock high allintitle, zero weak spots
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
    score, verdict, demand = calculate_opportunity(
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

def test_api_analyze_endpoint():
    payload = {
        "keyword": "tunday kababi lucknow",
        "country": "in",
        "language": "en",
        "local_geo": "lucknow",
        "intent_filter": "all"
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "opportunity_score" in data
    assert "verdict" in data
    assert "aeo_geo" in data
    assert "high_ctr_titles" in data
    assert len(data["high_ctr_titles"]) > 0

def test_api_suggest_endpoint():
    response = client.get("/api/v1/suggest?q=seo+tips&country=in&lang=en")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
