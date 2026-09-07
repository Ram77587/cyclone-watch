import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import { syncDataSources, syncMosdacFrame } from "../api/catalogApi";

const SOURCE_OPTIONS = [
  { id: "ibtracs", name: "NOAA IBTrACS v4", type: "Best Track Ground Truth", format: "NetCDF/CSV", estRecords: 12480 },
  { id: "hursat", name: "NOAA HURSAT-B1", type: "8km Calibrated Geostationary IR", format: "NetCDF4 Tensors", estRecords: 8920 },
  { id: "mosdac", name: "ISRO MOSDAC INSAT-3DR", type: "TIR-1 (10.8µm) & Water Vapor", format: "HDF5 Raw Feeds", estRecords: 15400 },
  { id: "rsmc", name: "IMD RSMC New Delhi", type: "Official Synoptic Bulletins", format: "Text/GeoJSON", estRecords: 3200 },
  { id: "typhoon", name: "Digital Typhoon (NII)", type: "Cross-Basin Benchmark Crops", format: "TAR/PNG Tensors", estRecords: 52000 },
  { id: "kaggle", name: "Curated Open Benchmarks", type: "Pre-Processed 512x512 Arrays", format: "NumPy / TFRecord", estRecords: 4200 },
];

const DATA_TYPES = [
  { id: "tracks", label: "Cyclone Track Coordinates [Lat, Lng]" },
  { id: "ir_imagery", label: "Thermal Infrared (TIR-1 / 10.8µm) Tensors" },
  { id: "wv_imagery", label: "Water Vapor Atmospheric Imagery" },
  { id: "pressure", label: "Central Pressure & Pressure Deficit Arrays" },
  { id: "wind", label: "Scatterometer Wind Vectors (ASCAT / Oceansat)" },
  { id: "landfall", label: "Historical Landfall Points & Strike Metadata" },
];

