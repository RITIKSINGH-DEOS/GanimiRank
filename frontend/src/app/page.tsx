"use client";

import React, { useState } from "react";
import Background3D from "@/components/Background3D";
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

interface CompetitorTopicItem {
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
  competitor_topics?: CompetitorTopicItem[];
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
      ["Competing Topics & Titles"],
      ["Rank", "Title", "Keyword", "Search Volume", "Competition Level", "Intent"],
      ...(result.competitor_topics || []).map((t) => [
        t.position.toString(),
        `"${t.title.replace(/"/g, '""')}"`,
        `"${t.keyword.replace(/"/g, '""')}"`,
        t.search_volume,
        t.competition_level,
        t.intent
      ]),
      [],
      ["Top SERP Pages Scanned"],
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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black relative overflow-hidden">
      {/* Interactive 3D Ambient Background */}
      <Background3D />

      {/* Top Navbar */}
      <header className="border-b border-white/[0.08] bg-zinc-950/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white text-base">GanimiRank</span>
              <span className="text-[10px] font-mono tracking-widest uppercase bg-zinc-900 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700/60">
                v1.8.0
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
            <span className="hidden sm:inline">Guerrilla Search Engine</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] text-zinc-200 border border-white/15 text-[11px] shadow-[0_0_12px_rgba(255,255,255,0.08)]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live Engines
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6 relative z-10">
        {/* Search Command Bar */}
        <section className="space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="flex flex-col sm:flex-row gap-2 glass-panel p-2 rounded-2xl shadow-2xl backdrop-blur-2xl focus-within:border-white/35 focus-within:shadow-[0_0_25px_rgba(255,255,255,0.08)] transition-all"
          >
            <div className="flex-1 flex items-center gap-2.5 px-3 min-h-[44px]">
              <Search className="w-4 h-4 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Target keyword (e.g., Top 5 Best Cafe in Lucknow)..."
                className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0 px-2 sm:px-0">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-400">
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-transparent text-zinc-300 focus:outline-none cursor-pointer"
                >
                  <option value="in">India (IN)</option>
                  <option value="us">United States (US)</option>
                  <option value="uk">United Kingdom (UK)</option>
                  <option value="ca">Canada (CA)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={localGeo}
                  onChange={(e) => setLocalGeo(e.target.value)}
                  placeholder="Local Geo (optional)"
                  className="w-24 sm:w-28 bg-transparent text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !keyword.trim()}
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-white text-black font-semibold text-xs tracking-tight hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 px-1 overflow-x-auto">
            <span className="shrink-0 text-zinc-500 font-mono">Quick test:</span>
            {["Top 5 Best Cafe in Lucknow", "tunday kababi lucknow", "best street food in hazratganj", "top 5 upcoming tata electric cars in 2027"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setKeyword(preset);
                  handleAnalyze(preset);
                }}
                className="shrink-0 px-2.5 py-1 rounded-md glass-card-item hover:border-white/30 text-zinc-400 hover:text-white transition-all cursor-pointer text-[11px]"
              >
                {preset}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State / Initial Landing Showcase */}
        {!result && !loading && (
          <div className="py-8 sm:py-12 space-y-10">
            {/* Value Proposition Hero */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-mono text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Autonomous Search & Generative AI Intelligence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Dominate Google SERPs & AI Overviews
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl mx-auto">
                Scan Google Page 1 weak spots, calculate real search demand, and generate AEO/GEO blueprints for Google AI Overviews, Perplexity & ChatGPT Search.
              </p>
            </div>

            {/* 3 Monochrome Capability Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5 space-y-3 hover:border-white/30 cursor-default">
                <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  AEO & GEO Optimization
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Reverse-engineer Google AI Overviews, Perplexity, and ChatGPT citations with structured snippet blueprints.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-3 hover:border-white/30 cursor-default">
                <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Page 1 Weak Spot Detection
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Identify low-authority forums, Reddit, and Quora discussions ranking on Page 1 that you can outrank.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-3 hover:border-white/30 cursor-default">
                <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Viral CTR & Outline Formulas
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Generate 7 high-CTR headline formulas and exact People Also Ask H2/H3 outlines ready to publish in minutes.
                </p>
              </div>
            </div>

            {/* Engine Trust Strip */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-mono pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
                <span>100% Free Forever</span>
              </div>
              <span className="text-zinc-700">•</span>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-zinc-400" />
                <span>Real-Time Google Suggestions</span>
              </div>
              <span className="text-zinc-700">•</span>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-zinc-400" />
                <span>Global & Local SERP Audits</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Console */}
        {result && (
          <div className="space-y-6">
            {/* 4 Primary Dials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1: Guerrilla Opportunity Score */}
              <div className="glass-card rounded-2xl p-4.5 space-y-3 flex flex-col justify-between hover:border-white/30 cursor-default">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-400">Guerrilla Verdict</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        result.verdict === "GOLDMINE"
                          ? "bg-white text-black border border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                          : result.verdict === "MODERATE"
                          ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
                          : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                      }`}
                    >
                      {result.verdict}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tight text-white">
                      {result.opportunity_score}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 rounded-full bg-zinc-800/80 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.opportunity_score >= 70
                          ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                          : result.opportunity_score >= 45
                          ? "bg-zinc-300"
                          : "bg-zinc-600"
                      }`}
                      style={{ width: `${result.opportunity_score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    {result.opportunity_score >= 70
                      ? "High ranking probability with minimal backlink resistance."
                      : result.opportunity_score >= 45
                      ? "Moderate competition. Requires authoritative in-depth article."
                      : "Saturated SERP. Dominated by high DA giants."}
                  </p>
                </div>
              </div>

              {/* Card 2: Search Demand & Monthly Volume */}
              <div className="glass-card rounded-2xl p-4.5 space-y-3 flex flex-col justify-between hover:border-white/30 cursor-default">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-400">Search Demand</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{result.country}</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold tracking-tight text-white">
                    {result.demand_level}
                  </div>
                </div>
                
                {/* Search Volume Display */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-zinc-400" />
                    Search Volume:
                  </span>
                  <span className="font-mono font-semibold text-white text-sm">
                    {result.estimated_monthly_volume || "~350 / mo"}
                  </span>
                </div>
              </div>

              {/* Card 3: Direct Competitors & Google Page 1 Link */}
              <div className="glass-card rounded-2xl p-4.5 space-y-3 flex flex-col justify-between hover:border-white/30 cursor-default">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-400">Direct Competitors</span>
                    <span
                      className={`text-[10px] font-semibold font-mono ${
                        result.allintitle_count <= 30 ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      {result.allintitle_count <= 30 ? "Low Supply" : "Standard"}
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-bold tracking-tight text-white">
                    {result.allintitle_count}
                    <span className="text-xs text-zinc-400 font-medium ml-1.5">Competing Articles</span>
                  </div>
                </div>

                {/* Direct Google First Page Link */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-zinc-400 text-[11px]">Check SERP:</span>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(result.keyword)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-zinc-300 hover:text-white text-[11px] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    View Google Page 1
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Card 4: SERP Weak Spots */}
              <div className="glass-card rounded-2xl p-4.5 space-y-3 flex flex-col justify-between hover:border-white/30 cursor-default">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-400">Page 1 Weak Spots</span>
                    <span className="text-[10px] font-semibold text-white font-mono">
                      {result.weak_spots_found} Detected
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold tracking-tight text-white">
                      {result.weak_spots_found}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      / {result.total_serp_scanned} scanned
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Forums or directory listings you can easily outrank.
                </p>
              </div>
            </div>

            {/* Clean Tab Controls */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pt-2 pb-1">
              <div className="flex items-center gap-6 text-xs font-medium">
                <button
                  onClick={() => setActiveTab("serp")}
                  className={`pb-2 transition-colors relative cursor-pointer ${
                    activeTab === "serp"
                      ? "text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Competitor Titles ({result.competitor_topics?.length || 10})
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

            {/* TAB 1: Competing Titles & Topics with Search Volume & Competition */}
            {activeTab === "serp" && (
              <div className="glass-panel rounded-2xl divide-y divide-white/[0.06] overflow-hidden">
                {(!result.competitor_topics || result.competitor_topics.length === 0) ? (
                  <div className="p-8 text-center text-xs text-zinc-500">
                    No competitor topics found.
                  </div>
                ) : (
                  result.competitor_topics.map((topic) => (
                    <div
                      key={topic.position}
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.035] transition-colors cursor-default"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="text-xs font-mono text-zinc-500 w-5 pt-0.5 shrink-0">
                          #{topic.position}
                        </span>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-semibold text-zinc-100">
                              {topic.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap text-[11px] text-zinc-400 font-mono">
                            <span>{topic.keyword}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-500 text-[10px] uppercase font-sans tracking-wide">
                              {topic.intent}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Metrics & Action */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center pl-8 sm:pl-0">
                        {/* Search Volume Pill */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950/70 border border-white/[0.08] text-xs shadow-sm">
                          <Flame className="w-3 h-3 text-zinc-400" />
                          <span className="font-mono font-medium text-white">
                            {topic.search_volume}
                          </span>
                        </div>

                        {/* Competition Pill */}
                        <div className="flex flex-col items-end">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              topic.competition_level === "Low"
                                ? "text-white bg-white/10 border-white/25 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                : topic.competition_level === "Medium"
                                ? "text-zinc-300 bg-zinc-800 border-zinc-700"
                                : "text-zinc-400 bg-zinc-900 border-zinc-800"
                            }`}
                          >
                            {topic.competition_level} Competition
                          </span>
                          <span className="text-[9px] text-zinc-500 font-mono mt-0.5">
                            {topic.kgr_status}
                          </span>
                        </div>

                        {/* 1-Click Deep Scan Button */}
                        <button
                          onClick={() => {
                            setKeyword(topic.keyword);
                            handleAnalyze(topic.keyword);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 hover:border-white/30 rounded border border-zinc-700 transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-sm"
                          title="Deep scan this competitor topic"
                        >
                          Analyze
                          <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: AI Overviews & GEO Blueprint */}
            {activeTab === "aeo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card rounded-2xl p-5 space-y-3 hover:border-white/30">
                  <span className="text-xs font-semibold text-zinc-300">
                    AI Citation Readiness
                  </span>
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                      <span className="text-zinc-400">Google AI Overview Expected</span>
                      <span className="font-semibold text-zinc-200">
                        {result.aeo_geo.has_ai_overview ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                      <span className="text-zinc-400">Featured Snippet Opportunity</span>
                      <span className="font-semibold text-zinc-200">
                        {result.aeo_geo.has_featured_snippet ? "High" : "Low"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                      <span className="text-zinc-400">Recommended Layout</span>
                      <span className="font-mono text-zinc-300 uppercase text-[11px]">
                        {result.aeo_geo.recommended_format}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5 space-y-3 hover:border-white/30">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    Guerrilla Blueprint for AEO
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                    {result.aeo_geo.actionable_tip}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Titles & Subheadings Generator */}
            {activeTab === "content" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* High CTR Titles */}
                <div className="glass-card rounded-2xl p-5 space-y-3 hover:border-white/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">
                      Viral & High-CTR Title Formulas
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {result.high_ctr_titles.length} Suggestions
                    </span>
                  </div>
                  <div className="space-y-2 pt-1">
                    {result.high_ctr_titles.map((t, idx) => (
                      <div
                        key={idx}
                        className="glass-card-item p-3 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-white/30 hover:bg-zinc-900/60 transition-all group"
                      >
                        <span className="text-zinc-200 font-medium">{t}</span>
                        <button
                          onClick={() => handleCopy(t)}
                          className="text-zinc-500 group-hover:text-zinc-300 p-1 hover:bg-zinc-800 rounded transition-colors cursor-pointer shrink-0"
                          title="Copy title"
                        >
                          {copiedText === t ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* People Also Ask (H2/H3s) */}
                <div className="glass-card rounded-2xl p-5 space-y-3 hover:border-white/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">
                      People Also Ask (H2/H3 Section Outlines)
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {result.people_also_ask.length} Headings
                    </span>
                  </div>
                  <div className="space-y-2 pt-1">
                    {result.people_also_ask.map((q, idx) => (
                      <div
                        key={idx}
                        className="glass-card-item p-3 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-white/30 hover:bg-zinc-900/60 transition-all group"
                      >
                        <span className="text-zinc-300">{q}</span>
                        <button
                          onClick={() => handleCopy(q)}
                          className="text-zinc-500 group-hover:text-zinc-300 p-1 hover:bg-zinc-800 rounded transition-colors cursor-pointer shrink-0"
                          title="Copy question"
                        >
                          {copiedText === q ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sleek Minimal Footer */}
      <footer className="border-t border-white/[0.08] bg-zinc-950/40 backdrop-blur-md py-4 text-center text-xs text-zinc-400 font-mono relative z-10">
        Autonomous SEO & AEO/GEO
      </footer>
    </div>
  );
}
