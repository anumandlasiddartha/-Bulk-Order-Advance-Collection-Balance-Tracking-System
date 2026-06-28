/**
 * Cakes and Crunches — Payments Dashboard
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RiMoneyRupeeCircleLine, RiPlayListAddLine } from "react-icons/ri";

import { paymentsApi } from "../../api/payments.api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PaymentForm from "./PaymentForm";
import apiClient from "../../api/client";

export default function PaymentsPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 1. Fetch Orders to resolve financial milestones
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: paymentsApi.getAll,
  });

  // 2. Fetch Customers to resolve customer ids locally
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

  // Financial aggregates
  const totalRevenue = orders.reduce((sum, o) => sum + o.order_value, 0);
  const totalCollected = orders.reduce((sum, o) => sum + o.advance_amount, 0);
  const outstandingBalance = orders.reduce((sum, o) => sum + o.remaining_balance, 0);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">Payments Collection</h1>
        <p className="text-text-secondary text-sm">Monitor overall bakery revenues, collect dues installments, and audit deposits.</p>
      </div>

      {/* Financial metrics overview widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-2">
          <span className="text-xs font-semibold text-text-secondary uppercase">Total Dues Value</span>
          <span className="text-3.5xl font-extrabold text-primary-light">₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2">
          <span className="text-xs font-semibold text-text-secondary uppercase">Total Collected</span>
          <span className="text-3.5xl font-extrabold text-success">₹{totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="glass-card p-6 flex flex-col gap-2">
          <span className="text-xs font-semibold text-text-secondary uppercase">Outstanding Balance Dues</span>
          <span className="text-3.5xl font-extrabold text-accent-light">₹{outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* List of Dues and Collection actions */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <RiMoneyRupeeCircleLine className="w-5 h-5 text-primary-light" /> Dues Checklist
        </h3>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-glass-border bg-bg-secondary/40 text-text-secondary text-xs uppercase font-semibold">
                  <th className="p-4">Order Number</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4 text-right">Order Value</th>
                  <th className="p-4 text-right">Collected</th>
                  <th className="p-4 text-right">Outstanding Dues</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border text-sm">
                {orders.filter(o => o.remaining_balance > 0).map((o) => (
                  <tr key={o.id} className="hover:bg-glass-hover/40 transition-colors">
                    <td className="p-4 font-mono font-medium text-primary-light">{o.order_number}</td>
                    <td className="p-4 font-semibold text-text-primary">{getCustomerName(o.customer_id)}</td>
                    <td className="p-4 text-right">₹{o.order_value.toLocaleString()}</td>
                    <td className="p-4 text-right text-success font-semibold">₹{o.advance_amount.toLocaleString()}</td>
                    <td className="p-4 text-right text-accent-light font-bold">₹{o.remaining_balance.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 self-center mx-auto cursor-pointer"
                      >
                        <RiPlayListAddLine className="w-4 h-4" /> Collect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <PaymentForm
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
