"use client";

import React, { useState } from "react";
import {
  Search,
  ShieldAlert,
  Sparkles,
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
  TrendingUp,
  HelpCircle,
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
  const [intentFilter, setIntentFilter] = useState("all");
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
          intent_filter: intentFilter
        })
      });

      if (!res.ok) {
        throw new Error(`Engine returned status ${res.status}`);
      }

      const data: KeywordAnalyzeResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to GanimiRank backend engine.");
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
      ["Demand Level", result.demand_level],
      ["Allintitle (KGR) Count", result.allintitle_count.toString()],
      ["Weak Spots Found", result.weak_spots_found.toString()],
      ["AEO Readiness Score", `${result.aeo_geo.aeo_potential_score}/100`],
      ["AEO Recommended Format", result.aeo_geo.recommended_format],
      [],
      ["Top 10 SERP Competitors"],
      ["Position", "Domain", "Title", "Is Weak Spot?", "Weak Spot Type", "URL"],
      ...result.serp_results.map((s) => [
        s.position.toString(),
        s.domain,
        `"${s.title.replace(/"/g, '""')}"`,
        s.is_weak_spot ? "YES" : "NO",
        s.weak_spot_type || "None",
        s.url
      ]),
      [],
      ["High-CTR Suggested Titles"],
      ...result.high_ctr_titles.map((t) => [`"${t.replace(/"/g, '""')}"`]),
      [],
      ["People Also Ask (PAA) Questions"],
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
    <div className="flex flex-col min-h-screen">
      {/* Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/10 border border-amber-500/30">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  GanimiRank
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Guerrilla SEO
                </span>
              </div>
              <p className="text-xs text-zinc-500">Autonomous Search Intelligence & AEO/GEO Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              100% Free Forever Engine
            </span>
          </div>
        </div>
      </header>

      {/* Hero & Command Console */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Title & Philosophy */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Find High-Traffic SERP Gaps{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              Before Anyone Else
            </span>
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Scan Google Page 1 for weak spots (Reddit, Quora, generic titles), extract real KGR allintitle counts, and optimize for AI Overviews & Perplexity.
          </p>
        </div>

        {/* Search Command Box */}
        <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Seed Keyword Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Enter seed keyword (e.g. 'tunday kababi lucknow', 'best mechanical keyboard')"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium"
              />
            </div>

            {/* Target Country Selector */}
            <div className="flex items-center gap-2">
              <div className="relative min-w-[140px]">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-9 pr-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 appearance-none cursor-pointer"
                >
                  <option value="in">India (🇮🇳)</option>
                  <option value="us">United States (🇺🇸)</option>
                  <option value="uk">United Kingdom (🇬🇧)</option>
                  <option value="ca">Canada (🇨🇦)</option>
                  <option value="worldwide">Global (🌐)</option>
                </select>
              </div>

              {/* Local Geo Filter */}
              <div className="relative min-w-[150px]">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="City (e.g. Lucknow)"
                  value={localGeo}
                  onChange={(e) => setLocalGeo(e.target.value)}
                  className="w-full pl-9 pr-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 placeholder-zinc-600"
                />
              </div>

              {/* Run CTA */}
              <button
                onClick={() => handleAnalyze()}
                disabled={loading || !keyword.trim()}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-zinc-950" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Test Sample Queries */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 pt-1">
            <span className="font-semibold text-zinc-400">Quick Probes:</span>
            {[
              { label: "Lucknow Food: Tunday Kababi", kw: "tunday kababi lucknow", geo: "Lucknow" },
              { label: "Food: Basket Chaat", kw: "best basket chaat in lucknow", geo: "Lucknow" },
              { label: "Tech: Python vs Mojo", kw: "python vs mojo programming", geo: "" },
              { label: "Finance: SIP vs Lump Sum", kw: "sip vs lumpsum calculator", geo: "" }
            ].map((sample) => (
              <button
                key={sample.label}
                onClick={() => {
                  setKeyword(sample.kw);
                  setLocalGeo(sample.geo);
                  handleAnalyze(sample.kw);
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 hover:text-amber-400 text-zinc-400 border border-zinc-700/50 transition-colors cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Console */}
        {result && (
          <div className="space-y-6">
            {/* Executive Opportunity Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Verdict Card */}
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex flex-col justify-between md:col-span-1">
                <div>
                  <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                    Guerrilla Verdict
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    {result.verdict === "GOLDMINE" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                        GOLDMINE OPPORTUNITY
                      </span>
                    ) : result.verdict === "MODERATE" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <AlertTriangle className="w-4 h-4" />
                        MODERATE EFFORT
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-4 h-4" />
                        SKIP (AUTHORITY HEAVY)
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-4xl font-extrabold tracking-tight text-white">
                      {result.opportunity_score}
                    </span>
                    <span className="text-sm text-zinc-500 ml-1">/ 100</span>
                  </div>
                  <span className="text-xs text-zinc-400 font-medium">Opportunity Score</span>
                </div>
              </div>

              {/* Demand Level Card */}
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    Search Demand
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-white tracking-tight">
                    {result.demand_level}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Calculated from Google Autocomplete tier weight & query depth.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>Target Region</span>
                  <span className="font-semibold text-zinc-200 uppercase">{result.country}</span>
                </div>
              </div>

              {/* Allintitle KGR Card */}
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Allintitle Count (KGR)
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-white tracking-tight">
                    {result.allintitle_count}
                    <span className="text-xs text-zinc-500 font-normal ml-2">exact competitors</span>
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    {result.allintitle_count <= 30
                      ? "Zero competition zone! Google lacks dedicated titles."
                      : result.allintitle_count <= 100
                      ? "Manageable competition. Target with a strong on-page post."
                      : "Saturated query. Avoid on brand-new blogs."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>Golden Ratio Status</span>
                  <span
                    className={`font-semibold ${
                      result.allintitle_count <= 30 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {result.allintitle_count <= 30 ? "Pass (<30)" : "Moderate (>30)"}
                  </span>
                </div>
              </div>

              {/* Weak Spots Detected Card */}
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    SERP Weak Spots
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-white tracking-tight">
                    {result.weak_spots_found}{" "}
                    <span className="text-xs text-zinc-500 font-normal">/ {result.total_serp_scanned} scanned</span>
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Forums (Reddit/Quora) or un-optimized titles currently occupying Page 1.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>Guerrilla Targetability</span>
                  <span className="font-semibold text-emerald-400">
                    {result.weak_spots_found >= 2 ? "High Vulnerability" : "Standard"}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setActiveTab("serp")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "serp"
                      ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  SERP Weak-Spot Audit ({result.weak_spots_found})
                </button>
                <button
                  onClick={() => setActiveTab("aeo")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "aeo"
                      ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  AEO & GEO Blueprint ({result.aeo_geo.aeo_potential_score}%)
                </button>
                <button
                  onClick={() => setActiveTab("content")}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "content"
                      ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Titles & PAA ({result.high_ctr_titles.length})
                </button>
              </div>

              {/* CSV Export Button */}
              <button
                onClick={exportCSV}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                Export CSV Report
              </button>
            </div>

            {/* TAB 1: SERP Weak-Spot Audit */}
            {activeTab === "serp" && (
              <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden shadow-xl">
                <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Top 10 Live Organic Google Results
                  </h3>
                  <span className="text-xs text-zinc-500">
                    Click links to inspect live competitor rankings
                  </span>
                </div>

                <div className="divide-y divide-zinc-800/60">
                  {result.serp_results.map((item) => (
                    <div
                      key={item.position}
                      className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        item.is_weak_spot ? "bg-emerald-500/5 hover:bg-emerald-500/10" : "hover:bg-zinc-800/30"
                      }`}
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 font-bold text-xs flex items-center justify-center shrink-0 border border-zinc-700/50">
                          #{item.position}
                        </span>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-sm text-zinc-100 hover:text-amber-400 flex items-center gap-1 truncate transition-colors"
                            >
                              {item.title}
                              <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                            </a>
                            {item.is_weak_spot && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {item.weak_spot_type || "Weak Spot"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 truncate">{item.domain}</p>
                          {item.snippet && (
                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                              {item.snippet}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {item.is_weak_spot ? (
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            Vulnerable Target
                          </span>
                        ) : (
                          <span className="text-[11px] text-zinc-500 bg-zinc-800/50 px-2.5 py-1 rounded-lg">
                            Strong Target
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: AEO & GEO Blueprint */}
            {activeTab === "aeo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Overview Status */}
                <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                      <Bot className="w-4 h-4 text-indigo-400" />
                      Answer Engine Status
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {result.aeo_geo.aeo_potential_score}% Citation Potential
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                      <span className="text-xs text-zinc-300">Google AI Overview Triggered?</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          result.aeo_geo.has_ai_overview
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {result.aeo_geo.has_ai_overview ? "YES (Active)" : "NO (Standard)"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                      <span className="text-xs text-zinc-300">Featured Snippet (Pos 0)?</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          result.aeo_geo.has_featured_snippet
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {result.aeo_geo.has_featured_snippet ? "YES (Active)" : "NO"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                      <span className="text-xs text-zinc-300">AI Citation Gap Identified?</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          result.aeo_geo.ai_citation_weakness
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {result.aeo_geo.ai_citation_weakness ? "YES (Weak Source Citing)" : "NO"}
                      </span>
                    </div>
                  </div>

                  {result.aeo_geo.ai_citation_weakness && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed">
                      🔥 <strong>Guerrilla Citation Hijack:</strong> Google AI / Perplexity is currently citing forums or generic content ({result.aeo_geo.citation_source_type || "User Discussion"}). Publishing a structured, authoritative blog post gives you an immediate shot at becoming the #1 Cited Source.
                    </div>
                  )}
                </div>

                {/* Content Structure Blueprint */}
                <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl space-y-4">
                  <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Recommended Generative Formatting
                  </span>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                      Format Required by LLMs
                    </span>
                    <p className="text-sm font-bold text-amber-400">
                      {result.aeo_geo.recommended_format}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                      Actionable Optimization Tip
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {result.aeo_geo.actionable_tip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Content Ideas & Titles */}
            {activeTab === "content" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* High-CTR Titles */}
                <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Clickable High-CTR Blog Titles
                    </span>
                    <span className="text-xs text-zinc-500">Click to copy</span>
                  </h3>

                  <div className="space-y-2.5">
                    {result.high_ctr_titles.map((title) => (
                      <button
                        key={title}
                        onClick={() => handleCopy(title)}
                        className="w-full p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/50 border border-zinc-800 text-left text-xs font-medium text-zinc-200 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span className="truncate pr-2">{title}</span>
                        {copiedText === title ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Copy className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* People Also Ask (H2/H3 Headings) */}
                <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-orange-400" />
                      H2 & H3 FAQ Headings (PAA)
                    </span>
                    <span className="text-xs text-zinc-500">Click to copy</span>
                  </h3>

                  <div className="space-y-2.5">
                    {result.people_also_ask.map((paa) => (
                      <button
                        key={paa}
                        onClick={() => handleCopy(paa)}
                        className="w-full p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/50 border border-zinc-800 text-left text-xs font-medium text-zinc-200 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span className="truncate pr-2">{paa}</span>
                        {copiedText === paa ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Copy className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Related Keywords Cloud */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Expanded Autocomplete & LSI Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.related_keywords.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => {
                          setKeyword(kw);
                          handleAnalyze(kw);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {kw}
                        <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 mt-12 bg-zinc-950 text-center text-xs text-zinc-500">
        GanimiRank • Autonomous Guerrilla Search Intelligence & AEO/GEO Dominance Engine • Built for Independent Creators
      </footer>
    </div>
  );
}
