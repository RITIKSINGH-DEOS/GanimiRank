import React from "react";
import { Zap } from "lucide-react";

interface ScanningConsoleProps {
  keyword: string;
  country: string;
  scanStepIndex: number;
  scanProgress: number;
  scanSteps: string[];
}

export default function ScanningConsole({
  keyword,
  country,
  scanStepIndex,
  scanProgress,
  scanSteps,
}: ScanningConsoleProps) {
  return (
    <div className="space-y-6 py-2">
      {/* Live Radar Status Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-6 justify-between border-white/20 relative overflow-hidden shadow-2xl">
        {/* Left: Concentric Radar Animation & Status */}
        <div className="flex items-center gap-4.5 z-10 min-w-0">
          <div className="relative w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.12)]">
            <div className="absolute inset-0 rounded-2xl border border-white/30 animate-gentle-pulse" />
            <Zap className="w-5 h-5 text-white animate-pulse fill-white" />
          </div>
          <div className="space-y-1 text-center sm:text-left min-w-0 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                Live Search Engine Audit
              </span>
            </div>
            <div className="h-6 sm:h-7 flex items-center overflow-hidden">
              <span
                key={scanStepIndex}
                className="text-xs sm:text-sm font-semibold text-white tracking-tight animate-fade-in line-clamp-1"
              >
                {scanSteps[scanStepIndex]}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              Target: &ldquo;{keyword}&rdquo; • Country: {country.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Right: Live Progress Bar & Counter */}
        <div className="w-full sm:w-56 shrink-0 space-y-2 z-10 text-xs">
          <div className="flex justify-between font-mono text-zinc-400 text-[11px]">
            <span>Auditing SERP Nodes</span>
            <span className="text-white font-semibold">{scanProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-800/80 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Primary Dials Skeleton Shimmer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="glass-card rounded-2xl p-4.5 space-y-4 animate-shimmer"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="h-4 w-14 rounded-full bg-white/10" />
            </div>
            <div className="h-7 w-24 rounded bg-white/15" />
            <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
              <div className="h-2.5 w-full rounded bg-white/10" />
              <div className="h-2 w-3/4 rounded bg-white/[0.06]" />
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton Competitor Intelligence Rows */}
      <div className="glass-panel rounded-2xl p-4 divide-y divide-white/[0.06] animate-shimmer space-y-3">
        <div className="flex justify-between pb-3">
          <div className="h-3 w-36 rounded bg-white/15" />
          <div className="h-3 w-24 rounded bg-white/10" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="pt-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-2/3">
              <div className="w-5 h-4 rounded bg-white/10 shrink-0" />
              <div className="space-y-1.5 w-full">
                <div className="h-3.5 w-4/5 rounded bg-white/15" />
                <div className="h-2.5 w-1/2 rounded bg-white/10" />
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-6 w-16 rounded bg-white/10" />
              <div className="h-6 w-20 rounded bg-white/10" />
              <div className="h-6 w-14 rounded bg-white/15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
