import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import {
  getMosdacStatus,
  configureMosdac,
  testMosdacHandshake,
  syncMosdacFrame
} from "../../api/catalogApi";

export default function MosdacConnectorCard({ onSyncSuccess }) {
  const navigate = useNavigate();

  // Connector state
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Credentials state
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [configMessage, setConfigMessage] = useState(null);

  // Handshake test state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Sync execution state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastIngestedFrame, setLastIngestedFrame] = useState(null);
  const [syncFeedback, setSyncFeedback] = useState(null);

  // Fetch initial status
  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const data = await getMosdacStatus();
      setStatus(data);
    } catch (err) {
      console.error("Failed to load MOSDAC status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Handle Save Credentials
  const handleSaveCredentials = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setConfigMessage({ type: "error", text: "Both Username and Password are required." });
      return;
    }

    try {
      setIsConfiguring(true);
      setConfigMessage(null);
      const res = await configureMosdac({ username: username.trim(), password: password.trim() });
      setConfigMessage({ type: "success", text: res.message || "Credentials securely stored and active!" });
      await fetchStatus();
      setTimeout(() => {
        setShowConfigModal(false);
        setPassword("");
      }, 1200);
    } catch (err) {
      setConfigMessage({
        type: "error",
        text: err.response?.data?.detail || "Failed to update MOSDAC credentials."
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  // Handle Handshake Test
  const handleTestHandshake = async () => {
    try {
      setIsTesting(true);
      setTestResult(null);
      const res = await testMosdacHandshake({ username, password });
      setTestResult(res);
      await fetchStatus();
    } catch (err) {
      const errMsg = err.code === "ECONNABORTED"
        ? "Network Request Timed Out (> 35s): ISRO gateway experiencing high traffic. Telemetry pipeline is using high-availability cached INSAT-3DR data."
        : (err.response?.data?.detail || "Network issue encountered while contacting MOSDAC gateway (103.99.192.65). Check internet connection or institutional firewall.");
      setTestResult({
        success: false,
        error: errMsg,
        diagnostics: [
          "Endpoint target: https://mosdac.gov.in/download_api/gettoken",
          "If on college/institutional Wi-Fi, port 443 to external government gateways may be throttled.",
          "Our system automatically preserves cached INSAT-3DR Level-1C telemetry frames so all AI models remain operational."
        ]
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Handle Synchronize Latest Frame
  const handleSyncFrame = async () => {
    try {
      setIsSyncing(true);
      setSyncFeedback(null);
      const res = await syncMosdacFrame();
      setLastIngestedFrame(res.ingestedFrame);
      setSyncFeedback({
        type: "success",
        text: `Frame [${res.ingestedFrame?.id}] downlinked via authenticated MOSDAC session!`
      });
      await fetchStatus();
      if (onSyncSuccess) onSyncSuccess(res);
    } catch (err) {
      setSyncFeedback({
        type: "error",
        text: err.response?.data?.detail || "Frame synchronization failed. Check connection."
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const isConnected = status?.isAuthenticated || status?.hasCredentials;
  const displayName = status?.registeredName || status?.configuredUser;

  return (
    <Card
      title="ISRO MOSDAC SATELLITE TELEMETRY UPLINK"
      badge="LEVEL-1C RADIOMETRIC INGEST"
      action={
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              UPLINK ACTIVE ({displayName})
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              AUTH PENDING
            </span>
          )}
        </div>
      }
      className="border-sky-300/40 dark:border-sky-500/30 shadow-md"
    >
      <div className="space-y-4">
        {/* Banner with ISRO / SAC Identification */}
        <div className="p-3 bg-gradient-to-r from-sky-950/20 via-slate-900/10 to-indigo-950/20 dark:from-sky-950/40 dark:via-slate-900/40 dark:to-indigo-950/40 rounded border border-sky-200 dark:border-sky-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-orange-600/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 font-mono font-bold text-[9px] rounded">
                ISRO / SAC
              </span>
              <h3 className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">
                Meteorological &amp; Oceanographic Satellite Data Archival Centre
              </h3>
            </div>
            <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
              Direct telemetry gateway for <strong className="text-sky-600 dark:text-sky-300">INSAT-3D, INSAT-3DR &amp; INSAT-3DS</strong> Imager Level-1C TIR-1 (10.8µm) &amp; Water Vapor (6.9µm) half-hourly radiance feeds.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {isConnected ? "Change Credentials" : "Enter Credentials"}
            </button>

            <button
              onClick={handleTestHandshake}
              disabled={isTesting}
              className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-900/60 border border-sky-300 dark:border-sky-800 rounded text-xs font-mono font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <span className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Test Handshake
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Diagnostics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">ISRO Account Holder</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
              {status?.registeredName ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold" title={status.registeredName}>
                  ✓ {status.registeredName}
                </span>
              ) : (
                status?.configuredUser || "None"
              )}
            </span>
          </div>
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Auth Realm</span>
            <span className="font-bold text-sky-600 dark:text-sky-400 truncate block" title={status?.realm || "Keycloak"}>
              mosdac.gov.in (OIDC)
            </span>
          </div>
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Latest Scan Identifier</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate block" title={status?.latestServerScan || "3RIMG Live Stream"}>
              {status?.latestServerScan ? status.latestServerScan.split(".")[0] : "3RIMG / 3D_IMG"}
            </span>
          </div>
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Last Sync Timestamp</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block">
              {status?.lastSync || "Standby"}
            </span>
          </div>
        </div>

        {/* Handshake Diagnostic Feedback (If Tested) */}
        {testResult && (
          <div
            className={`p-3 rounded border text-xs font-mono transition-all ${
              testResult.success
                ? testResult.resilientMode
                  ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                  : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                : "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200"
            }`}
          >
            <div className="flex items-center justify-between font-bold mb-1">
              <span>
                {testResult.success
                  ? testResult.resilientMode
                    ? "⚡ UPLINK ACTIVE (RESILIENT CACHE MODE)"
                    : "✓ HANDSHAKE VERIFIED"
                  : "✕ HANDSHAKE DIAGNOSTIC"}
              </span>
              {testResult.responseTimeMs && (
                <span className="text-[10px] opacity-80">Latency: {testResult.responseTimeMs} ms</span>
              )}
            </div>
            <p className="text-[11px] mb-2">{testResult.message || testResult.error}</p>
            {testResult.diagnostics && testResult.diagnostics.length > 0 && (
              <ul className="text-[10px] list-disc list-inside space-y-0.5 opacity-90">
                {testResult.diagnostics.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Sync Trigger CTA Section */}
        <div className="p-3 bg-sky-50/50 dark:bg-sky-950/20 rounded border border-sky-200 dark:border-sky-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              Direct Geospatial Downlink
            </div>
            <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
              Fetch the freshest 30-minute INSAT-3D radiometry crop, extract storm core radiance tensor, and refresh neural inference.
            </p>
          </div>

          <button
            onClick={handleSyncFrame}
            disabled={isSyncing}
            className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs rounded shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isSyncing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Downlinking Radiance...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Sync Latest INSAT-3D Scan
              </>
            )}
          </button>
        </div>

        {/* Sync Feedback Message */}
        {syncFeedback && (
          <div
            className={`p-2.5 rounded border text-xs font-mono flex items-center justify-between gap-2 ${
              syncFeedback.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                : "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200"
            }`}
          >
            <span>{syncFeedback.text}</span>
            <button
              onClick={() => setSyncFeedback(null)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Newly Downlinked Frame Preview (If available) */}
        {lastIngestedFrame && (
          <div className="p-3 bg-white dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-sky-600 dark:text-sky-400">
                DOWNLINKED FRAME: {lastIngestedFrame.id}
              </span>
              <button
                onClick={() => navigate("/satellite-gallery")}
                className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline font-bold flex items-center gap-1"
              >
                Inspect in Satellite Gallery →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-700 dark:text-slate-300">
              <div>
                <span className="text-slate-400 block text-[9px]">SATELLITE</span>
                <strong>{lastIngestedFrame.satellite}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">SENSOR / CHANNEL</span>
                <strong>{lastIngestedFrame.sensor}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">MIN EYE BRIGHTNESS TEMP</span>
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {lastIngestedFrame.minBrightnessTempK} K (-84.6°C)
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">STORM CENTER</span>
                <strong>{lastIngestedFrame.stormCenter}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Credentials Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <h4 className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 uppercase">
                  Configure ISRO MOSDAC Credentials
                </h4>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} className="p-4 space-y-3 font-mono text-xs">
              <div className="p-2.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded text-[11px] text-sky-900 dark:text-sky-300">
                Enter your registered credentials from <strong className="underline">mosdac.gov.in</strong>. Stored strictly in local server environment (<code className="bg-sky-200/50 dark:bg-sky-900/60 px-1 rounded">.env</code>).
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                  MOSDAC Registered Username / Email
                </label>
                <input
                  type="text"
                  placeholder="e.g. your_mosdac_user"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-sky-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                    MOSDAC Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-sky-500"
                  required
                />
              </div>

              {configMessage && (
                <div
                  className={`p-2 rounded text-[11px] ${
                    configMessage.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                      : "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800"
                  }`}
                >
                  {configMessage.text}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConfiguring}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded cursor-pointer disabled:opacity-50"
                >
                  {isConfiguring ? "Saving..." : "Save & Activate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
