// src/components/map/TrackLine.jsx
import React from "react";
import { Polyline, CircleMarker, Tooltip, Polygon } from "react-leaflet";
import { resolveLatLng } from "./CycloneMap";

export default function TrackLine({ observedTrack = [], predictedTrack = [] }) {
  // Filter and sanitize observed coordinates
  const validObserved = observedTrack
    .map((pt) => ({ ...pt, coords: resolveLatLng(pt) }))
    .filter((pt) => pt.coords !== null);

  const observedPoints = validObserved.map((pt) => pt.coords);

  // Filter and sanitize predicted coordinates
  const validPredicted = predictedTrack
    .map((pt) => ({ ...pt, coords: resolveLatLng(pt) }))
    .filter((pt) => pt.coords !== null);

  const predictedPoints = validPredicted.map((pt) => pt.coords);

  const lastObservedPoint = observedPoints.length > 0 ? observedPoints[observedPoints.length - 1] : null;
  const connectedPredictedPoints =
    lastObservedPoint && predictedPoints.length > 0
      ? [lastObservedPoint, ...predictedPoints]
      : predictedPoints;

  return (
    <>
      {/* 1. Observed Solid Polyline */}
      {observedPoints.length > 1 && (
        <Polyline
          positions={observedPoints}
          pathOptions={{
            color: "#0f172a",
            weight: 3,
            opacity: 0.9,
          }}
        />
      )}

      {/* Observed Track Fix Points */}
      {validObserved.map((pt, idx) => (
        <CircleMarker
          key={`obs-${idx}`}
          center={pt.coords}
          radius={4}
          pathOptions={{
            fillColor: "#0284c7",
            color: "#ffffff",
            weight: 1.5,
            fillOpacity: 1,
          }}
        >
          <Tooltip direction="top" offset={[0, -5]}>
            <div className="font-mono text-xs">
              <div className="font-bold">{pt.time || "Observed Fix"}</div>
              <div>Wind: {pt.windKmph || pt.wind || 0} km/h</div>
              <div>Pressure: {pt.pressureHpa || pt.pressure || 0} hPa</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}

      {/* 2. Predicted Dashed Polyline (Connected seamlessly to last fix) */}
      {connectedPredictedPoints.length > 1 && (
        <Polyline
          positions={connectedPredictedPoints}
          pathOptions={{
            color: "#ea580c",
            weight: 2.5,
            dashArray: "5, 5",
            opacity: 0.9,
          }}
        />
      )}

      {/* Predicted Track Fix Points */}
      {validPredicted.map((pt, idx) => (
        <CircleMarker
          key={`pred-${idx}`}
          center={pt.coords}
          radius={4}
          pathOptions={{
            fillColor: "#ea580c",
            color: "#ffffff",
            weight: 1.5,
            fillOpacity: 1,
          }}
        >
          <Tooltip direction="top" offset={[0, -5]}>
            <div className="font-mono text-xs">
              <div className="font-bold text-amber-600">{pt.time || "Forecast Point"}</div>
              <div>Wind: {pt.windKmph || pt.wind || 0} km/h</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}