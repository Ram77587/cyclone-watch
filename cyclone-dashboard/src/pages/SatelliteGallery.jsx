// src/pages/SatelliteGallery.jsx
import React, { useState, useMemo, useEffect } from "react";
import Card from "../components/common/Card";
import { getSatelliteFrames } from "../api/catalogApi";

export default function SatelliteGallery() {
  const [selectedStorm, setSelectedStorm] = useState("All");
  const [selectedChannel, setSelectedChannel] = useState("All");
  const [selectedSat, setSelectedSat] = useState("All");
  const [inspectModalFrame, setInspectModalFrame] = useState(null);
  const [satelliteFrames, setSatelliteFrames] = useState([]);

  useEffect(() => {
    getSatelliteFrames().then(setSatelliteFrames).catch(console.error);
  }, []);

  // Derived filter option sets
  const storms = useMemo(() => {
    return ["All", ...Array.from(new Set(satelliteFrames.map((f) => f.cycloneName)))];
  }, [satelliteFrames]);

  const channels = useMemo(() => {
    return ["All", ...Array.from(new Set(satelliteFrames.map((f) => f.channelType)))];
  }, [satelliteFrames]);

  const satellites = useMemo(() => {
    return ["All", ...Array.from(new Set(satelliteFrames.map((f) => f.satellite)))];
  }, [satelliteFrames]);

  // Filter application
  const filteredFrames = useMemo(() => {
    return satelliteFrames.filter((f) => {
      const matchStorm = selectedStorm === "All" || f.cycloneName === selectedStorm;
      const matchChannel = selectedChannel === "All" || f.channelType === selectedChannel;
      const matchSat = selectedSat === "All" || f.satellite === selectedSat;
      return matchStorm && matchChannel && matchSat;
    });
  }, [satelliteFrames, selectedStorm, selectedChannel, selectedSat]);

  const handleDownloadTensor = (frame) => {
    if (!frame) return;
    const tensorPayload = {
      header: {
        magic: "NUMPY_TENSOR_MOCK_v1",
        shape: [512, 512, 1],
        dtype: "float32",
        fortran_order: false,
      },
      telemetry: {
        id: frame.id,
        cycloneName: frame.cycloneName,
        year: frame.year,
        timestamp: frame.timestamp,
        satellite: frame.satellite,
        sensor: frame.sensor,
        resolution: frame.resolution,
        centerCoord: frame.centerCoord,
        dvorakTNo: frame.dvorakTNo,
        minBrightnessTempK: frame.minBrightnessTempK,
        source: frame.source,
      },
      tensorNote: "Preprocessed 512x512 normalized brightness temperature matrix",
    };

    const blob = new Blob([JSON.stringify(tensorPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${frame.id}_tensor_metadata.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Simulation / Lineage Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 px-3.5 py-1.5 rounded text-[11px] font-mono text-amber-900 dark:text-amber-300 flex flex-wrap items-center justify-between gap-2 transition-colors duration-150">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold rounded text-[9px]">
            SPECTRAL GALLERY
          </span>
          <span>
            GEOSTATIONARY RADIOMETRY TENSOR FRAMES (INSAT-3DR / HURSAT-B1)
          </span>
        </div>
        <div className="text-slate-600 dark:text-slate-400 text-[10px]">
          [SIMULATION BENCHMARK] STANDARDIZED 512x512 TENSORS PREPARED FOR CNN / ViT FEATURE INFERENCE
        </div>
      </div>

      {/* Main Page Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4 shadow-station flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-150">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
            GEOSTATIONARY SATELLITE GALLERY
          </h1>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">
            Storm-centered multi-spectral infrared (10.8µm), water vapor, and visible radiometry frames for vortex identification.
          </p>
        </div>
        <div className="self-start sm:self-auto px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
          FRAMES LOADED: <span className="text-sky-600 dark:text-sky-400">{filteredFrames.length}</span> OF {satelliteFrames.length}
        </div>
      </div>

      {/* Filter Matrix Card */}
      <Card title="SPECTRAL &amp; ORBITAL FILTERS" badge="QUERY PIPELINE">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              CYCLONE SYSTEM
            </label>
            <select
              value={selectedStorm}
              onChange={(e) => setSelectedStorm(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-sky-500 transition-colors cursor-pointer"
            >
              {storms.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Tropical Systems" : `Cyclone ${s}`}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              CHANNEL SPECTRUM
            </label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-sky-500 transition-colors cursor-pointer"
            >
              {channels.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Channels (IR / WV / VIS)" : c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              SATELLITE ORBITER
            </label>
            <select
              value={selectedSat}
              onChange={(e) => setSelectedSat(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-sky-500 transition-colors cursor-pointer"
            >
              {satellites.map((sat) => (
                <option key={sat} value={sat}>
                  {sat === "All" ? "All Orbiters" : sat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Satellite Frame Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredFrames.map((frame) => {
          const isThermal = frame.channelType === "Thermal IR";
          const isWV = frame.channelType === "Water Vapor";

          return (
            <div
              key={frame.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-station overflow-hidden flex flex-col justify-between transition-colors duration-150 font-mono group"
            >
              {/* Synthetic Radiometry Simulation Canvas */}
              <div className="h-44 bg-slate-950 relative flex items-center justify-center overflow-hidden border-b border-slate-200 dark:border-slate-800">
                {/* Synthetic Isobaric / Vortex Radiometry Texture */}
                <div
                  className={`w-36 h-36 rounded-full blur-sm opacity-70 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center ${
                    isThermal
                      ? "bg-gradient-to-tr from-cyan-900 via-rose-600 to-amber-300"
                      : isWV
                      ? "bg-gradient-to-br from-indigo-900 via-sky-600 to-teal-200"
                      : "bg-gradient-to-r from-slate-700 to-slate-200"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/80 bg-slate-950/80 flex items-center justify-center">
                    <span className="text-[9px] text-white font-bold">EYE</span>
                  </div>
                </div>

                {/* Corner Channel Chips */}
                <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/75 text-white text-[9px] rounded backdrop-blur-sm">
                  {frame.satellite} • {frame.sensor.split(" ")[0]}
                </span>
                <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-sky-950/80 text-sky-300 border border-sky-700/60 text-[9px] font-bold rounded">
                  {frame.channelType}
                </span>

                <div className="absolute bottom-1.5 left-2 text-[9px] text-slate-300">
                  {frame.timestamp}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {frame.cycloneName}
                    </h2>
                    <span className="text-[10px] text-slate-500">{frame.year}</span>
                  </div>
                  <div className="text-[10px] text-sky-700 dark:text-sky-400 font-bold mt-0.5">
                    {frame.sensor}
                  </div>
                  <p className="text-[11px] font-sans text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {frame.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">CENTER FIX:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                      {frame.centerCoord[0]}°N, {frame.centerCoord[1]}°E
                    </span>
                  </div>
                  {frame.minBrightnessTempK && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">MIN TEMP (T_b):</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">
                        {frame.minBrightnessTempK} K ({(frame.minBrightnessTempK - 273.15).toFixed(1)}°C)
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">DVORAK ESTIMATE:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      {frame.dvorakTNo}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectModalFrame(frame)}
                  className="w-full mt-2 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded border border-slate-300 dark:border-slate-700 transition cursor-pointer"
                >
                  Inspect Tensor Meta →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frame Inspection Modal */}
      {inspectModalFrame && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl max-w-lg w-full p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  TENSOR FRAME: {inspectModalFrame.id}
                </h3>
                <div className="text-[10px] text-slate-500">
                  {inspectModalFrame.cycloneName} ({inspectModalFrame.year}) • {inspectModalFrame.timestamp}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectModalFrame(null)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Satellite Orbiter:</span>
                <span className="font-bold">{inspectModalFrame.satellite}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Sensor Channel:</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{inspectModalFrame.sensor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Spatial Resolution:</span>
                <span className="font-bold">{inspectModalFrame.resolution}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Tensor Dimensions:</span>
                <span className="font-bold">512 x 512 x 1 (Float32)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Vortex Center Fix:</span>
                <span className="font-bold">{inspectModalFrame.centerCoord[0]}°N, {inspectModalFrame.centerCoord[1]}°E</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Dvorak Intensity Ground Truth:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{inspectModalFrame.dvorakTNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Data Source Pipeline:</span>
                <span className="font-bold">{inspectModalFrame.source}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded font-sans text-xs text-slate-600 dark:text-slate-400">
              {inspectModalFrame.description}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleDownloadTensor(inspectModalFrame)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded font-mono font-bold text-xs shadow-sm cursor-pointer"
              >
                Download Tensor (.json)
              </button>
              <button
                type="button"
                onClick={() => setInspectModalFrame(null)}
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
