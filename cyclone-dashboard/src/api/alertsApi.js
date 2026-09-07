// src/api/alertsApi.js
import axiosInstance from "./axiosInstance";

export const getAlerts = async () => {
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
};

export const getCoastalDistricts = async () => {
  const response = await axiosInstance.get("/coastal-districts");
  return response.data || [];
};

export const getProximityAlerts = async (cycloneId) => {
  const params = cycloneId ? { cyclone_id: cycloneId } : {};
  const response = await axiosInstance.get("/alerts/proximity", { params });
  return response.data || {};
};

export const checkLocationRisk = async ({ lat, lng, locationName, cycloneId }) => {
  const response = await axiosInstance.post("/alerts/check-location", {
    lat,
    lng,
    locationName,
    cycloneId,
  });
  return response.data || {};
};