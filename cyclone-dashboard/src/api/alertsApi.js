// src/api/alertsApi.js
import axiosInstance from "./axiosInstance";
import { mockAlerts, mockCycloneDetail } from "../mockData";
import { COASTAL_DISTRICTS, calculateHaversineKm, classifyHazard } from "../utils/coastalDistricts";

export const getAlerts = async () => {
  try {
    const response = await axiosInstance.get("/alerts");
    return (response.data || []).map((alert) => ({
      id: alert.id,
      region: alert.region,
      message: alert.message,
      severity: alert.severity || "moderate",
      issuedAt: alert.issuedAt
        ? new Date(alert.issuedAt).toUTCString().replace("GMT", "UTC")
        : "Live Sync",
    }));
  } catch (err) {
    console.warn("FastAPI offline, using mock alerts catalog:", err.message);
    return (mockAlerts || []).map((alert) => ({
      id: alert.id,
      region: alert.region,
      message: alert.message,
      severity: alert.severity || "moderate",
      issuedAt: alert.issuedAt
        ? new Date(alert.issuedAt).toUTCString().replace("GMT", "UTC")
        : "Live Sync",
    }));
  }
};

export const getCoastalDistricts = async () => {
  try {
    const response = await axiosInstance.get("/coastal-districts");
    if (response.data && response.data.length > 0) {
      return response.data;
    }
    return COASTAL_DISTRICTS;
  } catch (err) {
    console.warn("FastAPI offline, returning local coastal districts reference dataset:", err.message);
    return COASTAL_DISTRICTS;
  }
};

export const getProximityAlerts = async (cycloneId) => {
  try {
    const params = cycloneId ? { cyclone_id: cycloneId } : {};
    const response = await axiosInstance.get("/alerts/proximity", { params });
    if (response.data && response.data.districts) {
      const data = response.data;
      if (!data.highRiskDistricts) {
        data.highRiskDistricts = data.districts.filter(
          (d) => d.hazardTier === "RED" || d.hazardTier === "ORANGE"
        );
      }
      return data;
    }
    throw new Error("Empty proximity response");
  } catch (err) {
    console.warn("FastAPI offline, executing client-side geospatial proximity scan:", err.message);
    const stormLat = mockCycloneDetail.currentPosition.lat;
    const stormLng = mockCycloneDetail.currentPosition.lng;
    const landfallLat = mockCycloneDetail.landfall.coordinates[0];
    const landfallLng = mockCycloneDetail.landfall.coordinates[1];
    const stormSpeed = mockCycloneDetail.movement.speedKmph || 15;

    const evaluatedDistricts = COASTAL_DISTRICTS.map((d) => {
      const distEye = calculateHaversineKm(stormLat, stormLng, d.lat, d.lng);
      const distLandfall = calculateHaversineKm(landfallLat, landfallLng, d.lat, d.lng);
      const etaHours = Math.max(1, Math.round(distEye / stormSpeed));
      const hazard = classifyHazard(distEye);

      return {
        id: d.id,
        name: d.name,
        state: d.state,
        coastalZone: d.coastalZone,
        basin: d.basin,
        lat: d.lat,
        lng: d.lng,
        emergencyPhone: d.emergencyPhone,
        distanceToEyeKm: distEye,
        distanceToLandfallKm: distLandfall,
        etaHours: etaHours,
        hazardTier: hazard.tier,
        hazardLabel: hazard.label,
        severity: hazard.severity,
        colorHex: hazard.colorHex,
        bgClass: hazard.bgClass,
        windRisk: hazard.windRisk,
        surgeRisk: hazard.surgeRisk,
        directives: hazard.directives,
        smsAlertBroadcast: hazard.smsBroadcast
      };
    });

    // Sort by distance to storm eye
    evaluatedDistricts.sort((a, b) => a.distanceToEyeKm - b.distanceToEyeKm);

    const highRiskDistricts = evaluatedDistricts.filter(
      (d) => d.hazardTier === "RED" || d.hazardTier === "ORANGE"
    );

    const redCount = evaluatedDistricts.filter((d) => d.hazardTier === "RED").length;
    const orangeCount = evaluatedDistricts.filter((d) => d.hazardTier === "ORANGE").length;
    const yellowCount = evaluatedDistricts.filter((d) => d.hazardTier === "YELLOW").length;
    const greenCount = evaluatedDistricts.filter((d) => d.hazardTier === "GREEN").length;

    return {
      totalDistricts: evaluatedDistricts.length,
      activeCycloneName: mockCycloneDetail.name,
      cycloneId: mockCycloneDetail.id,
      stormCoordinates: [stormLat, stormLng],
      landfallTarget: mockCycloneDetail.landfall.location,
      districts: evaluatedDistricts,
      highRiskDistricts: highRiskDistricts.length > 0 ? highRiskDistricts : evaluatedDistricts.slice(0, 5),
      stats: {
        redCount,
        orangeCount,
        yellowCount,
        greenCount
      }
    };
  }
};

export const checkLocationRisk = async ({ lat, lng, locationName, cycloneId }) => {
  try {
    const response = await axiosInstance.post("/alerts/check-location", {
      lat,
      lng,
      locationName,
      cycloneId,
    });
    return response.data || {};
  } catch (err) {
    console.warn("FastAPI offline, executing client-side location hazard assessment:", err.message);
    const stormLat = mockCycloneDetail.currentPosition.lat;
    const stormLng = mockCycloneDetail.currentPosition.lng;
    const landfallLat = mockCycloneDetail.landfall.coordinates[0];
    const landfallLng = mockCycloneDetail.landfall.coordinates[1];
    const stormSpeed = mockCycloneDetail.movement.speedKmph || 15;

    const distEye = calculateHaversineKm(stormLat, stormLng, lat, lng);
    const distLandfall = calculateHaversineKm(landfallLat, landfallLng, lat, lng);
    const etaHours = Math.max(1, Math.round(distEye / stormSpeed));
    const hazard = classifyHazard(distEye);

    return {
      locationLabel: locationName || `Coordinate [${lat.toFixed(3)}, ${lng.toFixed(3)}]`,
      coordinates: [lat, lng],
      distanceToEyeKm: distEye,
      distanceToLandfallKm: distLandfall,
      etaHours: etaHours,
      hazardTier: hazard.tier,
      hazardLabel: hazard.label,
      severity: hazard.severity,
      colorHex: hazard.colorHex,
      bgClass: hazard.bgClass,
      windRisk: hazard.windRisk,
      surgeRisk: hazard.surgeRisk,
      directives: hazard.directives,
      smsAlertBroadcast: hazard.smsBroadcast,
      emergencyPhone: "1077 / 112"
    };
  }
};