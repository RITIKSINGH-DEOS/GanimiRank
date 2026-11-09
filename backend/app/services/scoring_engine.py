from typing import List, Tuple
from app.schemas.keyword import SERPResultItem

def calculate_opportunity(
    allintitle_count: int,
    serp_results: List[SERPResultItem],
    expansion_count: int
) -> Tuple[int, str, str]:
    """
    Computes deterministic Opportunity Score (0-100), Verdict, and Demand Level.
    
    Formula:
    Base Score (50)
    + Demand Factor (based on autocomplete variations & query depth)
    + SERP Weak Spots Bonus (+10 per weak spot in Top 10, max +40)
    + Forum in Top 3 Bonus (+15)
    - Allintitle Penalty (scaled log penalty)
    """
    base_score = 45
    
    # 1. Demand factor
    if expansion_count >= 30:
        demand_score = 25
        demand_level = "HIGH"
    elif expansion_count >= 10:
        demand_score = 15
        demand_level = "MEDIUM"
    else:
        demand_score = 5
        demand_level = "MICRO"
        
    # 2. SERP Weak Spots Audit
    weak_count = sum(1 for item in serp_results if item.is_weak_spot)
    weak_bonus = min(weak_count * 8, 35)
    
    # Top 3 weak spot super bonus (Guerrilla opening)
    top_3_weak = any(item.is_weak_spot and item.position <= 3 for item in serp_results)
    if top_3_weak:
        weak_bonus += 12
        
    # 3. Allintitle Penalty (KGR Logic)
    if allintitle_count <= 10:
        allintitle_penalty = -5 # Low competition reward
    elif allintitle_count <= 30:
        allintitle_penalty = 5
    elif allintitle_count <= 80:
        allintitle_penalty = 20
    elif allintitle_count <= 200:
        allintitle_penalty = 35
    else:
        allintitle_penalty = 50
        
    # Final Score clamped between 5 and 99
    score = base_score + demand_score + weak_bonus - allintitle_penalty
    final_score = max(min(score, 99), 8)
    
    # Verdict Assignment
    if final_score >= 70:
        verdict = "GOLDMINE"
    elif final_score >= 45:
        verdict = "MODERATE"
    else:
        verdict = "SKIP"
        
    return final_score, verdict, demand_level
