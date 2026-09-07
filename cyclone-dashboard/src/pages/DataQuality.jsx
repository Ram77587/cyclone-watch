// src/pages/DataQuality.jsx
import React, { useEffect, useState } from "react";
import Card from "../components/common/Card";
import { getDataQuality, runDataQualityAudit } from "../api/catalogApi";

export default function DataQuality() {
  const [report, setReport] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatusMessage, setScanStatusMessage] = useState(
    "Continuous schema and geo-sanity validation monitor active."
  );

  useEffect(() => { getDataQuality().then(setReport).catch(console.error); }, []);

  const handleRunAudit = async () => {
    setIsScanning(true);
    setScanStatusMessage("RUNNING PARALLEL INTEGRITY VALIDATION PIPELINE...");

    try {
      const auditedReport = await runDataQualityAudit();
      setReport(auditedReport);
      setScanStatusMessage("AUDIT COMPLETE: live database records validated.");
    } catch {
      setScanStatusMessage("AUDIT FAILED: backend is unavailable.");
    } finally {
      setIsScanning(false);
    }
  };

  if (!report) return <div className="p-6 font-mono text-sm text-slate-500">Loading data-quality audit…</div>;

  const handleExportAudit = () => {
    const dataStr = JSON.stringify(report, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cyclone_data_quality_audit_${Date.now()}.json`;
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
            DATA HYGIENE
          </span>
          <span>
            CONTINUOUS DATA INTEGRITY &amp; SPATIOTEMPORAL SANITY AUDIT
          </span>
        </div>
        <div className="text-slate-600 dark:text-slate-400 text-[10px]">
          [SIMULATION BENCHMARK] REAL-TIME TELEMETRY AUDIT OVER NOAA / MOSDAC PIPELINES
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4 shadow-station flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-150">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
            DATA INTEGRITY &amp; QUALITY ASSURANCE
          </h1>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">
            Automated schema enforcement, missing value imputation tracking, and cross-source reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportAudit}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold rounded border border-slate-300 dark:border-slate-700 transition cursor-pointer shadow-xs"
          >
            Export Audit (JSON)
          </button>
          <button
            type="button"
            disabled={isScanning}
            onClick={handleRunAudit}
            className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5 ${
              isScanning
                ? "bg-sky-400 text-white cursor-not-allowed"
                : "bg-sky-600 hover:bg-sky-500 text-white"
            }`}
          >
            {isScanning ? "Scanning..." : "Run Integrity Scan"}
          </button>
        </div>
      </div>

      {/* 6 High-Level Health KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station">
          <div className="text-[9px] font-bold text-slate-500 uppercase">AUDITED RECORDS</div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
            {report.summary.totalRecordsAudited.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500">1982–2026 Ingestion</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station">
          <div className="text-[9px] font-bold text-slate-500 uppercase">VALIDITY SCORE</div>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {report.summary.validityRate}%
          </div>
          <div className="text-[10px] text-slate-500">Passing Schema Criteria</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station">
          <div className="text-[9px] font-bold text-slate-500 uppercase">MISSING VALUES</div>
          <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
            {report.summary.missingValueCount}
          </div>
          <div className="text-[10px] text-slate-500">Imputation Required</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station">
          <div className="text-[9px] font-bold text-slate-500 uppercase">COORD ANOMALIES</div>
          <div className="text-lg font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
            {report.summary.invalidCoordCount}
          </div>
          <div className="text-[10px] text-slate-500">Out-of-Basin Offsets</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station">
          <div className="text-[9px] font-bold text-slate-500 uppercase">SOURCE CONFLICTS</div>
          <div className="text-lg font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">
            {report.summary.sourceConflictCount}
          </div>
          <div className="text-[10px] text-slate-500">IMD vs JTWC / IBTrACS</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded shadow-station">
          <div className="text-[9px] font-bold text-slate-500 uppercase">CORRUPT TENSORS</div>
          <div className="text-lg font-extrabold text-rose-700 dark:text-rose-500 mt-0.5">
            {report.summary.corruptFileCount}
          </div>
          <div className="text-[10px] text-slate-500">HDF5 / NetCDF Quarantined</div>
        </div>
      </div>

      {/* Row 1: Missing Fields & Coordinate Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Missing Value Audit */}
        <Card title="MISSING VALUE &amp; ATTRIBUTE GAPS" badge="SCHEMA AUDIT">
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2 px-2.5">Attribute Field</th>
                  <th className="py-2 px-2.5">Missing</th>
                  <th className="py-2 px-2.5">Impact</th>
                  <th className="py-2 px-2.5">Automated Remediation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {report.missingFields.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-2 px-2.5 font-bold text-slate-900 dark:text-white">
                      {row.field}
                      <div className="text-[10px] text-slate-500 font-normal">{row.affectedSources}</div>
                    </td>
                    <td className="py-2 px-2.5 font-bold text-amber-600 dark:text-amber-400">
                      {row.count}
                    </td>
                    <td className="py-2 px-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          row.impact === "High"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300"
                            : row.impact === "Moderate"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {row.impact}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-slate-600 dark:text-slate-400 text-[11px]">
                      {row.remediation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Coordinate Bounds & Spatial Sanity */}
        <Card title="SPATIAL SANITY &amp; BOUNDARY ANOMALIES" badge="GEO-FENCE">
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2 px-2.5">Storm / Fix</th>
                  <th className="py-2 px-2.5">Coordinate</th>
                  <th className="py-2 px-2.5">Detected Flaw</th>
                  <th className="py-2 px-2.5">Action Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {report.coordinateAnomalies.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-2 px-2.5 font-bold text-slate-900 dark:text-white">
                      {item.stormId}
                      <div className="text-[10px] text-slate-500 font-normal">{item.fixTime}</div>
                    </td>
                    <td className="py-2 px-2.5 text-slate-700 dark:text-slate-300">
                      {item.reportedCoord[0]}°N, {item.reportedCoord[1]}°E
                    </td>
                    <td className="py-2 px-2.5 text-rose-600 dark:text-rose-400 text-[11px]">
                      {item.issue}
                    </td>
                    <td className="py-2 px-2.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Row 2: Cross-Source Reconciliation Matrix */}
      <Card title="CROSS-SOURCE RECONCILIATION &amp; DISCREPANCY MATRIX" badge="RSMC VS IBTrACS / JTWC">
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Cyclone / Valid UTC</th>
                <th className="py-2.5 px-3">Primary Source (IMD RSMC)</th>
                <th className="py-2.5 px-3">Secondary Source (IBTrACS / Satellite)</th>
                <th className="py-2.5 px-3">Estimated Delta</th>
                <th className="py-2.5 px-3">Harmonization Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {report.sourceConflicts.map((conf, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {conf.stormName}
                    <div className="text-[10px] text-slate-500 font-normal">{conf.timestamp}</div>
                  </td>
                  <td className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-bold">
                    {conf.sourceA}
                  </td>
                  <td className="py-2.5 px-3 text-sky-700 dark:text-sky-400 font-bold">
                    {conf.sourceB}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-amber-600 dark:text-amber-400">
                    {conf.delta}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    {conf.resolution}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Operational Hygiene Console */}
      <Card title="DATA HYGIENE ENGINE STATUS" badge="STATION MONITOR">
        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 dark:text-slate-300">{scanStatusMessage}</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Last Full Integrity Scan: {report.summary.lastAuditTimestamp}
          </div>
        </div>
      </Card>
    </div>
  );
}
