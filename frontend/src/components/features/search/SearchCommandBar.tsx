"use client";

import React from "react";
import { Search, Globe, MapPin, Zap } from "lucide-react";

interface SearchCommandBarProps {
  keyword: string;
  setKeyword: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  localGeo: string;
  setLocalGeo: (value: string) => void;
  loading: boolean;
  onAnalyze: (customKeyword?: string) => void;
}

const PRESET_QUERIES = [
  "Top 5 Best Cafe in Lucknow",
  "tunday kababi lucknow",
  "best street food in hazratganj",
  "top 5 upcoming tata electric cars in 2027",
];

export default function SearchCommandBar({
  keyword,
  setKeyword,
  country,
  setCountry,
  localGeo,
  setLocalGeo,
  loading,
  onAnalyze,
}: SearchCommandBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim() && !loading) {
      onAnalyze();
    }
  };

  return (
    <section className="space-y-3">
      <form
        onSubmit={handleSubmit}
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
        {PRESET_QUERIES.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              setKeyword(preset);
              onAnalyze(preset);
            }}
            className="shrink-0 px-2.5 py-1 rounded-md glass-card-item hover:border-white/30 text-zinc-400 hover:text-white transition-all cursor-pointer text-[11px]"
          >
            {preset}
          </button>
        ))}
      </div>
    </section>
  );
}
