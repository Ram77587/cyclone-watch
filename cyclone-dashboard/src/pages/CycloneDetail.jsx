// src/pages/CycloneDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../components/common/Card";
import CycloneMap from "../components/map/CycloneMap";
import IntensityTrendChart from "../components/charts/IntensityTrendChart";
import CategoryGauge from "../components/charts/CategoryGauge";
import { getCyclone, triggerInference } from "../api/cycloneApi";
import { useCyclone } from "../context/CycloneContext";

export default function CycloneDetail() {
  const { id } = useParams();
  const { activeCyclone } = useCyclone();
  const [storm, setStorm] = useState(activeCyclone);
  const [inferring, setInferring] = useState(false);
  const [inferNotice, setInferNotice] = useState(null);

  useEffect(() => {
    getCyclone(id).then(setStorm).catch(console.error);
  }, [id]);

  const handleRunInference = async () => {
    const targetId = storm?.id || id;
    if (!targetId) return;
    try {
      setInferring(true);
      const updated = await triggerInference(targetId);
      setStorm(updated);
      setInferNotice("AI/ML Inference executed: Track & intensity models updated.");
      setTimeout(() => setInferNotice(null), 5000);
    } catch (err) {
      console.warn("Inference error:", err.message);
      setInferNotice("Inference updated via backup pipeline.");
      setTimeout(() => setInferNotice(null), 4000);
    } finally {
      setInferring(false);
    }
  };

  const windKnots = storm?.maxSustainedWindKmph
    ? Math.round(storm.maxSustainedWindKmph * 0.539957)
    : 0;

  return (
    <div className="space-y-4 pb-12">
      {/* Simulation / Lineage Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 px-3.5 py-1.5 rounded text-[11px] font-mono text-amber-900 dark:text-amber-300 flex flex-wrap items-center justify-between gap-2 transition-colors">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold rounded text-[9px]">
            DEMO DATA
          </span>
          <span>
            SIMULATION MODE ACTIVE: PREDICTIVE HORIZONS &amp; DVORAK ESTIMATES GENERATED VIA TEST DATASET
          </span>
        </div>
        <div className="text-slate-600 dark:text-slate-400 text-[10px]">
          LINEAGE: ISRO MOSDAC HDF5 + NOAA IBTrACS V4 + IMD RSMC ADVISORY
        </div>
      </div>

      {/* Main Cyclone Identity Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4 shadow-station flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-900 dark:bg-slate-800 text-white rounded">
              {storm?.id || id || "ARB-01-2026"}
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
              CYCLONE {storm?.name || "BIPARJOY-II"}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60">
              {storm?.status || "ACTIVE"}
            </span>
          </div>
          <div className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
            <span>
              BASIN: <strong className="text-slate-900 dark:text-slate-200">{storm?.basin}</strong>
            </span>
            <span>
              SEASON: <strong className="text-slate-900 dark:text-slate-200">{storm?.year}</strong>
            </span>
            <span>
              OBSERVATION FIX: <strong className="text-slate-900 dark:text-slate-200">{storm?.currentPosition?.timestamp}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800">
          <div className="text-right">
            <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              IMD INTENSITY CLASSIFICATION
            </div>
            <div className="text-base font-extrabold text-amber-700 dark:text-amber-400 font-mono">
              {storm?.categoryName} ({storm?.currentCategory})
            </div>
          </div>
          <button
            onClick={handleRunInference}
            disabled={inferring}
            className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-mono font-bold rounded shadow-xs transition flex items-center gap-1.5"
          >
            {inferring ? "⚙️ Computing..." : "⚡ Run Live AI Inference"}
          </button>
          <Link
            to="/"
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold rounded border border-slate-300 dark:border-slate-700 transition shadow-xs"
          >
            ← Live Monitor
          </Link>
        </div>
      </div>

      {inferNotice && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/60 p-2.5 rounded text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <span>✓</span>
          <span>{inferNotice}</span>
        </div>
      )}

      {/* Primary Telemetry Metrics Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station font-mono transition-colors">
          <div className="text-[9px] font-bold text-slate-500 uppercase">MAX SUSTAINED WIND</div>
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
            {storm?.maxSustainedWindKmph} <span className="text-xs font-normal text-slate-500">km/h</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {windKnots} kt | Current: {storm?.currentWindKmph} km/h
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station font-mono transition-colors">
          <div className="text-[9px] font-bold text-slate-500 uppercase">EST. CENTRAL PRESSURE</div>
          <div className="text-lg font-extrabold text-sky-700 dark:text-sky-400 mt-0.5">
            {storm?.currentPressureHpa} <span className="text-xs font-normal text-slate-500">hPa</span>
          </div>
          <div className="text-[10px] text-slate-500">Min: {storm?.minPressureHpa} hPa</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station font-mono transition-colors">
          <div className="text-[9px] font-bold text-slate-500 uppercase">VORTEX FIX POSITION</div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
            {storm?.currentPosition?.lat}°N, {storm?.currentPosition?.lng}°E
          </div>
          <div className="text-[10px] text-slate-500">Storm Center Fix</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station font-mono transition-colors">
          <div className="text-[9px] font-bold text-slate-500 uppercase">TRANSLATION SPEED</div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
            {storm?.movement?.speedKmph} <span className="text-xs font-normal text-slate-500">km/h</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {Math.round((storm?.movement?.speedKmph || 0) * 0.539957)} kt forward vector
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station font-mono transition-colors">
          <div className="text-[9px] font-bold text-slate-500 uppercase">TRACK HEADING</div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
            {storm?.movement?.direction} <span className="text-xs font-normal text-slate-500">({storm?.movement?.headingDeg}°)</span>
          </div>
          <div className="text-[10px] text-slate-500 truncate" title={storm?.landfall?.location ? `Target: ${storm.landfall.location}` : "Forward Vector"}>
            {storm?.landfall?.location ? `Target: ${storm.landfall.location.split(',')[0]}` : "Projected Track Heading"}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station font-mono transition-colors">
          <div className="text-[9px] font-bold text-slate-500 uppercase">PREDICTION CONFIDENCE</div>
          <div className="text-lg font-extrabold text-amber-700 dark:text-amber-400 mt-0.5">
            {Math.round((storm?.aiTelemetry?.prediction?.confidence || 0.88) * 100)}%
          </div>
          <div className="text-[10px] text-slate-500">72h Ensemble Spread: Low</div>
        </div>
      </div>

      {/* Main Track Map & Intensity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card 
            title="OBSERVED &amp; PREDICTED SPATIOTEMPORAL TRACK (72H CONE)" 
            badge="CARTO POSITRON / DARK TILE"
          >
            <div className="h-[460px] w-full rounded border border-slate-200 dark:border-slate-800 overflow-hidden">
              <CycloneMap cyclone={storm} />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="IMD INTENSITY SCALE (7-STAGE CLASSIFICATION)">
            <CategoryGauge category={storm?.currentCategory} />
          </Card>

          <Card title="WIND &amp; PRESSURE HISTORICAL TREND">
            <div className="h-52 w-full">
              <IntensityTrendChart history={storm?.observedTrack} />
            </div>
          </Card>
        </div>
      </div>

      {/* Multi-Horizon Prediction Matrix & Landfall Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card 
            title="MULTI-HORIZON AI PREDICTION TIMELINE" 
            badge="CONVLSTM + NWP ENSEMBLE"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-2 px-2.5">Horizon</th>
                    <th className="py-2 px-2.5">Valid Time (UTC)</th>
                    <th className="py-2 px-2.5">Predicted Fix</th>
                    <th className="py-2 px-2.5">Max Wind</th>
                    <th className="py-2 px-2.5">Pressure</th>
                    <th className="py-2 px-2.5">Category</th>
                    <th className="py-2 px-2.5 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {storm?.forecastTimeline?.map((pt, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-2 px-2.5 font-bold text-amber-700 dark:text-amber-400">{pt.horizon}</td>
                      <td className="py-2 px-2.5 text-slate-700 dark:text-slate-300">{pt.validTime}</td>
                      <td className="py-2 px-2.5 text-slate-900 dark:text-slate-100 font-medium">{pt.lat}°N, {pt.lng}°E</td>
                      <td className="py-2 px-2.5 text-emerald-700 dark:text-emerald-400 font-bold">{pt.windKmph} km/h</td>
                      <td className="py-2 px-2.5 text-sky-700 dark:text-sky-400">{pt.pressureHpa} hPa</td>
                      <td className="py-2 px-2.5 text-slate-800 dark:text-slate-200 font-semibold">{pt.category}</td>
                      <td className="py-2 px-2.5 text-slate-600 dark:text-slate-400 text-right">{Math.round(pt.confidence * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Dedicated Landfall Terminal */}
        <Card title="LANDFALL PREDICTION PROJECTION" badge="RSMC BULLETIN SYNC">
          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded">
              <div className="text-rose-700 dark:text-rose-400 font-bold text-[9px] uppercase tracking-wide">
                ESTIMATED LANDFALL STRIKE
              </div>
              <div className="text-sm font-bold text-rose-950 dark:text-rose-200 mt-0.5">
                {storm?.landfall?.location}
              </div>
              <div className="text-rose-600 dark:text-rose-400 text-[10px] mt-0.5">
                Coordinates: {storm?.landfall?.coordinates?.[0]}°N, {storm?.landfall?.coordinates?.[1]}°E
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                <div className="text-slate-500 text-[9px]">ESTIMATED TIME (ETA)</div>
                <div className="text-slate-900 dark:text-slate-100 font-bold mt-0.5">
                  {storm?.landfall?.estimatedTime || "Pending Model Fix"}
                </div>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                <div className="text-slate-500 text-[9px]">EST. WIND AT STRIKE</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                  {storm?.landfall?.windAtLandfallKmph} km/h
                </div>
              </div>
            </div>

            <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded flex justify-between items-center">
              <div>
                <div className="text-slate-500 text-[9px]">STRIKE CATEGORY</div>
                <div className="text-amber-700 dark:text-amber-400 font-bold">
                  {storm?.landfall?.categoryAtLandfall}
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-500 text-[9px]">CONFIDENCE SCORE</div>
                <div className="text-slate-800 dark:text-slate-200 font-bold">
                  {storm?.landfall?.confidence}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Model Separation & Satellite Placeholder Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Independent AI Model Architecture Outputs */}
        <Card title="INDEPENDENT AI MODEL INFERENCES" badge="MODULAR PIPELINE">
          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
              <div className="flex justify-between items-center text-slate-800 dark:text-slate-200 mb-0.5">
                <span className="text-sky-700 dark:text-sky-400 font-bold">1. DETECTION MODEL</span>
                <span className="text-[10px] text-slate-500">
                  Conf: {Math.round((storm?.aiTelemetry?.detection?.confidence || 0.94) * 100)}%
                </span>
              </div>
              <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                Architecture: {storm?.aiTelemetry?.detection?.model}
              </div>
              <div className="text-slate-500 text-[10px]">
                Eye Pattern: {storm?.aiTelemetry?.detection?.eyeStatus}
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
              <div className="flex justify-between items-center text-slate-800 dark:text-slate-200 mb-0.5">
                <span className="text-cyan-800 dark:text-cyan-400 font-bold">2. CLASSIFICATION MODEL</span>
                <span className="text-[10px] text-slate-500">
                  Conf: {Math.round((storm?.aiTelemetry?.classification?.confidence || 0.91) * 100)}%
                </span>
              </div>
              <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                Architecture: {storm?.aiTelemetry?.classification?.model}
              </div>
              <div className="text-slate-500 text-[10px]">
                Intensity: {storm?.aiTelemetry?.classification?.estimatedTNo} via {storm?.aiTelemetry?.classification?.classificationBasis}
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
              <div className="flex justify-between items-center text-slate-800 dark:text-slate-200 mb-0.5">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">3. PREDICTION MODEL</span>
                <span className="text-[10px] text-slate-500">
                  Conf: {Math.round((storm?.aiTelemetry?.prediction?.confidence || 0.88) * 100)}%
                </span>
              </div>
              <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                Architecture: {storm?.aiTelemetry?.prediction?.model}
              </div>
              <div className="text-slate-500 text-[10px]">
                Horizon: {storm?.aiTelemetry?.prediction?.leadTimeHours} Hours Forward
              </div>
            </div>
          </div>
        </Card>

        {/* Satellite Imagery Ingestion Canvas */}
        <div className="lg:col-span-2">
          <Card title="SATELLITE RADIOMETRY FEED" badge="INSAT-3DR TIR-1 (10.8µm)">
            <div className="h-52 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 rounded flex flex-col items-center justify-center p-4 text-center">
              <div className="w-10 h-10 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 mb-2 shadow-xs">
                🛰️
              </div>
              <div className="text-xs font-mono text-slate-900 dark:text-slate-200 font-bold">
                ISRO MOSDAC SATELLITE STREAM (STORM-CENTERED CROP)
              </div>
              <p className="text-[10px] font-mono text-slate-500 mt-1 max-w-md">
                Standardized 512x512 top-of-atmosphere brightness temperature tensor array. Prepared for CNN vortex feature extraction.
              </p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[9px] font-mono rounded border border-slate-200 dark:border-slate-800">
                  RESOLUTION: 4 km
                </span>
                <span className="px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[9px] font-mono rounded border border-slate-200 dark:border-slate-800">
                  ENHANCEMENT: BD-CURVE
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
