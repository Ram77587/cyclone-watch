// src/pages/DataSources.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import { getDataSources } from "../api/catalogApi";
import MosdacConnectorCard from "../components/sources/MosdacConnectorCard";

export default function DataSources() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dataSources, setDataSources] = useState([]);
  const [specModalSource, setSpecModalSource] = useState(null);

  useEffect(() => {
    getDataSources().then(setDataSources).catch(console.error);
  }, []);

  const filteredSources = useMemo(() => {
    return dataSources.filter((src) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        src.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        src.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        src.organization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" ||
        (filterType === "online" && src.statusType === "online") ||
        (filterType === "standby" && src.statusType === "standby");

      return matchesSearch && matchesType;
    });
  }, [dataSources, searchTerm, filterType]);

  return (
    <div className="space-y-4 pb-12">
      {/* Simulation / Operational Notice Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 px-3.5 py-1.5 rounded text-[11px] font-mono text-amber-900 dark:text-amber-300 flex flex-wrap items-center justify-between gap-2 transition-colors duration-150">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold rounded text-[9px]">
            DATA REGISTRY
          </span>
          <span>
            MULTI-SOURCE METEOROLOGICAL REPOSITORY &amp; SATELLITE INGESTION ENDPOINTS
          </span>
        </div>
        <div className="text-slate-600 dark:text-slate-400 text-[10px]">
          [SIMULATION BENCHMARK] ENDPOINTS CONFIGURED FOR OPERATIONAL BACKEND BINDING
        </div>
      </div>

      {/* Main Technical Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-150">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
            METEOROLOGICAL DATA SOURCES
          </h1>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">
            Authoritative multi-source catalog standardizing geostationary radiometry, numerical best-tracks, and synoptic warnings.
          </p>
        </div>
        <div className="self-start sm:self-auto flex items-center gap-2">
          <span className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
            TOTAL ENDPOINTS: <span className="text-sky-600 dark:text-sky-400">{dataSources.length}</span>
          </span>
        </div>
      </div>

      {/* ISRO MOSDAC Telemetry Uplink Card */}
      <MosdacConnectorCard onSyncSuccess={() => getDataSources().then(setDataSources)} />

      {/* Filter & Search Matrix */}
      <Card title="PROVIDER INVENTORY FILTER" badge="REGISTRY QUERY">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              SEARCH PROVIDER / AGENCY / FORMAT
            </label>
            <input
              type="text"
              placeholder="e.g. NOAA, MOSDAC, HDF5, INSAT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              INGESTION STATUS
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-sky-500 transition-colors cursor-pointer"
            >
              <option value="all">All Configured Sources</option>
              <option value="online">Active Ingestion / Ground Truth</option>
              <option value="standby">Standby / Supplementary</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Grid of Data Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((src) => (
          <div
            key={src.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm p-4 flex flex-col justify-between transition-colors duration-150 font-mono"
          >
            <div>
              {/* Card Top Title & Status Badge */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {src.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    src.statusType === "online"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800"
                  }`}
                >
                  {src.status}
                </span>
              </div>

              <div className="text-[11px] font-bold text-sky-700 dark:text-sky-400 mb-1">
                {src.fullName}
              </div>

              <div className="text-[10px] text-slate-500 mb-2">
                ORGANIZATION: <strong className="text-slate-800 dark:text-slate-200">{src.organization}</strong>
              </div>

              <p className="text-xs font-sans text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {src.description}
              </p>

              {/* Technical Specifications Matrix */}
              <div className="bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-[10px] space-y-1 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">FORMAT:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{src.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">COVERAGE:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{src.basinCoverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CADENCE:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{src.temporalResolution}</span>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>VOLUME: <strong className="text-slate-900 dark:text-slate-200">{src.records}</strong></span>
                <span>SYNC: <strong className="text-slate-900 dark:text-slate-200">{src.lastSync}</strong></span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSpecModalSource(src)}
                  className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded border border-slate-300 dark:border-slate-700 transition cursor-pointer"
                >
                  Inspect Spec
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/data-collection")}
                  className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded transition shadow-sm cursor-pointer text-center"
                >
                  Collect Data →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Datasheet Specifications Modal */}
      {specModalSource && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl max-w-lg w-full p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {specModalSource.fullName} ({specModalSource.name})
                </h3>
                <div className="text-[10px] text-slate-500">
                  {specModalSource.organization} • {specModalSource.basinCoverage}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSpecModalSource(null)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Data Format:</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{specModalSource.format}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Temporal Resolution:</span>
                <span className="font-bold">{specModalSource.temporalResolution}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Records Ingested:</span>
                <span className="font-bold">{specModalSource.records}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Citation:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{specModalSource.citation}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded font-sans text-xs text-slate-600 dark:text-slate-400">
              {specModalSource.description}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSpecModalSource(null);
                  navigate("/data-collection");
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded font-mono font-bold text-xs shadow-sm cursor-pointer"
              >
                Open in Data Collection →
              </button>
              <button
                type="button"
                onClick={() => setSpecModalSource(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded font-mono font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
