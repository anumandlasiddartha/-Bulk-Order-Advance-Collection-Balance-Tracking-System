/**
 * Cakes and Crunches — Order Details Page
 */

import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RiFileListLine, RiUserLine, RiMoneyRupeeCircleLine, RiCalendarLine } from "react-icons/ri";

import { ordersApi } from "../../api/orders.api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import apiClient from "../../api/client";

export default function OrderDetail() {
  const { id } = useParams();

  // 1. Fetch Order details
  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getById(id),
  });

  // 2. Fetch Customer details if order loaded
  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: ["customer", order?.customer_id],
    queryFn: async () => {
      const res = await apiClient.get(`/customers/${order.customer_id}`);
      return res.data;
    },
    enabled: !!order?.customer_id,
  });

  // 3. Fetch Payments associated with this order
  const { data: payments = [] } = useQuery({
    queryKey: ["payments", id],
    queryFn: async () => {
      const res = await apiClient.get(`/payments/order/${id}`);
      return res.data;
    },
  });

  if (isOrderLoading || isCustomerLoading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Order not found.</h2>
        <Link to="/orders" className="btn-secondary mt-4 inline-block">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-primary-light font-bold uppercase">{order.order_number}</span>
          <h1 className="text-3xl font-extrabold text-text-primary mt-1">Order Details</h1>
        </div>
        <Link to="/orders" className="btn-secondary">
          Back to Registry
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: General Order details & specs */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Order info */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold border-b border-glass-border pb-3 flex items-center gap-2">
              <RiFileListLine className="w-5 h-5 text-primary-light" /> General Info
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-text-muted">Cake Type</span>
                <span className="font-semibold text-text-primary uppercase">{order.cake_type}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-text-muted">Event Type</span>
                <span className="font-semibold text-text-primary uppercase">{order.event_type}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-text-muted">Delivery Date</span>
                <span className="font-semibold text-text-primary flex items-center gap-1">
                  <RiCalendarLine className="w-4 h-4 text-text-muted" /> {order.delivery_date}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-text-muted">Current Production Status</span>
                <span className="font-semibold text-text-primary uppercase">{order.order_status}</span>
              </div>
            </div>
            {order.notes && (
              <div className="mt-2 p-3 bg-bg-secondary/40 rounded-lg border border-glass-border">
                <span className="text-xs text-text-muted block mb-1">Bakery Notes</span>
                <p className="text-sm leading-relaxed text-text-secondary">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Dues History */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold border-b border-glass-border pb-3 flex items-center gap-2">
              <RiMoneyRupeeCircleLine className="w-5 h-5 text-primary-light" /> Transactions ledger History
            </h3>
            {payments.length === 0 ? (
              <p className="text-sm text-text-muted py-4 text-center">No payment entries collected for this order yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {payments.map((p) => (
                  <div key={p.id} className="p-3 border border-glass-border rounded-lg flex items-center justify-between text-sm bg-bg-secondary/20">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-primary-light">{p.receipt_number}</span>
                      <span className="text-xs text-text-muted mt-0.5">{p.payment_method.toUpperCase()} • {p.payment_date.split("T")[0]}</span>
                    </div>
                    <span className="font-bold text-success">
                      +₹{p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Customer & Financial summaries */}
        <div className="flex flex-col gap-6">
          {/* Customer box */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold border-b border-glass-border pb-3 flex items-center gap-2">
              <RiUserLine className="w-5 h-5 text-primary-light" /> Customer Details
            </h3>
            {customer && (
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted">Name</span>
                  <span className="font-semibold text-text-primary">{customer.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted">Phone</span>
                  <span className="font-semibold text-text-primary">{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex flex-col">
                    <span className="text-xs text-text-muted">Email</span>
                    <span className="font-semibold text-text-primary">{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex flex-col">
                    <span className="text-xs text-text-muted">Address</span>
                    <span className="text-text-secondary text-xs mt-0.5">{customer.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Financial summary */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold border-b border-glass-border pb-3">Financial Overview</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Order Value:</span>
                <span className="font-bold text-text-primary">₹{order.order_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Advance Paid:</span>
                <span className="font-bold text-success">₹{order.advance_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <hr className="border-glass-border" />
              <div className="flex justify-between items-center text-base">
                <span className="font-semibold text-text-primary">Remaining Due:</span>
                <span className="font-extrabold text-accent-light">₹{order.remaining_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
