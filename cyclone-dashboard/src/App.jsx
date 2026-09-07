// src/App.jsx
import React from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AlertBanner from "./components/alerts/AlertBanner";
import AppRoutes from "./routes";
import { useCyclone } from "./context/CycloneContext";

export default function App() {
  const { alerts } = useCyclone();
  const highestAlert = alerts && alerts.length > 0 ? alerts[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150 font-sans">
      {highestAlert && <AlertBanner alert={highestAlert} />}
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}