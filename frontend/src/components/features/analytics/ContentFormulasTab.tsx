import React from "react";
import { Copy, Check } from "lucide-react";

interface ContentFormulasTabProps {
  highCtrTitles: string[];
  peopleAlsoAsk: string[];
  onCopy: (text: string) => void;
  copiedText: string | null;
}

export default function ContentFormulasTab({
  highCtrTitles,
  peopleAlsoAsk,
  onCopy,
  copiedText,
}: ContentFormulasTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* High CTR Titles */}
      <div className="glass-card rounded-2xl p-5 space-y-3 hover:border-white/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300">
            Viral & High-CTR Title Formulas
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {highCtrTitles.length} Suggestions
          </span>
        </div>
        <div className="space-y-2 pt-1">
          {highCtrTitles.map((t, idx) => (
            <div
              key={idx}
              className="glass-card-item p-3 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-white/30 hover:bg-zinc-900/60 transition-all group"
            >
              <span className="text-zinc-200 font-medium">{t}</span>
              <button
                onClick={() => onCopy(t)}
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
            {peopleAlsoAsk.length} Headings
          </span>
        </div>
        <div className="space-y-2 pt-1">
          {peopleAlsoAsk.map((q, idx) => (
            <div
              key={idx}
              className="glass-card-item p-3 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-white/30 hover:bg-zinc-900/60 transition-all group"
            >
              <span className="text-zinc-300">{q}</span>
              <button
                onClick={() => onCopy(q)}
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
  );
}
