// src/components/charts/CategoryGauge.jsx
import React from "react";

const CATEGORIES = [
  { code: "D", label: "Depression", minWind: 31, maxWind: 49 },
  { code: "DD", label: "Deep Depression", minWind: 50, maxWind: 61 },
  { code: "CS", label: "Cyclonic Storm", minWind: 62, maxWind: 88 },
  { code: "SCS", label: "Severe Cyclonic Storm", minWind: 89, maxWind: 117 },
  { code: "VSCS", label: "Very Severe Cyclonic Storm", minWind: 118, maxWind: 166 },
  { code: "ESCS", label: "Extremely Severe Cyclonic Storm", minWind: 167, maxWind: 221 },
  { code: "SuCS", label: "Super Cyclonic Storm", minWind: 222, maxWind: 999 },
];

export default function CategoryGauge({ category = "VSCS" }) {
  const activeIdx = CATEGORIES.findIndex((c) => c.code === category);

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="grid grid-cols-7 gap-1">
        {CATEGORIES.map((cat, idx) => {
          const isActive = idx === activeIdx;
          const isPast = idx < activeIdx;

          return (
            <div
              key={cat.code}
              className={`p-2 rounded text-center border transition-all duration-150 ${
                isActive
                  ? "bg-amber-500 text-white font-bold border-amber-600 shadow-sm scale-105"
                  : isPast
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                  : "bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800/80 opacity-60"
              }`}
            >
              <div className="text-[10px] font-bold">{cat.code}</div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-sans border-t border-slate-100 dark:border-slate-800/80 pt-2">
        <span>Scale: <strong className="font-mono text-slate-800 dark:text-slate-200">IMD 7-Stage Scale</strong></span>
        <span>Active: <strong className="font-mono text-amber-600 dark:text-amber-400">{category}</strong></span>
      </div>
    </div>
  );
}