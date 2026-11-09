import React from "react";
import { Flame, ArrowUpRight } from "lucide-react";
import { CompetitorTopicItem } from "@/types/keyword";

interface CompetitorTopicsTabProps {
  topics?: CompetitorTopicItem[];
  onAnalyzeTopic: (keyword: string) => void;
}

function getNumericVolume(volumeStr?: string, volumeNum?: number): number {
  if (volumeNum && volumeNum > 0) return volumeNum;
  if (!volumeStr) return 0;
  const cleaned = volumeStr.replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

function getVolumeStyle(volume: number) {
  if (volume >= 12000) {
    return {
      pill: "bg-emerald-950/40 border-emerald-500/30 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.15)]",
      flame: "text-emerald-400 fill-emerald-400/40",
      text: "text-emerald-300",
    };
  } else if (volume >= 7000) {
    return {
      pill: "bg-amber-950/40 border-amber-500/30 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.15)]",
      flame: "text-amber-400 fill-amber-400/40",
      text: "text-amber-300",
    };
  } else {
    return {
      pill: "bg-rose-950/40 border-rose-500/30 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
      flame: "text-rose-400 fill-rose-400/40",
      text: "text-rose-300",
    };
  }
}

function getCompetitionStyle(level: "Low" | "Medium" | "High") {
  if (level === "Low") {
    return {
      badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.15)]",
      subtitle: "text-emerald-400/80",
    };
  } else if (level === "Medium") {
    return {
      badge: "text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.15)]",
      subtitle: "text-amber-400/80",
    };
  } else {
    return {
      badge: "text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
      subtitle: "text-rose-400/80",
    };
  }
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
      {topics.map((topic) => {
        const volNum = getNumericVolume(topic.search_volume, topic.volume_numeric);
        const volStyle = getVolumeStyle(volNum);
        const compStyle = getCompetitionStyle(topic.competition_level);

        return (
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

            {/* Metrics & Action: 3 Boxes Perfectly Aligned Horizontally in One Line */}
            <div className="flex flex-col items-end gap-1 shrink-0 self-end sm:self-center pl-8 sm:pl-0">
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* 1. Dynamic Traffic-Light Search Volume Pill */}
                <div
                  className={`h-7 px-2.5 rounded-md border text-xs shadow-sm flex items-center gap-1.5 transition-colors ${volStyle.pill}`}
                >
                  <Flame className={`w-3.5 h-3.5 ${volStyle.flame}`} />
                  <span className={`font-mono font-medium ${volStyle.text}`}>
                    {topic.search_volume}
                  </span>
                </div>

                {/* 2. Dynamic Traffic-Light Competition Pill */}
                <span
                  className={`h-7 px-2.5 rounded-md border text-xs font-semibold flex items-center shadow-sm transition-colors ${compStyle.badge}`}
                >
                  {topic.competition_level} Competition
                </span>

                {/* 3. 1-Click Deep Scan Button */}
                <button
                  onClick={() => onAnalyzeTopic(topic.keyword)}
                  className="h-7 px-2.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 hover:border-white/30 rounded-md border border-zinc-700 transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-sm"
                  title="Deep scan this competitor topic"
                >
                  Analyze
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              </div>

              {/* Subtitle Aligned Below the Row - Compact refined font size */}
              <span className={`text-[9px] font-mono pr-1 tracking-tight ${compStyle.subtitle}`}>
                {topic.kgr_status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
