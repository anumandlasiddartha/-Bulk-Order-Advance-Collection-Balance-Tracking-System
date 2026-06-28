/**
 * Cakes and Crunches — Customer Profile & History Details
 */

import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RiUserLine, RiPhoneLine, RiMailLine, RiMapPinLine, RiWallet3Line, RiShoppingCartLine, RiMoneyDollarCircleLine, RiArrowLeftLine } from "react-icons/ri";

import apiClient from "../../api/client";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Fetch Customer Contact info
  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const res = await apiClient.get(`/customers/${id}`);
      return res.data;
    },
  });

  // 2. Fetch Wallet Credits
  const { data: wallet, isLoading: isWalletLoading } = useQuery({
    queryKey: ["wallet", id],
    queryFn: async () => {
      const res = await apiClient.get(`/wallet/customer/${id}`);
      return res.data;
    },
  });

  // 3. Fetch Orders
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await apiClient.get("/orders");
      return res.data;
    },
  });

  if (isCustomerLoading || isWalletLoading || isOrdersLoading) {
    return <LoadingSpinner />;
  }

  if (!customer) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <p className="text-text-secondary text-sm">Customer profile not found.</p>
        <button onClick={() => navigate("/customers")} className="btn-secondary">
          Back to Directory
        </button>
      </div>
    );
  }

  // Filter orders related to this customer
  const clientOrders = orders.filter((o) => o.customer_id === parseInt(id));

  // Compute metrics
  const totalSpend = clientOrders.reduce((sum, o) => sum + parseFloat(o.order_value), 0);
  const totalDues = clientOrders.reduce((sum, o) => sum + parseFloat(o.remaining_balance), 0);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Back Link */}
      <button
        onClick={() => navigate("/customers")}
        className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm self-start cursor-pointer transition-colors"
      >
        <RiArrowLeftLine className="w-4 h-4" /> Back to Directory
      </button>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-glass-border pb-4">
        <div className="flex items-center gap-4 text-left">
          <div className="p-4 bg-primary/10 rounded-full border border-primary/20 text-primary-light">
            <RiUserLine className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary">{customer.name}</h1>
            <p className="text-text-secondary text-sm">Client Account Profile • Registered {customer.created_at?.split("T")[0]}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Contact Info & Wallet */}
        <div className="flex flex-col gap-6">
          {/* Contact Cards */}
          <div className="glass-card p-6 flex flex-col gap-4 text-left">
            <h3 className="text-base font-bold text-text-primary border-b border-glass-border pb-2">
              Contact Reference
            </h3>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3 text-text-secondary">
                <RiPhoneLine className="w-5 h-5 text-primary-light shrink-0" />
                <span className="font-semibold">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <RiMailLine className="w-5 h-5 text-primary-light shrink-0" />
                <span className="truncate">{customer.email || "No email registered"}</span>
              </div>
              <div className="flex items-start gap-3 text-text-secondary">
                <RiMapPinLine className="w-5 h-5 text-primary-light shrink-0 mt-0.5" />
                <span className="leading-relaxed">{customer.address || "No address details logged"}</span>
              </div>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="glass-card p-6 flex flex-col gap-4 text-left justify-between bg-primary/5 border-primary/10">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <RiWallet3Line className="w-5 h-5 text-primary-light" /> Wallet Credits
              </h3>
              <p className="text-xs text-text-muted">Prepaid vouchers and balance refunds active.</p>
            </div>
            
            <div className="mt-4">
              <span className="text-3xl font-black text-text-primary">₹{wallet?.balance?.toLocaleString() || "0"}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-glass-border">
              <Link to="/wallet-ledger" className="text-xs text-primary-light hover:underline font-semibold">
                Adjust Wallet Balance ➔
              </Link>
            </div>
          </div>
        </div>

        {/* Right column: Orders summary metrics & table */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Summary metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-4 flex flex-col gap-1 text-left">
              <span className="text-xs text-text-secondary uppercase font-semibold flex items-center gap-1">
                <RiShoppingCartLine className="w-4 h-4 text-primary-light" /> Total Bookings
              </span>
              <span className="text-2xl font-black text-text-primary">{clientOrders.length} orders</span>
            </div>
            <div className="glass-card p-4 flex flex-col gap-1 text-left">
              <span className="text-xs text-text-secondary uppercase font-semibold flex items-center gap-1">
                <RiMoneyDollarCircleLine className="w-4 h-4 text-success" /> Cumulative Spend
              </span>
              <span className="text-2xl font-black text-success">₹{totalSpend.toLocaleString()}</span>
            </div>
            <div className="glass-card p-4 flex flex-col gap-1 text-left">
              <span className="text-xs text-text-secondary uppercase font-semibold flex items-center gap-1">
                <RiMoneyDollarCircleLine className="w-4 h-4 text-danger" /> Unpaid Outstanding
              </span>
              <span className="text-2xl font-black text-danger">₹{totalDues.toLocaleString()}</span>
            </div>
          </div>

          {/* Orders History registry */}
          <div className="glass-card p-6 flex flex-col gap-4 text-left">
            <h3 className="text-lg font-bold border-b border-glass-border pb-3">Booking History</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-glass-border bg-bg-secondary/40 text-text-secondary uppercase font-semibold">
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Cake Type</th>
                    <th className="p-3">Delivery Date</th>
                    <th className="p-3 text-right">Order Value</th>
                    <th className="p-3 text-right">Balance Due</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border text-[13px]">
                  {clientOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-text-muted">
                        No orders recorded for this customer.
                      </td>
                    </tr>
                  ) : (
                    clientOrders.map((o) => (
                      <tr
                        key={o.id}
                        onClick={() => navigate(`/orders/${o.id}`)}
                        className="hover:bg-glass-hover/30 transition-colors cursor-pointer"
                      >
                        <td className="p-3 font-mono font-medium text-primary-light">{o.order_number}</td>
                        <td className="p-3 capitalize font-semibold text-text-primary">{o.cake_type}</td>
                        <td className="p-3 text-text-secondary">{o.delivery_date}</td>
                        <td className="p-3 text-right font-semibold text-text-primary">₹{o.order_value.toLocaleString()}</td>
                        <td className={`p-3 text-right font-bold ${o.remaining_balance > 0 ? "text-danger" : "text-text-muted"}`}>
                          ₹{o.remaining_balance.toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                            o.payment_status === "completed"
                              ? "bg-success/10 text-success border-success/20"
                              : o.payment_status === "partial"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-danger/10 text-danger border-danger/20"
                          }`}>
                            {o.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
