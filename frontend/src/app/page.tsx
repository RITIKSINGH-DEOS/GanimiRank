"use client";

import React, { useState } from "react";
import Background3D from "@/components/visuals/Background3D";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchCommandBar from "@/components/features/search/SearchCommandBar";
import LandingShowcase from "@/components/features/landing/LandingShowcase";
import ScanningConsole from "@/components/features/scanner/ScanningConsole";
import PrimaryDials from "@/components/features/analytics/PrimaryDials";
import CompetitorTopicsTab from "@/components/features/analytics/CompetitorTopicsTab";
import AeoGeoTab from "@/components/features/analytics/AeoGeoTab";
import ContentFormulasTab from "@/components/features/analytics/ContentFormulasTab";

import { useClipboard } from "@/hooks/useClipboard";
import { useScanningPacer } from "@/hooks/useScanningPacer";
import { analyzeKeyword } from "@/services/api";
import { exportAnalysisToCsv } from "@/lib/exportCsv";
import { KeywordAnalyzeResponse } from "@/types/keyword";

import { AlertTriangle, Download } from "lucide-react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("in");
  const [localGeo, setLocalGeo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<KeywordAnalyzeResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"serp" | "aeo" | "content">("serp");

  const { copiedText, copy } = useClipboard();
  const { scanStepIndex, scanProgress, scanSteps } = useScanningPacer(loading);

  const handleAnalyze = async (searchKw?: string) => {
    const targetKw = searchKw || keyword;
    if (!targetKw.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeKeyword({
        keyword: targetKw,
        country,
        local_geo: localGeo,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to search engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black relative overflow-hidden">
      {/* Interactive 3D Ambient Starlight Lattice */}
      <Background3D key="bg-monochrome-stars-active" />

      {/* Top Navbar */}
      <Header />

      {/* Main Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6 relative z-10">
        {/* Search Command Bar & Presets */}
        <SearchCommandBar
          keyword={keyword}
          setKeyword={setKeyword}
          country={country}
          setCountry={setCountry}
          localGeo={localGeo}
          setLocalGeo={setLocalGeo}
          loading={loading}
          onAnalyze={handleAnalyze}
        />

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State / Initial Landing Showcase */}
        {!result && !loading && <LandingShowcase />}

        {/* Active Scanning Live Radar & Skeleton Shimmer Console */}
        {loading && (
          <ScanningConsole
            keyword={keyword}
            country={country}
            scanStepIndex={scanStepIndex}
            scanProgress={scanProgress}
            scanSteps={scanSteps}
          />
        )}

        {/* Results Console */}
        {result && !loading && (
          <div className="space-y-6">
            {/* 4 Primary Dials Grid */}
            <PrimaryDials result={result} />

            {/* Clean Tab Navigation Bar */}
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

              {/* Minimal CSV Export Action */}
              <button
                onClick={() => exportAnalysisToCsv(result)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 pb-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {/* TAB 1: Competing Titles & Topics */}
            {activeTab === "serp" && (
              <CompetitorTopicsTab
                topics={result.competitor_topics}
                onAnalyzeTopic={(topicKeyword) => {
                  setKeyword(topicKeyword);
                  handleAnalyze(topicKeyword);
                }}
              />
            )}

            {/* TAB 2: AI Overviews & GEO Blueprint */}
            {activeTab === "aeo" && <AeoGeoTab aeoGeo={result.aeo_geo} />}

            {/* TAB 3: Titles & Subheadings Generator */}
            {activeTab === "content" && (
              <ContentFormulasTab
                highCtrTitles={result.high_ctr_titles}
                peopleAlsoAsk={result.people_also_ask}
                onCopy={copy}
                copiedText={copiedText}
              />
            )}
          </div>
        )}
      </main>

      {/* Sleek Minimal Footer */}
      <Footer />
    </div>
  );
}
