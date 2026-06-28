/**
 * Cakes and Crunches — Orders Registry Page
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RiAddLine, RiSearchLine, RiFilterLine } from "react-icons/ri";

import { ordersApi } from "../../api/orders.api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import apiClient from "../../api/client";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 1. Query Orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: ordersApi.getAll,
  });

  // 2. Query Customers (to resolve Customer ID -> Name locally)
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "partial":
        return "bg-info/10 text-info border-info/20";
      case "overdue":
        return "bg-danger/10 text-danger border-danger/20";
      default:
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  // Filter logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getCustomerName(o.customer_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Orders</h1>
          <p className="text-text-secondary text-sm">Monitor bulk orders, payments collection status, and remaining balances.</p>
        </div>
        <Link to="/orders/new" className="btn-primary self-start sm:self-auto">
          <RiAddLine className="w-5 h-5" /> New Bulk Order
        </Link>
      </div>

      {/* Filters Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-4 rounded-xl">
        <div className="relative w-full md:max-w-md">
          <RiSearchLine className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Search order number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex gap-4 items-center w-full md:w-auto">
          <RiFilterLine className="text-text-muted w-5 h-5 hidden sm:inline" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input py-2"
          >
            <option value="all">All Payment Statuses</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Orders Grid Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border bg-bg-secondary/40 text-text-secondary text-xs uppercase font-semibold">
                <th className="p-4">Order Number</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Delivery Date</th>
                <th className="p-4 text-right">Order Value</th>
                <th className="p-4 text-right">Advance Paid</th>
                <th className="p-4 text-right">Balance Due</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-text-muted">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-glass-hover/40 transition-colors">
                    <td className="p-4 font-mono font-medium text-primary-light">
                      {order.order_number}
                    </td>
                    <td className="p-4 font-semibold text-text-primary">
                      {getCustomerName(order.customer_id)}
                    </td>
                    <td className="p-4 text-text-secondary">
                      {order.delivery_date}
                    </td>
                    <td className="p-4 text-right font-bold text-text-primary">
                      ₹{order.order_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right font-bold text-success">
                      ₹{order.advance_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right font-bold text-accent-light">
                      ₹{order.remaining_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getStatusStyle(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Link to={`/orders/${order.id}`} className="text-xs text-primary-light hover:underline font-semibold">
                        View Details
                      </Link>
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
