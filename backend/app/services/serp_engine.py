import requests
from bs4 import BeautifulSoup
import re
import random
from typing import List, Dict, Any, Tuple
from urllib.parse import urlparse, quote_plus
from app.schemas.keyword import SERPResultItem

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
]

WEAK_DOMAINS = {
    "reddit.com": "Reddit Community Discussion",
    "quora.com": "Quora Q&A Thread",
    "medium.com": "Medium User Post",
    "pinterest.com": "Pinterest Pin",
    "tripadvisor.com": "TripAdvisor Directory",
    "justdial.com": "Justdial Listing",
    "zomato.com": "Zomato Restaurant Directory",
    "swiggy.com": "Swiggy Order Page",
    "yelp.com": "Yelp Directory",
    "linkedin.com/pulse": "LinkedIn Pulse Article"
}

def get_random_headers() -> Dict[str, str]:
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
        "DNT": "1",
        "Upgrade-Insecure-Requests": "1"
    }

def extract_allintitle_count(keyword: str, country: str = "in") -> int:
    """Safely extracts allintitle count for KGR calculation."""
    encoded_kw = quote_plus(f'allintitle:"{keyword}"')
    url = f"https://www.google.com/search?q={encoded_kw}&gl={country}&hl=en"
    
    try:
        response = requests.get(url, headers=get_random_headers(), timeout=5)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            result_stats = soup.find("div", id="result-stats")
            if result_stats:
                text = result_stats.get_text()
                # Parse numbers e.g. "About 32 results (0.42 seconds)"
                match = re.search(r'(?:About\s+)?([\d,]+)\s+results?', text, re.IGNORECASE)
                if match:
                    count_str = match.group(1).replace(",", "")
                    return int(count_str)
            
            # Alternative: count individual search results if result-stats is omitted
            items = soup.find_all("div", class_="g")
            if items:
                return len(items)
    except Exception:
        pass
    
    # Safe conservative default for edge cases
    return 15

def scrape_top_serp(keyword: str, country: str = "in") -> List[SERPResultItem]:
    """Scrapes and audits Top 10 organic results for weak spots."""
    encoded_kw = quote_plus(keyword)
    url = f"https://www.google.com/search?q={encoded_kw}&num=12&gl={country}&hl=en"
    results: List[SERPResultItem] = []
    
    try:
        response = requests.get(url, headers=get_random_headers(), timeout=6)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            search_containers = soup.find_all("div", class_="g")
            
            pos = 1
            for container in search_containers:
                title_elem = container.find("h3")
                link_elem = container.find("a")
                snippet_elem = container.find("div", class_=re.compile(r"VwiC3b|IsZvec|s3v9rd"))
                
                if not title_elem or not link_elem:
                    continue
                
                title = title_elem.get_text().strip()
                href = link_elem.get("href", "")
                snippet = snippet_elem.get_text().strip() if snippet_elem else ""
                
                if not href.startswith("http") or "google.com" in href:
                    continue
                
                domain = urlparse(href).netloc.replace("www.", "")
                
                # Check for weak spots
                is_weak = False
                weak_type = None
                
                for weak_key, weak_label in WEAK_DOMAINS.items():
                    if weak_key in href.lower() or weak_key in domain.lower():
                        is_weak = True
                        weak_type = weak_label
                        break
                
                if not is_weak and any(term in domain.lower() for term in ["forum", "community", "board"]):
                    is_weak = True
                    weak_type = "Discussion Forum"
                
                # Check title exact match
                keyword_words = set(re.findall(r'\w+', keyword.lower()))
                title_words = set(re.findall(r'\w+', title.lower()))
                title_exact = keyword.lower() in title.lower() or len(keyword_words.intersection(title_words)) >= len(keyword_words)
                
                if not is_weak and not title_exact:
                    is_weak = True
                    weak_type = "Un-optimized Title (Generic Target)"
                
                results.append(SERPResultItem(
                    position=pos,
                    title=title,
                    url=href,
                    domain=domain,
                    snippet=snippet,
                    is_weak_spot=is_weak,
                    weak_spot_type=weak_type,
                    title_has_exact_keyword=title_exact
                ))
                pos += 1
                if pos > 10:
                    break
    except Exception:
        pass
        
    return results
