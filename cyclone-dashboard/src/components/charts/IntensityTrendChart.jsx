// src/components/charts/IntensityTrendChart.jsx
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useCyclone } from "../../context/CycloneContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function IntensityTrendChart({ history, observedTrack }) {
  const { theme } = useCyclone();
  const isDark = theme === "dark";

  // Support both prop naming conventions defensively
  const rawData = observedTrack || history || [];

  const { labels, windValues } = useMemo(() => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return { labels: [], windValues: [] };
    }

    const parsedLabels = rawData.map((pt, idx) => {
      if (pt.time) {
        const parts = pt.time.split(" ");
        return parts.length > 1 ? parts[1].replace("UTC", "z") : pt.time;
      }
      if (pt.timestamp) {
        const timePart = pt.timestamp.split("T")[1];
        return timePart ? timePart.substring(0, 5) + "z" : `T-${idx}`;
      }
      return `T+${idx * 6}h`;
    });

    const parsedWinds = rawData.map((pt) => {
      const val = pt.windKmph ?? pt.wind ?? pt.maxSustainedWindKmph ?? 0;
      return typeof val === "number" ? val : Number(val) || 0;
    });

    return { labels: parsedLabels, windValues: parsedWinds };
  }, [rawData]);

  if (labels.length === 0) {
    return (
      <div className="w-full h-full min-h-[160px] flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-800 rounded">
        AWAITING INTENSITY TELEMETRY FIXES
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Wind Speed (km/h)",
        data: windValues,
        borderColor: isDark ? "#38bdf8" : "#0284c7",
        backgroundColor: isDark ? "rgba(56, 189, 248, 0.14)" : "rgba(2, 132, 199, 0.08)",
        borderWidth: 2,
        fill: true,
        tension: 0.25,
        pointBackgroundColor: isDark ? "#38bdf8" : "#0284c7",
        pointBorderColor: isDark ? "#0f172a" : "#ffffff",
        pointBorderWidth: 1.5,
        pointRadius: 3.5,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
    },
    scales: {
      y: {
        min: 40,
        suggestedMax: 180,
        grid: {
          color: isDark ? "rgba(51, 65, 85, 0.4)" : "rgba(226, 232, 240, 0.8)",
          drawBorder: false,
        },
        ticks: {
          color: isDark ? "#94a3b8" : "#64748b",
          font: { family: "JetBrains Mono", size: 10 },
          callback: (value) => `${value} km/h`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? "#94a3b8" : "#64748b",
          font: { family: "JetBrains Mono", size: 10 },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
        borderColor: isDark ? "#334155" : "#cbd5e1",
        borderWidth: 1,
        titleColor: isDark ? "#f8fafc" : "#0f172a",
        bodyColor: isDark ? "#38bdf8" : "#0284c7",
        titleFont: { family: "JetBrains Mono", size: 11, weight: "bold" },
        bodyFont: { family: "JetBrains Mono", size: 11 },
        padding: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `Wind Velocity: ${context.parsed.y} km/h`,
        },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[160px] relative">
      <Line data={data} options={options} />
    </div>
  );
}