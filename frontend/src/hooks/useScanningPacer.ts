"use client";

import { useState, useEffect } from "react";

export const SCAN_STEPS = [
  "Querying live Google Autocomplete & Search suggestion matrices...",
  "Scanning Google Page 1 SERP results for forum & weak spot openings...",
  "Calculating Allintitle KGR supply ratio & monthly volume...",
  "Reverse-engineering Google AI Overviews & Perplexity citation blueprints...",
  "Synthesizing viral high-CTR formulas and People Also Ask outlines...",
];

export function useScanningPacer(loading: boolean) {
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [scanProgress, setScanProgress] = useState(15);

  useEffect(() => {
    if (!loading) {
      setScanProgress(15);
      setScanStepIndex(0);
      return;
    }

    // Calm, readable step pacing (1.4s per step)
    const stepInterval = setInterval(() => {
      setScanStepIndex((prev) => (prev + 1) % SCAN_STEPS.length);
    }, 1400);

    // Continuous, silky smooth progress interpolation
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 92) return prev;
        const next = prev + Math.floor(Math.random() * 5) + 3;
        return next > 92 ? 92 : next;
      });
    }, 280);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [loading]);

  return { scanStepIndex, scanProgress, scanSteps: SCAN_STEPS };
}
