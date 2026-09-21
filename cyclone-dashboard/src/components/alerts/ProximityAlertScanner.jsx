import React, { useState, useEffect } from "react";
import { getProximityAlerts, getCoastalDistricts, checkLocationRisk } from "../../api/alertsApi";

export default function ProximityAlertScanner({ activeCyclone }) {
  const [districts, setDistricts] = useState([]);
  const [proximityData, setProximityData] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [assessedResult, setAssessedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [copiedSms, setCopiedSms] = useState(false);
  const [activeTab, setActiveTab] = useState("assessed"); // 'assessed' | 'all'

  // Load coastal districts catalog & proximity scan on mount or activeCyclone change
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        const [distList, proxData] = await Promise.all([
          getCoastalDistricts(),
          getProximityAlerts(activeCyclone?.id)
        ]);

        if (!isMounted) return;
        setDistricts(distList);
        setProximityData(proxData);

        // Pre-select the closest district by default
        if (proxData?.districts?.length > 0) {
          const closest = proxData.districts[0];
          setSelectedDistrictId(closest.id);
          setAssessedResult({
            locationLabel: `${closest.name}, ${closest.state} (${closest.coastalZone})`,
            coordinates: [closest.lat, closest.lng],
            distanceToEyeKm: closest.distanceToEyeKm,
            distanceToLandfallKm: closest.distanceToLandfallKm,
            etaHours: closest.etaHours,
            hazardTier: closest.hazardTier,
            hazardLabel: closest.hazardLabel,
            severity: closest.severity,
            colorHex: closest.colorHex,
            bgClass: closest.bgClass,
            windRisk: closest.windRisk,
            surgeRisk: closest.surgeRisk,
            directives: closest.directives,
            smsAlertBroadcast: closest.smsAlertBroadcast,
            emergencyPhone: closest.emergencyPhone
          });
        }
      } catch (err) {
        console.warn("Failed to load proximity data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [activeCyclone?.id]);

  // Handle dropdown selection change
  const handleSelectDistrict = (districtId) => {
    setSelectedDistrictId(districtId);
    const found = proximityData?.districts?.find((d) => d.id === districtId);
    if (found) {
      setAssessedResult({
        locationLabel: `${found.name}, ${found.state} (${found.coastalZone})`,
        coordinates: [found.lat, found.lng],
        distanceToEyeKm: found.distanceToEyeKm,
        distanceToLandfallKm: found.distanceToLandfallKm,
        etaHours: found.etaHours,
        hazardTier: found.hazardTier,
        hazardLabel: found.hazardLabel,
        severity: found.severity,
        colorHex: found.colorHex,
        bgClass: found.bgClass,
        windRisk: found.windRisk,
        surgeRisk: found.surgeRisk,
        directives: found.directives,
        smsAlertBroadcast: found.smsAlertBroadcast,
        emergencyPhone: found.emergencyPhone
      });
      setActiveTab("assessed");
    }
  };

  // Handle GPS location detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const res = await checkLocationRisk({
            lat,
            lng,
            locationName: "Current User Location (GPS)",
            cycloneId: activeCyclone?.id
          });
          setAssessedResult(res);
          setSelectedDistrictId("");
          setActiveTab("assessed");
        } catch (err) {
          console.error("GPS risk check failed:", err);
        } finally {
          setIsDetectingGps(false);
        }
      },
      (err) => {
        console.warn("Geolocation permission denied or timed out:", err);
        setIsDetectingGps(false);
        alert("Could not access GPS location. Please select your nearest coastal district from the list.");
      },
      { timeout: 8000 }
    );
  };

  const handleCopySms = () => {
    if (assessedResult?.smsAlertBroadcast) {
      navigator.clipboard.writeText(assessedResult.smsAlertBroadcast);
      setCopiedSms(true);
      setTimeout(() => setCopiedSms(false), 2500);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 font-mono shadow-sm transition-colors duration-150 space-y-3">
      {/* Component Title & Threat Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Coastal Proximity & Geofenced Early Warning
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Spatial radius threat evaluation for {proximityData?.totalDistrictsMonitored || 45} coastal districts
          </p>
        </div>

        {/* Hazard Zone Count Badges */}
        <div className="flex items-center gap-1.5 text-[9px] font-bold">
          <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-500 border border-rose-500/30">
            RED: {proximityData?.summary?.redZoneCount || 0}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
            ORANGE: {proximityData?.summary?.orangeZoneCount || 0}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-500 border border-yellow-500/30">
            YELLOW: {proximityData?.summary?.yellowZoneCount || 0}
          </span>
        </div>
      </div>

      {/* District / GPS Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="sm:col-span-2">
          <label className="block text-[9px] uppercase tracking-wider text-slate-500 mb-1">
            Check Coastal District Risk
          </label>
          <select
            value={selectedDistrictId}
            onChange={(e) => handleSelectDistrict(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="" disabled>— Select District / Coast —</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.state}) — {d.coastalZone}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetectingGps}
            className="w-full h-8 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded text-[10px] font-bold tracking-wide flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            {isDetectingGps ? (
              <>
                <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Detecting GPS...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Use My GPS Location
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs: Assessed Target vs All Endangered Districts */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-[10px]">
        <button
          type="button"
          onClick={() => setActiveTab("assessed")}
          className={`px-3 py-1.5 font-bold border-b-2 transition-colors ${
            activeTab === "assessed"
              ? "border-sky-500 text-sky-600 dark:text-sky-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          Selected Sector Threat Card
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 font-bold border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-sky-500 text-sky-600 dark:text-sky-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          }`}
        >
          High-Risk Districts List ({proximityData?.highRiskDistricts?.length || 0})
        </button>
      </div>

      {/* TAB 1: Selected Location Threat Card */}
      {activeTab === "assessed" && assessedResult && (
        <div className="space-y-2.5">
          {/* Main Risk Status Banner */}
          <div className={`p-3 rounded border ${assessedResult.bgClass}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  ASSESSED SECTOR
                </span>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {assessedResult.locationLabel}
                </div>
              </div>

              <div className="text-right">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase border inline-block"
                  style={{
                    backgroundColor: `${assessedResult.colorHex}22`,
                    borderColor: assessedResult.colorHex,
                    color: assessedResult.colorHex
                  }}
                >
                  {assessedResult.hazardTier} ZONE — {assessedResult.hazardLabel}
                </span>
              </div>
            </div>

            {/* Metric Grids */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5 text-[10px]">
              <div className="bg-black/10 dark:bg-black/30 p-1.5 rounded">
                <span className="text-slate-500 text-[9px]">DISTANCE TO EYE</span>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {assessedResult.distanceToEyeKm} km
                </div>
              </div>

              <div className="bg-black/10 dark:bg-black/30 p-1.5 rounded">
                <span className="text-slate-500 text-[9px]">ESTIMATED ARRIVAL</span>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  ~{assessedResult.etaHours} hrs
                </div>
              </div>

              <div className="bg-black/10 dark:bg-black/30 p-1.5 rounded">
                <span className="text-slate-500 text-[9px]">EXPECTED WIND</span>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {assessedResult.windRisk}
                </div>
              </div>

              <div className="bg-black/10 dark:bg-black/30 p-1.5 rounded">
                <span className="text-slate-500 text-[9px]">STORM SURGE</span>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {assessedResult.surgeRisk}
                </div>
              </div>
            </div>

            {/* Standard Operating Procedures Directives */}
            <div className="mt-2.5 pt-2 border-t border-black/10 dark:border-white/10">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Action Directives & Standard Operating Procedures (NDRF/SDMA):
              </span>
              <ul className="mt-1 space-y-1 text-[11px] text-slate-800 dark:text-slate-200 list-disc list-inside">
                {(Array.isArray(assessedResult.directives)
                  ? assessedResult.directives
                  : [assessedResult.directives]
                ).filter(Boolean).map((dir, idx) => (
                  <li key={idx} className="leading-tight">{dir}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 1-Click NDRF Emergency Broadcast Dispatcher */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                OFFICIAL EMERGENCY SMS ALERT DISPATCH (NDRF / SDMA)
              </span>
              <button
                type="button"
                onClick={handleCopySms}
                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-bold tracking-wider transition-colors flex items-center gap-1 shadow-sm"
              >
                {copiedSms ? (
                  <>✓ COPIED TO CLIPBOARD</>
                ) : (
                  <>📋 COPY BROADCAST SMS</>
                )}
              </button>
            </div>
            <pre className="text-[10px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 font-mono whitespace-pre-wrap">
              {assessedResult.smsAlertBroadcast}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: Ranked High-Risk Coastal Districts List */}
      {activeTab === "all" && (
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {proximityData?.highRiskDistricts?.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">
              No coastal districts currently within Red or Orange hazard perimeter.
            </p>
          ) : (
            proximityData?.highRiskDistricts?.map((d) => (
              <div
                key={d.id}
                onClick={() => handleSelectDistrict(d.id)}
                className="flex items-center justify-between p-2 rounded border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-400 bg-slate-50 dark:bg-slate-950/60 cursor-pointer transition-colors text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {d.name}, {d.state}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-1.5">
                    ({d.coastalZone})
                  </span>
                  <div className="text-[10px] text-slate-500">
                    {d.windRisk}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                    style={{
                      backgroundColor: `${d.colorHex}22`,
                      color: d.colorHex
                    }}
                  >
                    {d.distanceToEyeKm} km • {d.hazardTier}
                  </span>
                  <div className="text-[9px] text-slate-500 mt-0.5">
                    ETA: ~{d.etaHours}h
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
