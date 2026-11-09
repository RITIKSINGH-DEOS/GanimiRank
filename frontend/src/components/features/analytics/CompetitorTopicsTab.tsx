import React from "react";
import { Flame, ArrowUpRight } from "lucide-react";
import { CompetitorTopicItem } from "@/types/keyword";

interface CompetitorTopicsTabProps {
  topics?: CompetitorTopicItem[];
  onAnalyzeTopic: (keyword: string) => void;
}

export default function CompetitorTopicsTab({
  topics,
  onAnalyzeTopic,
}: CompetitorTopicsTabProps) {
  if (!topics || topics.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-xs text-zinc-500">
        No competitor topics found.
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl divide-y divide-white/[0.06] overflow-hidden">
      {topics.map((topic) => (
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
              onClick={() => onAnalyzeTopic(topic.keyword)}
              className="px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 hover:border-white/30 rounded border border-zinc-700 transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-sm"
              title="Deep scan this competitor topic"
            >
              Analyze
              <ArrowUpRight className="w-3 h-3 text-zinc-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
