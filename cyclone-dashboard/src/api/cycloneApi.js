// src/api/cycloneApi.js
import axiosInstance from "./axiosInstance";

export const getActiveCyclone = async () => {
  const response = await axiosInstance.get("/cyclones/active");
  return response.data;
};

export const getCyclone = async (id) => (await axiosInstance.get(`/cyclones/${id}`)).data;
export const getCyclones = async () => (await axiosInstance.get("/cyclones")).data;
export const triggerInference = async (id) => (await axiosInstance.post(`/cyclones/${id}/infer`)).data;
