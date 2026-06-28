/**
 * Cakes and Crunches — Dashboard Page
 *
 * Mounts metrics widgets, 3D floating object assets, and revenue graphs.
 */

import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import RecentOrders from "../../components/dashboard/RecentOrders";
import FloatingCake from "../../components/three/FloatingCake";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero Welcome banner featuring 3D Floating Cake Model */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center glass-card p-6 md:p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="lg:col-span-2 flex flex-col gap-3 relative z-10">
          <span className="text-xs font-bold tracking-widest text-primary-light uppercase">
            Platform Operations
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary font-display">
            Welcome back, Chef Admin!
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-lg leading-relaxed">
            Monitor bulk advance deposits, track outstanding remaining balances, and resolve payment alerts using our unified financial dashboard.
          </p>
        </div>
        <div className="flex justify-center">
          <FloatingCake />
        </div>
      </div>

      {/* KPI Stats Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value="₹1,24,500"
          changeText="12.5% vs last week"
          isTrendUp={true}
          colorClass="text-primary-light"
        />
        <StatCard
          title="Advance Received"
          value="₹84,000"
          changeText="67.5% collection rate"
          isTrendUp={true}
          colorClass="text-secondary-light"
        />
        <StatCard
          title="Balance Due"
          value="₹40,500"
          changeText="5 invoices overdue"
          isTrendUp={false}
          colorClass="text-accent-light"
        />
      </div>

      {/* Graphs & Actionable panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
