/**
 * Cakes and Crunches — Root Application Component
 *
 * Defines all application routes with lazy-loaded pages
 * and animated page transitions via Framer Motion.
 */

import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

/* Layouts */
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import LandingLayout from "./layouts/LandingLayout";

/* Shared */
import ProtectedRoute from "./components/shared/ProtectedRoute";
import LoadingSpinner from "./components/ui/LoadingSpinner";

/* Lazy-loaded pages */
const LandingPage = lazy(() => import("./pages/landing/LandingPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ChangePasswordPage = lazy(() => import("./pages/auth/ChangePasswordPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const OrdersPage = lazy(() => import("./pages/orders/OrdersPage"));
const BulkOrderEntry = lazy(() => import("./pages/orders/BulkOrderEntry"));
const OrderDetail = lazy(() => import("./pages/orders/OrderDetail"));
const CustomersPage = lazy(() => import("./pages/customers/CustomersPage"));
const CustomerDetail = lazy(() => import("./pages/customers/CustomerDetail"));
const PaymentsPage = lazy(() => import("./pages/payments/PaymentsPage"));
const AdvanceCollectionPage = lazy(() => import("./pages/payments/AdvanceCollectionPage"));
const BalanceDuePage = lazy(() => import("./pages/payments/BalanceDuePage"));
const WalletPage = lazy(() => import("./pages/wallet/WalletPage"));
const TransactionLedgerPage = lazy(() => import("./pages/wallet/TransactionLedgerPage"));
const ReminderCenterPage = lazy(() => import("./pages/alerts/ReminderCenterPage"));
const AnalyticsPage = lazy(() => import("./pages/reports/AnalyticsPage"));
const ReportsPage = lazy(() => import("./pages/reports/ReportsPage"));
const NotificationsPage = lazy(() => import("./pages/notifications/NotificationsPage"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const ActivityLogsPage = lazy(() => import("./pages/activity/ActivityLogsPage"));
const AdminPanelPage = lazy(() => import("./pages/admin/AdminPanelPage"));
const ManageUsersPage = lazy(() => import("./pages/admin/ManageUsersPage"));
const SystemLogsPage = lazy(() => import("./pages/admin/SystemLogsPage"));
const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogsPage"));

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes location={location} key={location.pathname}>
          {/* ── Public Routes ────────────────────────── */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* ── Auth Routes ──────────────────────────── */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* ── Protected Dashboard Routes ───────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Orders */}
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/new" element={<BulkOrderEntry />} />
              <Route path="/orders/:id" element={<OrderDetail />} />

              {/* Customers */}
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />

              {/* Payments */}
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/payments/advance" element={<AdvanceCollectionPage />} />
              <Route path="/payments/balance" element={<BalanceDuePage />} />

              {/* Wallet & Ledger */}
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/ledger" element={<TransactionLedgerPage />} />

              {/* Alerts & Reminders */}
              <Route path="/reminders" element={<ReminderCenterPage />} />

              {/* Analytics & Reports */}
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/reports" element={<ReportsPage />} />

              {/* Notifications */}
              <Route path="/notifications" element={<NotificationsPage />} />

              {/* Settings & Profile */}
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="/activity-logs" element={<ActivityLogsPage />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminPanelPage />} />
              <Route path="/admin/users" element={<ManageUsersPage />} />
              <Route path="/admin/system-logs" element={<SystemLogsPage />} />
              <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
