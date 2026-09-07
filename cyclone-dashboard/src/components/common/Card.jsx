// src/components/common/Card.jsx
import React from "react";

export default function Card({ title, subtitle, badge, action, children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-station overflow-hidden flex flex-col transition-colors duration-150 ${className}`}>
      {title && (
        <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 transition-colors duration-150">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
            <h2 className="text-[11px] font-sans font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase">
              {title}
            </h2>
            {badge && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {badge}
              </span>
            )}
          </div>
          {action && <div>{action}</div>}
          {subtitle && (
            <span className="text-[10px] font-sans text-slate-500 hidden sm:inline">{subtitle}</span>
          )}
        </div>
      )}
      <div className="p-3.5 flex-1">{children}</div>
    </div>
  );
}