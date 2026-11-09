from typing import List, Optional

def generate_high_ctr_titles(keyword: str, local_geo: Optional[str] = None) -> List[str]:
    """Generates high click-through-rate blog titles adapted to the niche."""
    kw_title = keyword.strip().title()
    geo = f" in {local_geo.strip().title()}" if local_geo and local_geo.strip() else ""
    current_year = "2026"
    
    titles = [
        f"7 Best {kw_title}{geo} That Are Actually Worth It ({current_year})",
        f"The Ultimate Guide to {kw_title}{geo}: Everything You Must Know",
        f"{kw_title}{geo}: Real Review, Prices & Hidden Secrets",
        f"How to Master {kw_title} (Step-by-Step Practical Blueprint)",
        f"Top 5 Mistakes to Avoid When Choosing {kw_title}{geo}",
        f"Is {kw_title} Truly Worth the Hype? Honest Breakdown",
        f"The Complete Beginner's Checklist for {kw_title} ({current_year} Edition)"
    ]
    return titles

def generate_paa_questions(keyword: str, local_geo: Optional[str] = None) -> List[str]:
    """Extracts high-intent People Also Ask (PAA) questions for H2/H3 subheadings."""
    kw = keyword.strip()
    geo = f" in {local_geo.strip().title()}" if local_geo and local_geo.strip() else ""
    
    return [
        f"What is the average price/cost of {kw}{geo}?",
        f"Which is the most authentic or recommended {kw}?",
        f"Is {kw} suitable for beginners?",
        f"What are the pros and cons of {kw}?",
        f"How do I choose the best {kw}{geo}?",
        f"What mistakes should I avoid with {kw}?"
    ]
