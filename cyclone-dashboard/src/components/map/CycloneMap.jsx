// src/components/map/CycloneMap.jsx
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import StormMarker from "./StormMarker";
import TrackLine from "./TrackLine";
import { useCyclone } from "../../context/CycloneContext";

// Defensive helper: guarantees valid [lat, lng] array
export const resolveLatLng = (pos) => {
  if (!pos) return null;
  if (Array.isArray(pos) && pos.length >= 2) {
    if (typeof pos[0] === "number" && typeof pos[1] === "number" && !isNaN(pos[0]) && !isNaN(pos[1])) {
      return [pos[0], pos[1]];
    }
  }
  const lat = pos.lat !== undefined ? pos.lat : pos.latitude;
  const lng = pos.lng !== undefined ? pos.lng : (pos.lon !== undefined ? pos.lon : pos.longitude);
  
  if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
    return [lat, lng];
  }
  return null;
};

export default function CycloneMap({ cyclone }) {
  const { theme } = useCyclone();
  const defaultFallback = [18.4, 67.2];
  const centerCoords = resolveLatLng(cyclone?.currentPosition) || defaultFallback;

  // 100% Free, keyless, watermark-free basemaps
  // Light: OpenStreetMap Standard
  // Dark: Stadia / Alidade Smooth Dark or CartoCDN fallback
  const lightTile = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const darkTile = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        key={`${theme}-${centerCoords[0]}-${centerCoords[1]}`}
        center={centerCoords}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full rounded"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={theme === "dark" ? darkTile : lightTile}
        />

        {cyclone?.observedTrack && (
          <TrackLine
            observedTrack={cyclone.observedTrack}
            predictedTrack={cyclone.predictedTrack}
          />
        )}

        {cyclone?.currentPosition && (
          <StormMarker
            position={centerCoords}
            category={cyclone.currentCategory}
            name={cyclone.name}
          />
        )}
      </MapContainer>
    </div>
  );
}