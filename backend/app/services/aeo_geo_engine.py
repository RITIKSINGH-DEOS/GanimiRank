import re
from typing import List
from app.schemas.keyword import AeoGeoAnalysis, SERPResultItem

AEO_INTENT_PATTERNS = [
    r"\bhow\s+to\b",
    r"\bwhat\s+is\b",
    r"\bwhy\b",
    r"\bbest\b",
    r"\bvs\b",
    r"\bdifference\s+between\b",
    r"\breview\b",
    r"\bguide\b",
    r"\brecipe\b",
    r"\bprice\b",
    r"\btips\b",
    r"\bwhich\b"
]

def analyze_aeo_geo_readiness(keyword: str, serp_results: List[SERPResultItem]) -> AeoGeoAnalysis:
    """Evaluates readiness for Google AI Overviews, Perplexity, and ChatGPT Search."""
    clean_kw = keyword.lower()
    
    # 1. Intent triggers for Generative/Answer Engines
    matched_patterns = [p for p in AEO_INTENT_PATTERNS if re.search(p, clean_kw)]
    intent_score = min(len(matched_patterns) * 25 + 30, 85)
    
    # 2. Check for weak spots in Top 5 (AI Citation Gap)
    top_5 = serp_results[:5]
    weak_sources_in_top5 = [item for item in top_5 if item.is_weak_spot and item.weak_spot_type]
    
    has_citation_gap = len(weak_sources_in_top5) > 0
    citation_source_name = weak_sources_in_top5[0].weak_spot_type if has_citation_gap else None
    
    # AI Overview & Featured snippet estimation
    has_featured_snippet = bool(matched_patterns)
    has_ai_overview = bool(matched_patterns and (len(clean_kw.split()) >= 3 or "best" in clean_kw or "vs" in clean_kw))
    
    # Base AEO potential score
    aeo_score = intent_score
    if has_citation_gap:
        aeo_score += 15 # Bonus: AI is forced to cite weak forums/generic pages
    aeo_score = max(min(aeo_score, 98), 25)
    
    # Formatting recommendations
    if "vs" in clean_kw or "difference" in clean_kw:
        fmt = "4-Column Comparison Table + Winner Verdict"
        tip = "Place a clean side-by-side comparison table directly after your introduction. LLMs extract tabular data with highest priority."
    elif "how" in clean_kw or "recipe" in clean_kw or "guide" in clean_kw:
        fmt = "Numbered Step-by-Step List with Bold Step Names"
        tip = "Format headings with 'Step 1: Action'. Keep paragraphs under 50 words per step to trigger ordered list snippets."
    elif "best" in clean_kw or "top" in clean_kw:
        fmt = "Bulleted List with Quick Summary Box (40 words)"
        tip = "Provide an immediate 'Quick Verdict: Top 3 Picks' bulleted summary before your deep dive. AI Overviews synthesize these directly."
    else:
        fmt = "Inverted Pyramid (45-Word Direct Answer under H2)"
        tip = "Answer the query explicitly in the first 45 words under your primary H2 tag, followed by FAQ schema markup."
        
    return AeoGeoAnalysis(
        has_ai_overview=has_ai_overview,
        has_featured_snippet=has_featured_snippet,
        aeo_potential_score=aeo_score,
        ai_citation_weakness=has_citation_gap,
        citation_source_type=citation_source_name,
        recommended_format=fmt,
        actionable_tip=tip
    )
