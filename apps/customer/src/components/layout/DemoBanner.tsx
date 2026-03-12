"use client";

import React, { useState } from "react";
import { Zap, X } from "lucide-react";
import Link from "next/link";

export function DemoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-brand-accent text-brand-primary px-4 py-3 flex items-center justify-between gap-4 z-50 relative">
      <div className="flex items-center gap-3 flex-1 justify-center text-sm font-black">
        <Zap size={16} fill="currentColor" />
        <span>
          🎯 <span className="uppercase tracking-widest text-[10px]">Demo Mode</span>{" "}
          — You're viewing RebookIndia with sample data. Payments are disabled.{" "}
          <Link href="/login" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
            Sign in to use real features →
          </Link>
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="p-1.5 hover:bg-black/10 rounded-lg transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
