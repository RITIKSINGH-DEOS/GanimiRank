export interface SERPResultItem {
  position: number;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  is_weak_spot: boolean;
  weak_spot_type?: string;
  title_has_exact_keyword: boolean;
}

export interface CompetitorTopicItem {
  position: number;
  title: string;
  keyword: string;
  search_volume: string;
  volume_numeric: number;
  competition_level: "Low" | "Medium" | "High";
  competition_score: number;
  kgr_status: string;
  intent: string;
}

export interface AeoGeoAnalysis {
  has_ai_overview: boolean;
  has_featured_snippet: boolean;
  aeo_potential_score: number;
  ai_citation_weakness: boolean;
  citation_source_type?: string;
  recommended_format: string;
  actionable_tip: string;
}

export interface KeywordAnalyzeResponse {
  keyword: string;
  country: string;
  local_geo?: string;
  opportunity_score: number;
  verdict: "GOLDMINE" | "MODERATE" | "SKIP";
  demand_level: "HIGH" | "MEDIUM" | "MICRO";
  estimated_monthly_volume?: string;
  volume_numeric?: number;
  kgr_ratio?: number;
  allintitle_count: number;
  weak_spots_found: number;
  total_serp_scanned: number;
  serp_results: SERPResultItem[];
  competitor_topics?: CompetitorTopicItem[];
  aeo_geo: AeoGeoAnalysis;
  related_keywords: string[];
  high_ctr_titles: string[];
  people_also_ask: string[];
}

export interface KeywordAnalyzeRequest {
  keyword: string;
  country?: string;
  language?: string;
  local_geo?: string;
  intent_filter?: string;
  force_refresh?: boolean;
}
