// src/context/CycloneContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getActiveCyclone } from "../api/cycloneApi";
import { getAlerts } from "../api/alertsApi";

const CycloneContext = createContext(null);

export function CycloneProvider({ children }) {
  const [activeCyclone, setActiveCyclone] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [loading, setLoading] = useState(true);
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

  // Sync with FastAPI
  useEffect(() => {
    let isMounted = true;

    async function syncBackend() {
      try {
        setLoading(true);
        const [cycloneData, alertData] = await Promise.all([
          getActiveCyclone(),
          getAlerts(),
        ]);

        if (isMounted) {
          if (cycloneData) setActiveCyclone(cycloneData);
          if (alertData && alertData.length > 0) setAlerts(alertData);
          setIsLiveBackend(true);
          setError(null);
        }
      } catch (err) {
        console.warn("FastAPI backend offline, maintaining demo fallback:", err.message);
        if (isMounted) {
          setIsLiveBackend(false);
          setError(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
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
      return null;
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
