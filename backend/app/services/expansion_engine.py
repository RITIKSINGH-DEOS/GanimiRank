import requests
import json
from typing import List, Set, Optional

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
]

def fetch_google_suggestions(query: str, country: str = "in", language: str = "en") -> List[str]:
    """Fetch real-time suggestions from Google Autocomplete endpoint."""
    url = f"https://suggestqueries.google.com/complete/search?client=firefox&q={query}&gl={country}&hl={language}"
    headers = {"User-Agent": USER_AGENTS[0]}
    try:
        response = requests.get(url, headers=headers, timeout=4)
        if response.status_code == 200:
            data = json.loads(response.text)
            if len(data) > 1 and isinstance(data[1], list):
                return [item for item in data[1] if isinstance(item, str)]
    except Exception:
        pass
    return []

def expand_keywords(
    seed: str,
    country: str = "in",
    language: str = "en",
    local_geo: Optional[str] = None,
    deep_scan: bool = False
) -> List[str]:
    """Comprehensive keyword expansion using Alphabet Soup & Intent Modifiers."""
    expanded: Set[str] = set()
    seed_clean = seed.strip().lower()

    # 1. Direct seed suggestions
    for kw in fetch_google_suggestions(seed_clean, country, language):
        expanded.add(kw)

    # 2. Local geo injection if applicable
    if local_geo and local_geo.strip():
        geo = local_geo.strip().lower()
        geo_queries = [
            f"{seed_clean} {geo}",
            f"best {seed_clean} in {geo}",
            f"{seed_clean} near {geo}"
        ]
        for gq in geo_queries:
            for kw in fetch_google_suggestions(gq, country, language):
                expanded.add(kw)

    # 3. Intent & Question Modifiers
    modifiers = [
        "best", "how to", "what is", "why", "top", "free",
        "vs", "guide", "review", "tips for", "alternatives to", "cost of"
    ]
    for mod in modifiers:
        for kw in fetch_google_suggestions(f"{mod} {seed_clean}", country, language):
            expanded.add(kw)
        for kw in fetch_google_suggestions(f"{seed_clean} {mod}", country, language):
            expanded.add(kw)

    # 4. Alphabet Soup (A to Z)
    alphabet = "abcdefghijklmnopqrstuvwxyz" if deep_scan else "abcdefghijklm"
    for char in alphabet:
        for kw in fetch_google_suggestions(f"{seed_clean} {char}", country, language):
            expanded.add(kw)

    # Clean & sort
    results = sorted(list(expanded))
    return results[:80] # Return top 80 high-relevance variations