export default function DataCollection() {
  const navigate = useNavigate();

  // Selection state
  const [selectedSources, setSelectedSources] = useState(["ibtracs", "hursat", "mosdac", "rsmc"]);
  const [selectedBasin, setSelectedBasin] = useState("North Indian Ocean (NIO)");
  const [startYear, setStartYear] = useState(2013);
  const [endYear, setEndYear] = useState(2026);
  const [selectedTypes, setSelectedTypes] = useState(["tracks", "ir_imagery", "pressure", "wind"]);

  // Ingestion execution state
  const [isCollecting, setIsCollecting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [sourceProgress, setSourceProgress] = useState({});
  const [consoleLogs, setConsoleLogs] = useState([]);
  const logsEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleLogs]);

  // Handle source toggle
  const toggleSource = (id) => {
    if (isCollecting) return;
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Handle data type toggle
  const toggleType = (id) => {
    if (isCollecting) return;
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // Simulated ingestion workflow loop
  useEffect(() => {
    let interval = null;
    if (isCollecting) {
      interval = setInterval(() => {
        setOverallProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsCollecting(false);
            setIsComplete(true);
            setConsoleLogs((logs) => [
              ...logs,
              `[${new Date().toISOString().substring(11, 19)} UTC] INGESTION COMPLETE: All staged tensors verified against schema.`,
              `[${new Date().toISOString().substring(11, 19)} UTC] PIPELINE STATUS: Standardized NetCDF / HDF5 catalog ready for Dataset Explorer.`,
            ]);
            return 100;
          }

          const next = prev + 2;

          // Update individual source progress sequentially
          setSourceProgress((prevSources) => {
            const updated = { ...prevSources };
            selectedSources.forEach((srcId, index) => {
              const threshold = (index / selectedSources.length) * 100;
              if (next > threshold + 25) {
                updated[srcId] = { status: "Complete", percent: 100 };
              } else if (next > threshold) {
                const currentPct = Math.min(100, Math.round(((next - threshold) / 25) * 100));
                updated[srcId] = { status: "Normalizing Tensors...", percent: currentPct };
              } else {
                updated[srcId] = { status: "Waiting in Queue", percent: 0 };
              }
            });
            return updated;
          });

          // Append simulated synoptic logs at key milestones
          if (next === 10) {
            setConsoleLogs((l) => [...l, `[${new Date().toISOString().substring(11, 19)} UTC] AUTH: Connecting to NOAA NCEI IBTrACS archive endpoint...`]);
          } else if (next === 30) {
            setConsoleLogs((l) => [...l, `[${new Date().toISOString().substring(11, 19)} UTC] GEO: Filtering spatiotemporal fixes within [${selectedBasin}] domain...`]);
          } else if (next === 50) {
            setConsoleLogs((l) => [...l, `[${new Date().toISOString().substring(11, 19)} UTC] IMAGERY: Reading INSAT-3DR TIR-1 brightness temperatures (10.8µm)...`]);
          } else if (next === 75) {
            setConsoleLogs((l) => [...l, `[${new Date().toISOString().substring(11, 19)} UTC] NORMALIZATION: Aligning storm eye coordinates with Dvorak T-number ground truth...`]);
          } else if (next === 90) {
            setConsoleLogs((l) => [...l, `[${new Date().toISOString().substring(11, 19)} UTC] AUDIT: Validating latitude/longitude boundaries against coastlines...`]);
          }

          return next;
        });
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isCollecting, selectedSources, selectedBasin]);

  const handleStartCollection = () => {
    if (selectedSources.length === 0) {
      setValidationError("Select at least one meteorological data source.");
      return;
    }
    if (selectedTypes.length === 0) {
      setValidationError("Select at least one data type parameter.");
      return;
    }
    if (startYear > endYear) {
      setValidationError(`Start year (${startYear}) cannot be greater than end year (${endYear}).`);
      return;
    }

    setValidationError(null);
    setIsComplete(false);
    setOverallProgress(0);
    setConsoleLogs([
      `[${new Date().toISOString().substring(11, 19)} UTC] INITIALIZING DATA COLLECTION PIPELINE...`,
      `[${new Date().toISOString().substring(11, 19)} UTC] DOMAIN: ${selectedBasin} | TEMPORAL RANGE: ${startYear} - ${endYear}`,
      `[${new Date().toISOString().substring(11, 19)} UTC] TARGET SOURCES: ${selectedSources.join(", ").toUpperCase()}`,
    ]);

    const initialSourceProgress = {};
    selectedSources.forEach((id) => {
      initialSourceProgress[id] = { status: "Waiting in Queue", percent: 0 };
    });
    setSourceProgress(initialSourceProgress);
    setIsCollecting(true);

    // Call live backend data source synchronization
    syncDataSources().then((res) => {
      if (res?.details) {
        setConsoleLogs((l) => [
          ...l,
          `[${new Date().toISOString().substring(11, 19)} UTC] BACKEND SYNC CONFIRMED: ${res.details.ingestedStorms} historical benchmark storms & ${res.details.totalTrackPoints} track points synced to SQLite.`
        ]);
      }
    }).catch((err) => {
      console.warn("Backend sync notice:", err.message);
    });

    if (selectedSources.includes("mosdac")) {
      syncMosdacFrame().then((mRes) => {
        if (mRes?.ingestedFrame) {
          setConsoleLogs((l) => [
            ...l,
            `[${new Date().toISOString().substring(11, 19)} UTC] MOSDAC SATELLITE UPLINK: Ingested Level-1C ${mRes.ingestedFrame.satellite} TIR-1 frame [${mRes.ingestedFrame.id}] (Eyewall core temp: ${mRes.ingestedFrame.minBrightnessTempK}K).`
          ]);
        }
      }).catch((err) => {
        console.warn("MOSDAC sync notice:", err.message);
      });
    }
  };

  const handleReset = () => {
    setIsCollecting(false);
    setIsComplete(false);
    setOverallProgress(0);
    setSourceProgress({});
    setConsoleLogs([]);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Simulation / Lineage Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 px-3.5 py-1.5 rounded text-[11px] font-mono text-amber-900 dark:text-amber-300 flex flex-wrap items-center justify-between gap-2 transition-colors duration-150">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold rounded text-[9px]">
            INGESTION STAGING
          </span>
          <span>
            SYNOPTIC DATA INGESTION WORKFLOW CONSOLE — SIMULATED EXECUTION
          </span>
        </div>
        <div className="text-slate-600 dark:text-slate-400 text-[10px]">
          [SIMULATION BENCHMARK] REAL SCRAPING / API DOWNLOAD RUNS IN BACKEND SERVICE
        </div>
      </div>

      {/* Main Technical Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4 shadow-station flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-150">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
            DATA INGESTION CONSOLE
          </h1>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">
            Configure extraction parameters to collect, crop, and normalize multi-source tropical cyclone datasets.
          </p>
        </div>
        <div className="self-start sm:self-auto flex items-center gap-2">
          <span className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
            SELECTED SOURCES: <span className="text-sky-600 dark:text-sky-400">{selectedSources.length}</span> OF {SOURCE_OPTIONS.length}
          </span>
        </div>
      </div>

      {/* Configuration Grid: Sources, Basin, Time, Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1. Target Data Sources Checkboxes */}
        <div className="lg:col-span-2">
          <Card title="1. SELECT METEOROLOGICAL REPOSITORIES" badge="DATA PROVIDERS">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SOURCE_OPTIONS.map((src) => {
                const isSelected = selectedSources.includes(src.id);
                return (
                  <div
                    key={src.id}
                    onClick={() => toggleSource(src.id)}
                    className={`p-3 rounded border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800"
                        : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isCollecting}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-sky-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {src.name}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                        {src.format}
                      </span>
                    </div>
                    <div className="text-[11px] font-sans text-slate-600 dark:text-slate-400 ml-6">
                      {src.type}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 ml-6 mt-1">
                      Estimated Volume: ~{src.estRecords.toLocaleString()} entries
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* 2. Scope & Temporal Range Parameters */}
        <div className="space-y-4">
          <Card title="2. BASIN &amp; TEMPORAL WINDOW" badge="EXTENT">
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                  OCEANIC BASIN
                </label>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {[
                    "North Indian Ocean (NIO)",
                    "Bay of Bengal (BoB)",
                    "Arabian Sea (AS)",
                    "Global (All Basins)",
                  ].map((basin) => (
                    <button
                      key={basin}
                      type="button"
                      disabled={isCollecting}
                      onClick={() => setSelectedBasin(basin)}
                      className={`p-1.5 text-[10px] text-left rounded border transition cursor-pointer ${
                        selectedBasin === basin
                          ? "bg-slate-900 dark:bg-sky-600 text-white border-transparent font-bold"
                          : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {basin}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                  SEASON RANGE (YEARS)
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[9px] text-slate-500">START YEAR</span>
                    <input
                      type="number"
                      min={1982}
                      max={2026}
                      disabled={isCollecting}
                      value={startYear}
                      onChange={(e) => setStartYear(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500">END YEAR</span>
                    <input
                      type="number"
                      min={1982}
                      max={2026}
                      disabled={isCollecting}
                      value={endYear}
                      onChange={(e) => setEndYear(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Data Channels Checklist */}
          <Card title="3. DATA CHANNELS" badge="PARAMETERS">
            <div className="space-y-1.5 font-mono text-xs">
              {DATA_TYPES.map((dtype) => {
                const isChecked = selectedTypes.includes(dtype.id);
                return (
                  <label
                    key={dtype.id}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isCollecting}
                      onChange={() => toggleType(dtype.id)}
                      className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-700 dark:text-slate-300">
                      {dtype.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Validation Error Notice */}
      {validationError && (
        <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 p-2.5 rounded text-xs font-mono text-rose-800 dark:text-rose-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠ VALIDATION ERROR:</span>
            <span>{validationError}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Action Trigger Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded shadow-station flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors duration-150">
        <div className="text-xs font-mono text-slate-600 dark:text-slate-400 text-center sm:text-left">
          Status:{" "}
          <strong className="text-slate-900 dark:text-white">
            {isCollecting ? "EXTRACTION & NORMALIZATION IN PROGRESS..." : isComplete ? "READY TO EXPLORE" : "AWAITING EXTRACTION COMMAND"}
          </strong>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isCollecting || isComplete ? (
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold rounded border border-slate-300 dark:border-slate-700 transition cursor-pointer"
            >
              Reset Console
            </button>
          ) : null}

          {isComplete ? (
            <button
              type="button"
              onClick={() => navigate("/dataset-explorer")}
              className="flex-1 sm:flex-none px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              Dataset Explorer →
            </button>
          ) : (
            <button
              type="button"
              disabled={isCollecting}
              onClick={handleStartCollection}
              className={`flex-1 sm:flex-none px-6 py-2 rounded text-xs font-mono font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
                isCollecting
                  ? "bg-sky-400 text-white cursor-not-allowed"
                  : "bg-sky-600 hover:bg-sky-500 text-white"
              }`}
            >
              {isCollecting ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  COLLECTING INGESTION STREAM...
                </>
              ) : (
                "START DATA INGESTION"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Progress & Live Ingestion Status (Shown during/after run) */}
      {(isCollecting || isComplete) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Individual Source Pipeline Progress */}
          <div className="lg:col-span-2">
            <Card title="COLLECTION PIPELINE PROGRESS" badge={`${overallProgress}% OVERALL`}>
              <div className="space-y-4 font-mono text-xs">
                {/* Master Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                    <span>AGGREGATE INGESTION PIPELINE</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-sky-600 h-2.5 transition-all duration-200"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>

                {/* Per-Provider Status Grid */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800 pt-2">
                  {selectedSources.map((id) => {
                    const srcInfo = SOURCE_OPTIONS.find((s) => s.id === id);
                    const statusObj = sourceProgress[id] || { status: "Waiting", percent: 0 };
                    const isDone = statusObj.percent === 100;

                    return (
                      <div key={id} className="py-2.5 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white truncate">
                              {srcInfo?.name}
                            </span>
                            <span className="text-[10px] text-slate-500 hidden sm:inline">
                              ({srcInfo?.format})
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isDone
                                  ? "bg-emerald-500"
                                  : statusObj.percent > 0
                                  ? "bg-sky-500 animate-pulse"
                                  : "bg-slate-400"
                              }`}
                            />
                            {statusObj.status}
                          </div>
                        </div>

                        <div className="w-32 flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 transition-all duration-150 ${
                                isDone ? "bg-emerald-500" : "bg-sky-500"
                              }`}
                              style={{ width: `${statusObj.percent}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold w-7 text-right">
                            {statusObj.percent}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Real-Time Extraction Terminal / Synoptic Logs */}
          <Card title="SYNOPTIC EXTRACTION LOGS" badge="STDOUT STREAM">
            <div className="h-64 bg-slate-950 text-emerald-400 p-3 rounded font-mono text-[10px] overflow-y-auto space-y-1.5 leading-relaxed border border-slate-800">
              {consoleLogs.map((log, index) => (
                <div key={index} className="break-all">
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}