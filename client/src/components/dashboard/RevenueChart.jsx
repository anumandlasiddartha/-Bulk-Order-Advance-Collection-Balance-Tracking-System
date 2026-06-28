/**
 * Cakes and Crunches — Dashboard Revenue Chart
 *
 * Renders an animated area collection graph comparing Advance received
 * against Remaining Balance outstanding.
 */

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function RevenueChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        fill: true,
        label: "Advance Collected",
        data: [30000, 45000, 60000, 52000, 78000, 84000],
        borderColor: "#7C3AED",
        backgroundColor: "rgba(124, 58, 237, 0.15)",
        tension: 0.4,
        pointBackgroundColor: "#7C3AED",
      },
      {
        fill: true,
        label: "Balance Outstanding",
        data: [15000, 20000, 35000, 28000, 39000, 40500],
        borderColor: "#EC4899",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "#EC4899",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#94a3b8",
          font: { family: "Inter", weight: "500" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "rgba(148, 163, 184, 0.1)",
        borderWidth: 1,
        titleColor: "#f1f5f9",
        bodyColor: "#94a3b8",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        grid: { color: "rgba(148, 163, 184, 0.05)" },
        ticks: {
          color: "#94a3b8",
          callback: (value) => `₹${value.toLocaleString()}`,
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  return (
    <div className="glass-card p-6 h-96 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold text-text-primary">Collection Trends</h3>
        <p className="text-text-secondary text-xs mt-0.5">Advance collected versus remaining outstanding balances</p>
      </div>
      <div className="flex-1 min-h-0">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
