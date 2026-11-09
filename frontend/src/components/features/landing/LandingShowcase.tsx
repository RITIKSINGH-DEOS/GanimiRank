import React from "react";
import { Bot, Layers, TrendingUp, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";

export default function LandingShowcase() {
  return (
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
  );
}
