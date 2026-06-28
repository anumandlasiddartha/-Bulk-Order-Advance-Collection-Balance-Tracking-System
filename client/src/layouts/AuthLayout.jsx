/**
 * Cakes and Crunches — Auth Layout Component
 */

import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-bg-primary bg-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-secondary/20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight gradient-text">
              Cakes & Crunches
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              Bulk Order Financial System
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
