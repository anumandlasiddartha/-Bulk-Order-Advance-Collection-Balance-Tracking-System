/**
 * Cakes and Crunches — Operational Analytics Page
 */

import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  // Cake Distribution Doughnut
  const cakeDistributionData = {
    labels: ["Wedding Cakes", "Birthday Cakes", "Cupcakes", "Custom Tiers", "Others"],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: ["#7C3AED", "#EC4899", "#F59E0B", "#3B82F6", "#10B981"],
        borderWidth: 1,
        borderColor: "rgba(15, 23, 42, 0.6)",
      },
    ],
  };

  // Payment Methods Bar Chart
  const paymentMethodsData = {
    labels: ["UPI Transfer", "NetBanking", "Credit Card", "Cash Deposits", "Cheque"],
    datasets: [
      {
        label: "Transactions Count",
        data: [42, 18, 25, 12, 4],
        backgroundColor: "rgba(124, 58, 237, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#94a3b8", font: { family: "Inter", weight: "500" } },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "rgba(148, 163, 184, 0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      y: { grid: { color: "rgba(148, 163, 184, 0.05)" }, ticks: { color: "#94a3b8" } },
      x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
    },
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">Analytics Panel</h1>
        <p className="text-text-secondary text-sm">Visual insights on bakery order distributions, payment preferences, and metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doughnut */}
        <div className="glass-card p-6 h-80 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-primary">Cake Type Distribution</h3>
          <div className="flex-1 min-h-0">
            <Doughnut data={cakeDistributionData} options={{ ...commonOptions, scales: {} }} />
          </div>
        </div>

        {/* Bar */}
        <div className="glass-card p-6 h-80 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-primary">Payment Preferences</h3>
          <div className="flex-1 min-h-0">
            <Bar data={paymentMethodsData} options={commonOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
