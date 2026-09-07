// src/routes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/common/Loader";

// Direct import for main dashboard (critical landing path)
import Dashboard from "./pages/Dashboard";

// Route-level code splitting for secondary tabs
const CycloneDetail = lazy(() => import("./pages/CycloneDetail"));
const History = lazy(() => import("./pages/History"));
const DataSources = lazy(() => import("./pages/DataSources"));
const DataCollection = lazy(() => import("./pages/DataCollection"));
const DatasetExplorer = lazy(() => import("./pages/DatasetExplorer"));
const SatelliteGallery = lazy(() => import("./pages/SatelliteGallery"));
const DataQuality = lazy(() => import("./pages/DataQuality"));
const About = lazy(() => import("./pages/About"));

const PageFallback = () => (
  <div className="py-20 flex justify-center items-center font-mono text-xs text-slate-500">
    <Loader />
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cyclone/:id" element={<CycloneDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/data-sources" element={<DataSources />} />
        <Route path="/data-collection" element={<DataCollection />} />
        <Route path="/dataset-explorer" element={<DatasetExplorer />} />
        <Route path="/satellite-gallery" element={<SatelliteGallery />} />
        <Route path="/data-quality" element={<DataQuality />} />
        <Route path="/about" element={<About />} />
        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}