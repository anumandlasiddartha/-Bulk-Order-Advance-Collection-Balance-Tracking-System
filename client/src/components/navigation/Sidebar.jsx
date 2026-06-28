/**
 * Cakes and Crunches — Sidebar Navigation Component
 */

import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  RiDashboardLine,
  RiFileList3Line,
  RiGroupLine,
  RiWalletLine,
  RiNotificationLine,
  RiSettings4Line,
  RiShieldUserLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import { SidebarContext } from "../../context/SidebarContext";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { isOpen } = useContext(SidebarContext);
  const { logout, user } = useContext(AuthContext);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: RiDashboardLine },
    { path: "/orders", label: "Orders", icon: RiFileList3Line },
    { path: "/customers", label: "Customers", icon: RiGroupLine },
    { path: "/wallet", label: "Wallet & Ledger", icon: RiWalletLine },
    { path: "/reminders", label: "Reminders", icon: RiNotificationLine },
  ];

  if (user?.role === "admin") {
    navItems.push({ path: "/admin", label: "Admin Panel", icon: RiShieldUserLine });
  }

  if (!isOpen) return null;

  return (
    <aside className="w-64 border-r border-glass-border glass flex flex-col z-30 transition-all duration-300">
      <div className="h-16 px-6 flex items-center border-b border-glass-border">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-wider gradient-text font-display">
            CAKES & CRUNCHES
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "gradient-primary text-white glow"
                  : "text-text-secondary hover:text-text-primary hover:bg-glass-hover"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-glass-border flex flex-col gap-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-glass-hover text-text-primary"
                : "text-text-secondary hover:text-text-primary hover:bg-glass-hover"
            }`
          }
        >
          <RiSettings4Line className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={logout}
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 hover:text-danger-light transition-all cursor-pointer text-left w-full"
        >
          <RiLogoutBoxRLine className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
