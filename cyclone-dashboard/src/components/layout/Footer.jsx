// src/components/layout/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
        <div>
          CYCLONE WATCH — AI TROPICAL CYCLONE INTELLIGENCE SYSTEM
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span>DATA PROVIDERS:</span>
          <a
            href="https://www.mosdac.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-600 dark:hover:text-sky-400 transition underline underline-offset-2"
          >
            ISRO MOSDAC
          </a>
          <span>•</span>
          <a
            href="https://www.ncei.noaa.gov/products/international-best-track-archive"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-600 dark:hover:text-sky-400 transition underline underline-offset-2"
          >
            NOAA IBTrACS
          </a>
          <span>•</span>
          <a
            href="https://rsmcnewdelhi.imd.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-600 dark:hover:text-sky-400 transition underline underline-offset-2"
          >
            IMD RSMC
          </a>
          <span className="text-slate-400 dark:text-slate-600">|</span>
          <span className="text-slate-600 dark:text-slate-300 font-bold">[SIH 2026 PROTOTYPE]</span>
        </div>
      </div>
    </footer>
  );
}