// src/context/CycloneContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getActiveCyclone } from "../api/cycloneApi";
import { getAlerts } from "../api/alertsApi";
import { mockCycloneDetail, mockAlerts } from "../mockData";

const CycloneContext = createContext(null);

export function CycloneProvider({ children }) {
  const [activeCyclone, setActiveCyclone] = useState(mockCycloneDetail);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("cyclone_theme") || "light";
  });

  // Keep dark/light classes synced with the DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    localStorage.setItem("cyclone_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Sync with FastAPI backend if available
  useEffect(() => {
    let isMounted = true;

    async function syncBackend() {
      try {
        const [cycloneData, alertData] = await Promise.all([
          getActiveCyclone(),
          getAlerts(),
        ]);

        if (isMounted) {
          if (cycloneData) setActiveCyclone(cycloneData);
          if (alertData && alertData.length > 0) setAlerts(alertData);
          // Check if response was from live server
          setIsLiveBackend(cycloneData?.id && cycloneData?.status !== "HISTORICAL ARCHIVE");
          setError(null);
        }
      } catch (err) {
        console.warn("FastAPI backend offline, maintaining demo fallback:", err.message);
        if (isMounted) {
          setIsLiveBackend(false);
          setError(err.message);
        }
      }
    }

    syncBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshCycloneData = async () => {
    try {
      const [cycloneData, alertData] = await Promise.all([
        getActiveCyclone(),
        getAlerts(),
      ]);
      if (cycloneData) setActiveCyclone(cycloneData);
      if (alertData && alertData.length > 0) setAlerts(alertData);
      return cycloneData;
    } catch (err) {
      console.error("Failed to refresh cyclone data:", err);
      return activeCyclone || mockCycloneDetail;
    }
  };

  return (
    <CycloneContext.Provider
      value={{
        activeCyclone,
        setActiveCyclone,
        alerts,
        setAlerts,
        theme,
        toggleTheme,
        isLiveBackend,
        loading,
        error,
        refreshCycloneData,
      }}
    >
      {children}
    </CycloneContext.Provider>
  );
}

export function useCyclone() {
  const context = useContext(CycloneContext);
  if (!context) {
    throw new Error("useCyclone must be used within a CycloneProvider");
  }
  return context;
}
