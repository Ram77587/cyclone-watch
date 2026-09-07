// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCyclone } from "../../context/CycloneContext";

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme, isLiveBackend } = useCyclone();
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: "DASHBOARD", path: "/" },
    { label: "HISTORY", path: "/history" },
    { label: "DATA SOURCES", path: "/data-sources" },
    { label: "COLLECTION", path: "/data-collection" },
    { label: "EXPLORER", path: "/dataset-explorer" },
    { label: "SATELLITE", path: "/satellite-gallery" },
    { label: "QUALITY", path: "/data-quality" },
    { label: "ABOUT", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-150">
      {/* Station telemetry strip */}
      <div className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 px-4 py-1 text-[10px] font-mono flex items-center justify-between border-b border-slate-200 dark:border-slate-800 transition-colors duration-150">
        <div className="flex items-center gap-3">
          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            STATION STATUS: {isLiveBackend ? "FASTAPI + SQLITE LIVE" : "DEMO / FALLBACK MODE"}
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline">BASIN: NORTH INDIAN OCEAN</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-bold ${isLiveBackend ? "text-emerald-600 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
            [{isLiveBackend ? "LIVE DB SYNC" : "DEMO DATA"}]
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-900 dark:text-slate-200 font-bold">{utcTime}</span>
        </div>
      </div>

      {/* Main Bar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-700 border flex items-center justify-center font-mono font-bold text-xs transition-colors duration-150">
              RSMC
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white font-sans flex items-center gap-1.5">
                CYCLONE WATCH
                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 rounded border">
                  v1.2.0
                </span>
              </div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-sans uppercase tracking-tight hidden sm:block">
                AI Identification, Classification &amp; Prediction (Multi-Source Satellite Data)
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="flex items-center gap-1.5">
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-sans font-semibold transition-colors duration-150 ${
                      isActive
                        ? "bg-slate-900 text-white dark:bg-sky-600 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Theme Switcher Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Color Theme"
              className="ml-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 border rounded text-[11px] font-mono font-bold transition-colors duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {theme === "dark" ? (
                <>
                  <span className="text-amber-400">☀️</span> LIGHT
                </>
              ) : (
                <>
                  <span className="text-sky-600">🌙</span> DARK
                </>
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden ml-1 p-2 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
            >
              {mobileMenuOpen ? (
                <span className="font-mono text-sm font-bold">✕</span>
              ) : (
                <span className="font-mono text-sm font-bold">☰</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1 shadow-lg font-mono text-xs">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded text-xs font-semibold transition ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-sky-600 dark:text-white"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}