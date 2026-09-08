import axios from 'axios'

// Dynamically determine protocol-safe API base URL
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }
  return 'http://localhost:8000';
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 35000,
})

export default axiosInstance
