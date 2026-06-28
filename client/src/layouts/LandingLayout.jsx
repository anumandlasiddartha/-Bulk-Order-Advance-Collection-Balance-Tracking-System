/**
 * Cakes and Crunches — Landing Layout Component
 */

import { Outlet } from "react-router-dom";

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Outlet />
    </div>
  );
}
