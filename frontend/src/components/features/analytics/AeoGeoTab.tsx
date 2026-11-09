import React from "react";
import { Sparkles } from "lucide-react";
import { AeoGeoAnalysis } from "@/types/keyword";

interface AeoGeoTabProps {
  aeoGeo: AeoGeoAnalysis;
}

export default function AeoGeoTab({ aeoGeo }: AeoGeoTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="glass-card rounded-2xl p-5 space-y-3 hover:border-white/30">
        <span className="text-xs font-semibold text-zinc-300">
          AI Citation Readiness
        </span>
        <div className="space-y-2 pt-1 text-xs">
          <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
            <span className="text-zinc-400">Google AI Overview Expected</span>
            <span className="font-semibold text-zinc-200">
              {aeoGeo.has_ai_overview ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
            <span className="text-zinc-400">Featured Snippet Opportunity</span>
            <span className="font-semibold text-zinc-200">
              {aeoGeo.has_featured_snippet ? "High" : "Low"}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
            <span className="text-zinc-400">Recommended Layout</span>
            <span className="font-mono text-zinc-300 uppercase text-[11px]">
              {aeoGeo.recommended_format}
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
          {aeoGeo.actionable_tip}
        </p>
      </div>
    </div>
  );
}
