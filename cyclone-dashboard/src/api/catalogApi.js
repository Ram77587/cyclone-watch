import axiosInstance from "./axiosInstance";

export const getDataSources = async () => (await axiosInstance.get("/data-sources")).data;
export const getDatasetRecords = async () => (await axiosInstance.get("/dataset-records")).data;
export const getSatelliteFrames = async () => (await axiosInstance.get("/satellite-frames")).data;
export const getDataQuality = async () => (await axiosInstance.get("/data-quality")).data;
export const runDataQualityAudit = async () => (await axiosInstance.post("/data-quality/audit")).data;
export const syncDataSources = async () => (await axiosInstance.post("/data-sources/sync")).data;
export const ingestRecord = async (record) => (await axiosInstance.post("/dataset-records/ingest", record)).data;

export const getMosdacStatus = async () => (await axiosInstance.get("/mosdac/status")).data;
export const configureMosdac = async (creds) => (await axiosInstance.post("/mosdac/configure", creds)).data;
export const testMosdacHandshake = async (creds) => (await axiosInstance.post("/mosdac/test-handshake", creds || {})).data;
export const syncMosdacFrame = async (params) => (await axiosInstance.post("/mosdac/sync", params || {})).data;
