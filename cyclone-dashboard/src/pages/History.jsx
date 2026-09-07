// src/pages/History.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import { getCyclones } from "../api/cycloneApi";
import { useCyclone } from "../context/CycloneContext";

export default function History() {
  const navigate = useNavigate();
  const { setActiveCyclone } = useCyclone();
  const [cyclones, setCyclones] = useState([]);

  useEffect(() => { getCyclones().then(setCyclones).catch(console.error); }, []);

  const handleInspect = (storm) => {
    if (storm) {
      setActiveCyclone(storm);
      navigate(`/cyclone/${storm.id}`);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedBasin, setSelectedBasin] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");

  const years = useMemo(() => {
    const set = new Set(cyclones.map((c) => c.year));
    return ["All", ...Array.from(set).sort((a, b) => b - a)];
  }, [cyclones]);

  const basins = useMemo(() => {
    const set = new Set(cyclones.map((c) => c.basin));
    return ["All", ...Array.from(set)];
  }, [cyclones]);

  const categories = useMemo(() => {
    const set = new Set(cyclones.map((c) => c.category));
    return ["All", ...Array.from(set)];
  }, [cyclones]);

  const sources = useMemo(() => {
    const set = new Set(cyclones.map((c) => c.source));
    return ["All", ...Array.from(set)];
  }, [cyclones]);

  const filteredCyclones = useMemo(() => {
    return cyclones.filter((c) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.landfallLocation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesYear =
        selectedYear === "All" || c.year.toString() === selectedYear.toString();

      const matchesBasin = selectedBasin === "All" || c.basin === selectedBasin;

      const matchesCategory =
        selectedCategory === "All" || c.category === selectedCategory;

      const matchesSource =
        selectedSource === "All" || c.source.includes(selectedSource);

      return (
        matchesSearch &&
        matchesYear &&
        matchesBasin &&
        matchesCategory &&
        matchesSource
      );
    });
  }, [cyclones, searchTerm, selectedYear, selectedBasin, selectedCategory, selectedSource]);

  return (
    <div className="space-y-4 pb-12">
      {/* Simulation Notice Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 px-3.5 py-1.5 rounded text-[11px] font-mono text-amber-900 dark:text-amber-300 flex flex-wrap items-center justify-between gap-2 transition-colors duration-150">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold rounded text-[9px]">
            ARCHIVE REPOSITORY
          </span>
          <span>
            SYNOPTIC NORTH INDIAN OCEAN BEST TRACK CATALOG (2013–2023)
          </span>
        </div>
        <div className="text-slate-600 dark:text-slate-400 text-[10px]">
          STANDARDIZED VIA NOAA IBTrACS V4 + RSMC NEW DELHI BEST-TRACK DATA
        </div>
      </div>

      {/* Main Page Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4 shadow-station flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-150">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
            HISTORICAL CYCLONE ARCHIVE
          </h1>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">
            Standardized record catalog derived from IBTrACS, IMD RSMC New Delhi, MOSDAC, and HURSAT-B1.
          </p>
        </div>
        <div className="self-start sm:self-auto px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
          FILTERED: <span className="text-sky-600 dark:text-sky-400">{filteredCyclones.length}</span> OF {cyclones.length}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <Card title="SEARCH &amp; FILTER REPOSITORY" badge="ACTIVE QUERY">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              SEARCH STORM / LOCATION
            </label>
            <input
              type="text"
              placeholder="e.g. Fani, Gujarat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              SEASON / YEAR
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-sky-500 transition-colors cursor-pointer"
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr === "All" ? "All Years" : yr}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              OCEANIC BASIN
            </label>
            <select
              value={selectedBasin}
              onChange={(e) => setSelectedBasin(e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-sky-500 transition-colors cursor-pointer"
            >
              {basins.map((b) => (
                <option key={b} value={b}>
                  {b === "All" ? "All Basins" : b}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              PEAK CATEGORY (IMD)
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-sky-500 transition-colors cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              PRIMARY DATA SOURCE
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-sky-500 transition-colors cursor-pointer"
            >
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Data Sources" : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Historical Storms Registry Table */}
      <Card title="HISTORICAL STORMS REGISTRY" badge="TABULAR VIEW">
        {filteredCyclones.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            No historical cyclone records match the selected query criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 uppercase border-b border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">STORM ID</th>
                  <th className="py-2.5 px-3">CYCLONE NAME</th>
                  <th className="py-2.5 px-3">YEAR</th>
                  <th className="py-2.5 px-3">BASIN</th>
                  <th className="py-2.5 px-3">IMD CATEGORY</th>
                  <th className="py-2.5 px-3">PEAK WIND</th>
                  <th className="py-2.5 px-3">MIN PRESSURE</th>
                  <th className="py-2.5 px-3">LANDFALL LOCATION</th>
                  <th className="py-2.5 px-3">SOURCE</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredCyclones.map((storm) => (
                  <tr
                    key={storm.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-200">
                      {storm.id}
                    </td>
                    <td className="py-2.5 px-3 font-extrabold text-slate-900 dark:text-white">
                      {storm.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                      {storm.year}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                      {storm.basin}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800/80">
                        {storm.categoryLabel || storm.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700 dark:text-emerald-400">
                      {storm.peakWindKmph} km/h
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-sky-700 dark:text-sky-400">
                      {storm.minPressureHpa} hPa
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                      {storm.landfallLocation}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      {storm.source}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleInspect(storm)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-sky-700 dark:bg-slate-800 dark:hover:bg-sky-600 text-white font-bold text-[10px] rounded transition shadow-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
