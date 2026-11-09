import { KeywordAnalyzeRequest, KeywordAnalyzeResponse } from "@/types/keyword";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Analyzes keyword viability, SERP weak spots, AEO citation blueprints,
 * and competitor topic expansion via SAGRank Backend Service.
 */
export async function analyzeKeyword(request: KeywordAnalyzeRequest): Promise<KeywordAnalyzeResponse> {
  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keyword: request.keyword.trim(),
      country: request.country || "in",
      language: request.language || "en",
      local_geo: request.local_geo?.trim() || undefined,
      intent_filter: request.intent_filter || "all",
      force_refresh: request.force_refresh ?? true,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => null);
    throw new Error(
      errorBody ? `Analysis failed: ${errorBody}` : `Server returned error (${res.status})`
    );
  }

  return res.json();
}
