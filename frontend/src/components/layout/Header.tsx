"use client";

import React from "react";
import { Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-white/[0.08] bg-zinc-950/40 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <Zap className="w-4 h-4 text-black fill-black" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-white text-base">GanimiRank</span>
            <span className="text-[10px] font-mono tracking-widest uppercase bg-zinc-900 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700/60">
              v2.1.0
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] text-zinc-200 border border-white/15 text-[11px] shadow-[0_0_12px_rgba(255,255,255,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live Engines
          </span>
        </div>
      </div>
    </header>
  );
}
