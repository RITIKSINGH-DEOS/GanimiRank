"use client";

import { useState } from "react";

export function useClipboard(timeoutMs: number = 2000) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => {
      setCopiedText((current) => (current === text ? null : current));
    }, timeoutMs);
  };

  return { copiedText, copy };
}
