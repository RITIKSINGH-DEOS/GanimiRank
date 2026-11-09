import React from "react";
import { Flame, ArrowUpRight } from "lucide-react";
import { KeywordAnalyzeResponse } from "@/types/keyword";

interface PrimaryDialsProps {
  result: KeywordAnalyzeResponse;
}

export default function PrimaryDials({ result }: PrimaryDialsProps) {
  return (
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
  );
}
