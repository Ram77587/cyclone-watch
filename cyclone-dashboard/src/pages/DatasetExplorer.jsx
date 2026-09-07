// src/pages/DatasetExplorer.jsx
import React, { useState, useMemo, useEffect } from "react";
import Card from "../components/common/Card";
import { getDatasetRecords } from "../api/catalogApi";

export default function DatasetExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBasin, setSelectedBasin] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");
  const [datasetRecords, setDatasetRecords] = useState([]);

  useEffect(() => { getDatasetRecords().then(setDatasetRecords).catch(console.error); }, []);

  // Sorting
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  // Filter option sets
  const basins = useMemo(() => {
    return ["All", ...Array.from(new Set(datasetRecords.map((r) => r.basin)))];
  }, [datasetRecords]);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(datasetRecords.map((r) => r.category)))];
  }, [datasetRecords]);

  const sources = useMemo(() => {
    return ["All", ...Array.from(new Set(datasetRecords.map((r) => r.source)))];
  }, [datasetRecords]);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return datasetRecords.filter((rec) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        rec.stormName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.stormId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.source.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBasin = selectedBasin === "All" || rec.basin === selectedBasin;
      const matchesCategory = selectedCategory === "All" || rec.category === selectedCategory;
      const matchesSource = selectedSource === "All" || rec.source.includes(selectedSource);

      return matchesSearch && matchesBasin && matchesCategory && matchesSource;
    });
  }, [datasetRecords, searchTerm, selectedBasin, selectedCategory, selectedSource]);

  // Sorted dataset
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "windKmph" || sortField === "pressureHpa") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortField, sortDirection]);

  // Paginated window
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / rowsPerPage));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedRecords.slice(start, start + rowsPerPage);
  }, [sortedRecords, currentPage]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // CSV Export utility
  const handleExportCSV = () => {
    const headers = [
      "Storm ID",
      "Storm Name",
      "Valid Time (UTC)",
      "Latitude",
      "Longitude",
      "Max Wind (km/h)",
      "Central Pressure (hPa)",
      "Basin",
      "Category",
      "Source",
    ];

    const rows = sortedRecords.map((r) => [
      r.stormId,
      r.stormName,
      `"${r.timestamp}"`,
      r.lat,
      r.lng,
      r.windKmph,
      r.pressureHpa,
      `"${r.basin}"`,
      r.category,
      `"${r.source}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cyclone_unified_dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export utility
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(sortedRecords, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cyclone_unified_dataset_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Simulation / Operational Notice Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 px-3.5 py-1.5 rounded text-[11px] font-mono text-amber-900 dark:text-amber-300 flex flex-wrap items-center justify-between gap-2 transition-colors duration-150">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold rounded text-[9px]">
            SCHEMA REPOSITORY
          </span>
          <span>
            UNIFIED MULTI-SOURCE SYNOPTIC FIX REPOSITORY (NORMALIZED CSV/JSON)
          </span>
        </div>
        <div className="text-slate-600 dark:text-slate-400 text-[10px]">
          [SIMULATION BENCHMARK] EXPORT READY FOR REST API INTEGRATION
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4 shadow-station flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-150">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
            UNIFIED DATASET EXPLORER
          </h1>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">
            Normalized spatiotemporal fixes compiled across NOAA IBTrACS, RSMC New Delhi, and MOSDAC streams.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold rounded border border-slate-300 dark:border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>↓</span> Export CSV
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-bold rounded transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>↓</span> Export JSON
          </button>
        </div>
      </div>

      {/* Query Filter Matrix */}
      <Card title="DATASET QUERY &amp; EXTRACT CONTROLS" badge="STRUCTURED FILTER">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              SEARCH STORM / ID / SOURCE
            </label>
            <input
              type="text"
              placeholder="e.g. Amphan, BOB-05, IBTrACS..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              OCEANIC BASIN
            </label>
            <select
              value={selectedBasin}
              onChange={(e) => {
                setSelectedBasin(e.target.value);
                setCurrentPage(1);
              }}
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
              IMD CATEGORY
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
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
              DATA SOURCE
            </label>
            <select
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-sky-500 transition-colors cursor-pointer"
            >
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Sources" : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Dataset Records Table */}
      <Card
        title="SYNOPTIC OBSERVATION TENSOR LOGS"
        badge={`${sortedRecords.length} ENTRIES`}
      >
        {sortedRecords.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            No observation fixes match the selected query criteria.
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 uppercase border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">STORM ID</th>
                    <th className="py-2.5 px-3">STORM NAME</th>
                    <th
                      onClick={() => toggleSort("timestamp")}
                      className="py-2.5 px-3 cursor-pointer select-none hover:text-sky-600 dark:hover:text-sky-400"
                    >
                      VALID TIME (UTC) {sortField === "timestamp" ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}
                    </th>
                    <th className="py-2.5 px-3">LATITUDE</th>
                    <th className="py-2.5 px-3">LONGITUDE</th>
                    <th
                      onClick={() => toggleSort("windKmph")}
                      className="py-2.5 px-3 cursor-pointer select-none hover:text-sky-600 dark:hover:text-sky-400"
                    >
                      MAX WIND {sortField === "windKmph" ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}
                    </th>
                    <th
                      onClick={() => toggleSort("pressureHpa")}
                      className="py-2.5 px-3 cursor-pointer select-none hover:text-sky-600 dark:hover:text-sky-400"
                    >
                      PRESSURE {sortField === "pressureHpa" ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}
                    </th>
                    <th className="py-2.5 px-3">BASIN</th>
                    <th className="py-2.5 px-3">CATEGORY</th>
                    <th className="py-2.5 px-3">SOURCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {paginatedRecords.map((rec, idx) => (
                    <tr
                      key={`${rec.stormId}-${rec.timestamp}-${idx}`}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-200">
                        {rec.stormId}
                      </td>
                      <td className="py-2.5 px-3 font-extrabold text-slate-900 dark:text-white">
                        {rec.stormName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        {rec.timestamp}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                        {rec.lat}°N
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                        {rec.lng}°E
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700 dark:text-emerald-400">
                        {rec.windKmph} km/h
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-sky-700 dark:text-sky-400">
                        {rec.pressureHpa} hPa
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        {rec.basin}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800/80">
                          {rec.categoryLabel}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                        {rec.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <div className="text-slate-500">
                SHOWING{" "}
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {Math.min(sortedRecords.length, (currentPage - 1) * rowsPerPage + 1)}
                </span>{" "}
                TO{" "}
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {Math.min(sortedRecords.length, currentPage * rowsPerPage)}
                </span>{" "}
                OF{" "}
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {sortedRecords.length}
                </span>{" "}
                FIXES
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  ← PREV
                </button>
                <span className="px-3 py-1 font-bold text-slate-800 dark:text-slate-200">
                  PAGE {currentPage} OF {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  NEXT →
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
