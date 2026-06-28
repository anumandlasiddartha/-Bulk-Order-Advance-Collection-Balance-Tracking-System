/**
 * Cakes and Crunches — Outstanding Balance Dues Registry
 */

import { useQuery } from "@tanstack/react-query";
import { RiCalendarEventLine } from "react-icons/ri";

import { ordersApi } from "../../api/orders.api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import apiClient from "../../api/client";

export default function BalanceDuePage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: ordersApi.getAll,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await apiClient.get("/customers");
      return res.data;
    },
  });

  const getCustomerName = (custId) => {
    const cust = customers.find((c) => c.id === custId);
    return cust ? cust.name : `Customer #${custId}`;
  };

  const pendingDuesOrders = orders.filter((o) => o.remaining_balance > 0);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">Outstanding Balance Dues</h1>
        <p className="text-text-secondary text-sm">Checklist of active customer orders with remaining due amounts.</p>
      </div>

      <div className="glass-card p-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <RiCalendarEventLine className="w-5 h-5 text-primary-light" /> Outstanding Dues
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border bg-bg-secondary/40 text-text-secondary text-xs uppercase font-semibold">
                <th className="p-4">Order Number</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Delivery Date</th>
                <th className="p-4 text-right">Order Value</th>
                <th className="p-4 text-right">Remaining Due</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border text-sm">
              {pendingDuesOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted">No outstanding dues recorded yet.</td>
                </tr>
              ) : (
                pendingDuesOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-glass-hover/40 transition-colors">
                    <td className="p-4 font-mono font-medium text-primary-light">{o.order_number}</td>
                    <td className="p-4 font-semibold text-text-primary">{getCustomerName(o.customer_id)}</td>
                    <td className="p-4 text-text-secondary">{o.delivery_date}</td>
                    <td className="p-4 text-right">₹{o.order_value.toLocaleString()}</td>
                    <td className="p-4 text-right text-accent-light font-bold">₹{o.remaining_balance.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        o.payment_status === "overdue"
                          ? "bg-danger/10 text-danger border-danger/20"
                          : "bg-warning/10 text-warning border-warning/20"
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
  );
}
