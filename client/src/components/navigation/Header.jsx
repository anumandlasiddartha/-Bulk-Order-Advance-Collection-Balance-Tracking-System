/**
 * Cakes and Crunches — Header Component
 */

import { useContext } from "react";
import { RiMenu2Line, RiNotification3Line, RiUser3Line } from "react-icons/ri";
import { SidebarContext } from "../../context/SidebarContext";
import { NotificationContext } from "../../context/NotificationContext";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { toggleSidebar } = useContext(SidebarContext);
  const { unreadCount } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);

  return (
    <header className="h-16 border-b border-glass-border glass px-4 md:px-8 flex items-center justify-between z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-glass-hover rounded-md text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <RiMenu2Line className="w-5 h-5" />
        </button>
        <span className="font-display font-medium text-text-primary tracking-wide text-sm hidden sm:inline-block">
          Cakes & Crunches Operations
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/notifications"
          className="p-2 hover:bg-glass-hover rounded-md text-text-secondary hover:text-text-primary relative transition-colors"
        >
          <RiNotification3Line className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full pulse"></span>
          )}
        </Link>

        <Link
          to="/profile"
          className="flex items-center gap-2 p-1.5 hover:bg-glass-hover rounded-full transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <RiUser3Line className="w-4 h-4 text-primary-light" />
          </div>
          {user && (
            <span className="text-xs font-semibold text-text-secondary pr-2 hidden md:inline-block">
              {user.full_name}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
