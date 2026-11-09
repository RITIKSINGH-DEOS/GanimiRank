"use client";

import React, { useState } from "react";
import {
  Search,
  Zap,
  Globe,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Download,
  Flame,
  Bot,
  Layers,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";

interface SERPResultItem {
  position: number;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  is_weak_spot: boolean;
  weak_spot_type?: string;
  title_has_exact_keyword: boolean;
}

interface AeoGeoAnalysis {
  has_ai_overview: boolean;
  has_featured_snippet: boolean;
  aeo_potential_score: number;
  ai_citation_weakness: boolean;
  citation_source_type?: string;
  recommended_format: string;
  actionable_tip: string;
}

interface KeywordAnalyzeResponse {
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
  aeo_geo: AeoGeoAnalysis;
  related_keywords: string[];
  high_ctr_titles: string[];
  people_also_ask: string[];
}

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("in");
  const [localGeo, setLocalGeo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<KeywordAnalyzeResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"serp" | "aeo" | "content">("serp");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAnalyze = async (searchKw?: string) => {
    const targetKw = searchKw || keyword;
    if (!targetKw.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: targetKw.trim(),
          country,
          language: "en",
          local_geo: localGeo.trim() || undefined,
          intent_filter: "all",
          force_refresh: true
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned error (${res.status})`);
      }

      const data: KeywordAnalyzeResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to engine.");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!result) return;
    const rows = [
      ["Metric", "Value"],
      ["Target Keyword", result.keyword],
      ["Opportunity Score", `${result.opportunity_score}/100`],
      ["Verdict", result.verdict],
      ["Search Demand", result.demand_level],
      ["Est. Monthly Volume", result.estimated_monthly_volume || "N/A"],
      ["Allintitle (KGR) Count", result.allintitle_count.toString()],
      ["SERP Weak Spots", result.weak_spots_found.toString()],
      ["AEO Potential", `${result.aeo_geo.aeo_potential_score}%`],
      [],
      ["Top Competitors"],
      ["Rank", "Domain", "Title", "Weak Spot?", "Type", "URL"],
      ...result.serp_results.map((s) => [
        s.position.toString(),
        s.domain,
        `"${s.title.replace(/"/g, '""')}"`,
        s.is_weak_spot ? "Yes" : "No",
        s.weak_spot_type || "None",
        s.url
      ]),
      [],
      ["Suggested Blog Titles"],
      ...result.high_ctr_titles.map((t) => [`"${t.replace(/"/g, '""')}"`]),
      [],
      ["People Also Ask (H2/H3 Questions)"],
      ...result.people_also_ask.map((q) => [`"${q.replace(/"/g, '""')}"`])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ganimirank_${result.keyword.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-black text-sm shadow-sm">
              G
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white">GanimiRank</span>
              <span className="text-[11px] text-zinc-500 font-mono">v1.2</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Engine Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        {/* Simple, Confident Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
            Keyword & SERP Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Check real search demand, competitor weak spots, and AI citation readiness.
          </p>
        </div>

        {/* Minimalist Command Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2">
            {/* Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Enter topic (e.g. 'best cafe in lucknow', 'python vs mojo')..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                className="w-full pl-10 pr-3 py-2.5 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-medium"
              />
            </div>

            {/* Selects */}
            <div className="flex items-center gap-2 w-full sm:w-auto px-1 sm:px-0">
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-zinc-300 focus:outline-none cursor-pointer"
                >
                  <option value="in">India (IN)</option>
                  <option value="us">United States (US)</option>
                  <option value="uk">United Kingdom (UK)</option>
                  <option value="worldwide">Global</option>
                </select>
              </div>

              <div className="relative flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="City (optional)"
                  value={localGeo}
                  onChange={(e) => setLocalGeo(e.target.value)}
                  className="w-full sm:w-28 px-3 py-2 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={() => handleAnalyze()}
                disabled={loading || !keyword.trim()}
                className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-40 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-zinc-950" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 mt-3 flex-wrap">
            <span>Examples:</span>
            {[
              { label: "Best Cafe in Lucknow", kw: "best cafe in lucknow", geo: "Lucknow" },
              { label: "Tunday Kababi", kw: "tunday kababi lucknow", geo: "Lucknow" },
              { label: "Python vs Mojo", kw: "python vs mojo programming", geo: "" },
              { label: "SIP vs Mutual Fund", kw: "sip vs mutual fund", geo: "" }
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => {
                  setKeyword(s.kw);
                  setLocalGeo(s.geo);
                  handleAnalyze(s.kw);
                }}
                className="text-zinc-400 hover:text-zinc-200 underline underline-offset-4 decoration-zinc-800 transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="max-w-3xl mx-auto p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Screen */}
        {result && (
          <div className="space-y-6 pt-2">
            {/* 4 Clean Metric Cards (With Clear Use-Cases) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1: Ranking Opportunity */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-400">Ranking Potential</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        result.verdict === "GOLDMINE"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : result.verdict === "MODERATE"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {result.verdict === "GOLDMINE" ? "Easy to Rank" : result.verdict === "MODERATE" ? "Moderate Effort" : "Hard Competition"}
                    </span>
                  </div>
                  <div className="mt-2 text-3xl font-bold tracking-tight text-white">
                    {result.opportunity_score}
                    <span className="text-xs text-zinc-500 font-normal ml-1">/100</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal pt-2 border-t border-zinc-800/50">
                  {result.opportunity_score >= 70
                    ? "Worth writing! Page 1 has weak competition."
                    : result.opportunity_score >= 45
                    ? "Feasible, but requires a detailed in-depth article."
                    : "High competition. Avoid on a brand new blog."}
                </p>
              </div>

              {/* Card 2: Search Demand */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-400">Search Demand</span>
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                      {result.country}
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-bold tracking-tight text-white">
                    {result.demand_level}
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal pt-2 border-t border-zinc-800/50">
                  Audience interest calculated from Google search suggestions.
                </p>
              </div>

              {/* Card 3: Direct Competitors & Search Volume */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-400">Direct Competitors</span>
                    <span
                      className={`text-[10px] font-semibold ${
                        result.allintitle_count <= 30 ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {result.allintitle_count <= 30 ? "Low Supply" : "Standard"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold tracking-tight text-white">
                        {result.allintitle_count}
                      </span>
                      <span className="text-xs text-zinc-500 font-normal ml-1.5">titles online</span>
                    </div>
                  </div>
                </div>

                {/* Search Volume Integration in Box 3 */}
                <div className="pt-2 border-t border-zinc-800/50 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400 inline" />
                    Search Volume:
                  </span>
                  <span className="font-semibold text-emerald-400 font-mono">
                    {result.estimated_monthly_volume || "~350 / mo"}
                  </span>
                </div>
              </div>

              {/* Card 4: SERP Weak Spots */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-400">Page 1 Weak Spots</span>
                    <span className="text-[10px] font-semibold text-emerald-400">
                      {result.weak_spots_found} Detected
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-bold tracking-tight text-white">
                    {result.weak_spots_found}
                    <span className="text-xs text-zinc-500 font-normal ml-1.5">
                      / {result.total_serp_scanned} scanned
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal pt-2 border-t border-zinc-800/50">
                  Forums or un-optimized articles you can easily outrank.
                </p>
              </div>
            </div>

            {/* Clean Tab Controls */}
            <div className="flex items-center justify-between border-b border-zinc-800/70 pt-2 pb-1">
              <div className="flex items-center gap-6 text-xs font-medium">
                <button
                  onClick={() => setActiveTab("serp")}
                  className={`pb-2 transition-colors relative cursor-pointer ${
                    activeTab === "serp"
                      ? "text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Competitors ({result.serp_results.length})
                </button>
                <button
                  onClick={() => setActiveTab("aeo")}
                  className={`pb-2 transition-colors relative cursor-pointer ${
                    activeTab === "aeo"
                      ? "text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  AI Overviews & GEO ({result.aeo_geo.aeo_potential_score}%)
                </button>
                <button
                  onClick={() => setActiveTab("content")}
                  className={`pb-2 transition-colors relative cursor-pointer ${
                    activeTab === "content"
                      ? "text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Titles & Subheadings ({result.high_ctr_titles.length})
                </button>
              </div>

              {/* Minimal CSV Button */}
              <button
                onClick={exportCSV}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 pb-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {/* TAB 1: Real Competitors List */}
            {activeTab === "serp" && (
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 divide-y divide-zinc-800/50">
                {result.serp_results.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-500">
                    No competitor items found.
                  </div>
                ) : (
                  result.serp_results.map((item) => (
                    <div
                      key={item.position}
                      className="p-3.5 sm:p-4 flex items-start justify-between gap-4 hover:bg-zinc-900/60 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="text-xs font-mono text-zinc-500 w-5 pt-0.5 shrink-0">
                          #{item.position}
                        </span>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs sm:text-sm font-medium text-zinc-200 hover:text-white hover:underline flex items-center gap-1 truncate"
                            >
                              {item.title}
                              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            </a>
                          </div>
                          <p className="text-[11px] text-zinc-500 font-mono truncate">{item.domain}</p>
                          {item.snippet && (
                            <p className="text-xs text-zinc-400 line-clamp-1 leading-normal pt-0.5">
                              {item.snippet}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        {item.is_weak_spot ? (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {item.weak_spot_type || "Weak Spot"}
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-500 px-2 py-0.5">
                            Authority
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: AI Overviews & GEO Blueprint */}
            {activeTab === "aeo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-3">
                  <span className="text-xs font-semibold text-zinc-300">
                    AI Citation Readiness
                  </span>
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                      <span className="text-zinc-400">Google AI Overview Expected</span>
                      <span className="font-semibold text-zinc-200">
                        {result.aeo_geo.has_ai_overview ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                      <span className="text-zinc-400">Featured Snippet Opportunity</span>
                      <span className="font-semibold text-zinc-200">
                        {result.aeo_geo.has_featured_snippet ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                      <span className="text-zinc-400">Citation Potential Score</span>
                      <span className="font-semibold text-emerald-400">
                        {result.aeo_geo.aeo_potential_score}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-3">
                  <span className="text-xs font-semibold text-zinc-300">
                    Writing Formula for AI Engines
                  </span>
                  <div className="space-y-2 pt-1">
                    <div className="text-xs">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">
                        Required Layout
                      </span>
                      <p className="text-xs font-semibold text-zinc-200 pt-0.5">
                        {result.aeo_geo.recommended_format}
                      </p>
                    </div>
                    <div className="text-xs pt-2">
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">
                        Optimization Tip
                      </span>
                      <p className="text-xs text-zinc-400 pt-0.5 leading-relaxed">
                        {result.aeo_geo.actionable_tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Titles & Subheadings */}
            {activeTab === "content" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Titles */}
                <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-zinc-300">
                      High-CTR Blog Titles
                    </span>
                    <span className="text-[10px] text-zinc-500">Click to copy</span>
                  </div>
                  <div className="space-y-2">
                    {result.high_ctr_titles.map((title) => (
                      <button
                        key={title}
                        onClick={() => handleCopy(title)}
                        className="w-full text-left p-2.5 rounded-lg bg-zinc-950/60 hover:bg-zinc-800/40 border border-zinc-800/60 text-xs text-zinc-300 hover:text-white transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <span className="truncate pr-2">{title}</span>
                        {copiedText === title ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subheadings */}
                <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-zinc-300">
                      Article Subheadings & FAQs (PAA)
                    </span>
                    <span className="text-[10px] text-zinc-500">Click to copy</span>
                  </div>
                  <div className="space-y-2">
                    {result.people_also_ask.map((paa) => (
                      <button
                        key={paa}
                        onClick={() => handleCopy(paa)}
                        className="w-full text-left p-2.5 rounded-lg bg-zinc-950/60 hover:bg-zinc-800/40 border border-zinc-800/60 text-xs text-zinc-300 hover:text-white transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <span className="truncate pr-2">{paa}</span>
                        {copiedText === paa ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Autocomplete Cloud */}
                <div className="md:col-span-2 p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-3">
                  <span className="text-xs font-semibold text-zinc-300">
                    Related Keyword Variations
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.related_keywords.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => {
                          setKeyword(kw);
                          handleAnalyze(kw);
                        }}
                        className="px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-zinc-800/60 py-4 text-center text-xs text-zinc-500">
        GanimiRank • Autonomous Search Intelligence
      </footer>
    </div>
  );
}
