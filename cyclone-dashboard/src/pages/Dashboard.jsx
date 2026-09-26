// src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/common/Card";
import CycloneMap from "../components/map/CycloneMap";
import IntensityTrendChart from "../components/charts/IntensityTrendChart";
import CategoryGauge from "../components/charts/CategoryGauge";
import AlertList from "../components/alerts/AlertList";
import ProximityAlertScanner from "../components/alerts/ProximityAlertScanner";
import LiveInferenceBar from "../components/inference/LiveInferenceBar";
import { useCyclone } from "../context/CycloneContext";

export default function Dashboard() {
  const { activeCyclone, alerts } = useCyclone();
  const storm = activeCyclone;

  const windKnots = storm?.maxSustainedWindKmph
    ? Math.round(storm.maxSustainedWindKmph * 0.539957)
    : 0;

  return (
    <div className="space-y-4 pb-12">
      {/* SIH Official Problem Statement Alignment Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-slate-50 to-indigo-50 dark:from-sky-950 dark:via-slate-900 dark:to-indigo-950 border border-sky-200/90 dark:border-sky-500/50 px-4 py-2 rounded text-[11px] font-mono text-sky-900 dark:text-sky-200 flex flex-wrap items-center justify-between gap-2 shadow-xs dark:shadow-md transition-colors duration-150">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-sky-600 dark:bg-sky-500 text-white dark:text-slate-950 font-bold rounded text-[10px] tracking-wide">
            SIH PROBLEM STATEMENT
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            AI/ML System for Identification, Classification &amp; Prediction of Tropical Cyclone Patterns using Multi-Source Satellite Data
          </span>
        </div>
        <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
          TRL 5 OPERATIONAL ENVIRONMENT (ISRO MOSDAC + NOAA IBTrACS)
        </div>
      </div>

      {/* Interactive Live Ingestion & AI Model Controller */}
      <LiveInferenceBar />

      {/* Main Meteorological Identity Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4 shadow-station flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-900 dark:bg-slate-800 text-white rounded">
              {storm?.id || "ARB-01-2026"}
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
              BASIN: <strong className="text-slate-900 dark:text-slate-200">{storm?.basin || "Arabian Sea"}</strong>
            </span>
            <span>
              SEASON: <strong className="text-slate-900 dark:text-slate-200">{storm?.year || 2026}</strong>
            </span>
            <span>
              LATEST FIX: <strong className="text-slate-900 dark:text-slate-200">{storm?.currentPosition?.timestamp || "18:00 UTC"}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 transition-colors duration-150">
            <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              IMD INTENSITY
            </div>
            <div className="text-sm font-bold text-amber-700 dark:text-amber-400 font-mono">
              {storm?.categoryName} ({storm?.currentCategory})
            </div>
          </div>
          <Link
            to={`/cyclone/${storm?.id || "ARB-01-2026"}`}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-bold rounded shadow-xs transition flex items-center gap-1.5"
          >
            Full Analysis →
          </Link>
        </div>
      </div>

      {/* 6-Metric Atmospheric Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station font-mono transition-colors duration-150">
          <div className="text-[9px] font-bold text-slate-500 uppercase">MAX SUSTAINED WIND</div>
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
            {storm?.maxSustainedWindKmph || 0}{" "}
            <span className="text-xs font-normal text-slate-500">km/h</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {windKnots} kt | Current: {storm?.currentWindKmph || 0} km/h
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station font-mono transition-colors duration-150">
          <div className="text-[9px] font-bold text-slate-500 uppercase">CENTRAL PRESSURE (EST.)</div>
          <div className="text-lg font-extrabold text-sky-700 dark:text-sky-400 mt-0.5">
            {storm?.currentPressureHpa || 968}{" "}
            <span className="text-xs font-normal text-slate-500">hPa</span>
          </div>
          <div className="text-[10px] text-slate-500">Min Recorded: {storm?.minPressureHpa || 962} hPa</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station font-mono transition-colors duration-150">
          <div className="text-[9px] font-bold text-slate-500 uppercase">EYE / VORTEX FIX</div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
            {storm?.currentPosition?.lat}°N, {storm?.currentPosition?.lng}°E
          </div>
          <div className="text-[10px] text-slate-500">Center Coordinate</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station font-mono transition-colors duration-150">
          <div className="text-[9px] font-bold text-slate-500 uppercase">TRANSLATION SPEED</div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
            {storm?.movement?.speedKmph || 0}{" "}
            <span className="text-xs font-normal text-slate-500">km/h</span>
          </div>
          <div className="text-[10px] text-slate-500">Forward translation rate</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station font-mono transition-colors duration-150">
          <div className="text-[9px] font-bold text-slate-500 uppercase">TRACK HEADING</div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
            {storm?.movement?.direction || "NNW"}{" "}
            <span className="text-xs font-normal text-slate-500">
              ({storm?.movement?.headingDeg || 335}°)
            </span>
          </div>
          <div className="text-[10px] text-slate-500">Forward Vector</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station font-mono transition-colors duration-150">
          <div className="text-[9px] font-bold text-slate-500 uppercase">AI FORECAST CONFIDENCE</div>
          <div className="text-lg font-extrabold text-amber-700 dark:text-amber-400 mt-0.5">
            {Math.round((storm?.aiTelemetry?.prediction?.confidence || 0.88) * 100)}%
          </div>
          <div className="text-[10px] text-slate-500">Lead Horizon: 72h</div>
        </div>
      </div>

      {/* Main Grid: Left 2 Cols (Map + Charts) / Right 1 Col (Alerts + Inferences) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Section: Map + Intensity Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title={`SPATIOTEMPORAL STORM TRACK & 72-HOUR UNCERTAINTY CONE — ${storm?.name || "BIPARJOY-II"}`}
            badge="FREE OPENSTREETMAP / CARTO DARK"
            action={
              <Link
                to={`/cyclone/${storm?.id || "ARB-01-2026"}`}
                className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Detailed Track View ↗
              </Link>
            }
          >
            <div className="h-[460px] w-full rounded border border-slate-200 dark:border-slate-800 overflow-hidden">
              <CycloneMap cyclone={storm} />
            </div>
          </Card>

          {/* Intensity Analysis Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card title="IMD INTENSITY SCALE (7-STAGE CLASSIFICATION)">
              <CategoryGauge category={storm?.currentCategory} />
            </Card>

            <Card title="WIND SPEED & PRESSURE TREND">
              <div className="h-44 w-full">
                <IntensityTrendChart
                  observedTrack={storm?.observedTrack}
                  history={storm?.observedTrack}
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Right Section: Active Advisories & Independent AI Model Status */}
        <div className="space-y-4">
          {/* Active Advisories Card */}
          <Card
            title="ACTIVE REGIONAL ADVISORIES"
            badge={`${alerts?.length || 0} ACTIVE`}
          >
            <AlertList alerts={alerts} />
          </Card>

          {/* Landfall Prediction Snapshot Card */}
          {storm?.landfall && (
            <Card title="PROJECTED LANDFALL STRIKE" badge="RSMC SYNC">
              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded transition-colors duration-150">
                  <div className="text-[9px] font-bold text-rose-700 dark:text-rose-400 uppercase">
                    ESTIMATED STRIKE ZONE
                  </div>
                  <div className="text-sm font-bold text-rose-950 dark:text-rose-100 mt-0.5">
                    {storm.landfall.location}
                  </div>
                  <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">
                    Coords: {storm.landfall.coordinates[0]}°N, {storm.landfall.coordinates[1]}°E
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded transition-colors duration-150">
                    <div className="text-slate-500 text-[9px]">ESTIMATED TIME</div>
                    <div className="text-slate-900 dark:text-slate-100 font-bold mt-0.5">
                      {storm.landfall.estimatedTime || "Pending Model Fix"}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded transition-colors duration-150">
                    <div className="text-slate-500 text-[9px]">WIND AT STRIKE</div>
                    <div className="text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                      {storm.landfall.windAtLandfallKmph} km/h
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Coastal Proximity & Geofenced Early Warning System */}
          <ProximityAlertScanner activeCyclone={storm} />

          {/* Modular AI Telemetry Pipelines (Distinct Backend Models) */}
          <Card title="MODULAR AI TELEMETRY PIPELINES" badge="SEPARATE MODELS">
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded transition-colors duration-150">
                <div className="flex justify-between items-center text-slate-800 dark:text-slate-200 mb-0.5">
                  <span className="text-sky-700 dark:text-sky-400 font-bold">1. DETECTION MODEL</span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Conf: {Math.round((storm?.aiTelemetry?.detection?.confidence || 0.94) * 100)}%
                  </span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                  Arch: {storm?.aiTelemetry?.detection?.model || "YOLOv8-IR"}
                </div>
                <div className="text-slate-500 text-[10px]">
                  Vortex Eye: {storm?.aiTelemetry?.detection?.eyeStatus || "Well Defined"}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded transition-colors duration-150">
                <div className="flex justify-between items-center text-slate-800 dark:text-slate-200 mb-0.5">
                  <span className="text-cyan-800 dark:text-cyan-400 font-bold">2. CLASSIFICATION MODEL</span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Conf: {Math.round((storm?.aiTelemetry?.classification?.confidence || 0.91) * 100)}%
                  </span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                  Arch: {storm?.aiTelemetry?.classification?.model || "Vision-Transformer-Dvorak"}
                </div>
                <div className="text-slate-500 text-[10px]">
                  Basis: {storm?.aiTelemetry?.classification?.classificationBasis || "INSAT-3DR TIR-1"}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded transition-colors duration-150">
                <div className="flex justify-between items-center text-slate-800 dark:text-slate-200 mb-0.5">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">3. PREDICTION MODEL</span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Conf: {Math.round((storm?.aiTelemetry?.prediction?.confidence || 0.88) * 100)}%
                  </span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                  Arch: {storm?.aiTelemetry?.prediction?.model || "ConvLSTM-NWP-Fusion"}
                </div>
                <div className="text-slate-500 text-[10px]">
                  Horizon: {storm?.aiTelemetry?.prediction?.leadTimeHours || 72}h Forward
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}