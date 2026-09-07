// src/components/map/StormMarker.jsx
import React from "react";
import { CircleMarker, Tooltip } from "react-leaflet";
import { resolveLatLng } from "./CycloneMap";

export default function StormMarker({ position, category = "VSCS", name = "CYCLONE" }) {
  const resolved = resolveLatLng(position);
  if (!resolved) return null;

  return (
    <>
      {/* Outer Pulse / Pressure Ring Motif */}
      <CircleMarker
        center={resolved}
        radius={22}
        pathOptions={{
          color: "#ea580c",
          weight: 1.2,
          fillColor: "#ea580c",
          fillOpacity: 0.12,
          dashArray: "3, 3",
        }}
      />

      {/* Inner Vortex Center Marker */}
      <CircleMarker
        center={resolved}
        radius={7}
        pathOptions={{
          color: "#ffffff",
          weight: 2,
          fillColor: "#ea580c",
          fillOpacity: 1,
        }}
      >
        <Tooltip direction="top" offset={[0, -8]} permanent>
          <span className="font-mono text-[10px] font-bold tracking-tight">
            {name} ({category})
          </span>
        </Tooltip>
      </CircleMarker>
    </>
  );
}