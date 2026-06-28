/**
 * Cakes and Crunches — Bulk Order Entry Form
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { ordersApi } from "../../api/orders.api";
import apiClient from "../../api/client";

// Form Validation Schema using Zod
const orderFormSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  cake_type: z.string().min(1, "Cake Type is required"),
  event_type: z.string().min(1, "Event Type is required"),
  delivery_date: z.string().min(1, "Delivery date is required"),
  order_value: z.coerce.number().min(1, "Order value must be positive"),
  advance_amount: z.coerce.number().min(0, "Advance cannot be negative"),
  notes: z.string().optional(),
});

export default function BulkOrderEntry() {
  const navigate = useNavigate();

  // 1. Fetch Customers list for Dropdown Select
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await apiClient.get("/customers");
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      order_value: 0,
      advance_amount: 0,
      notes: "",
    },
  });

  // Watch fields to calculate dynamic Remaining Balance
  const orderValue = watch("order_value") || 0;
  const advanceAmount = watch("advance_amount") || 0;
  const remainingBalance = Math.max(0, orderValue - advanceAmount);

  // Mutation to post new order
  const createOrderMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      toast.success("Bulk order registered successfully!");
      navigate("/orders");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create order");
    },
  });

  const onSubmit = (data) => {
    if (data.advance_amount > data.order_value) {
      toast.error("Advance amount cannot exceed total order value.");
      return;
    }
    createOrderMutation.mutate({
      ...data,
      customer_id: parseInt(data.customer_id),
    });
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">Bulk Order Entry</h1>
        <p className="text-text-secondary text-sm">Register new event bulk orders and track deposits.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-secondary">Customer</label>
            <select {...register("customer_id")} className="input">
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id.toString()}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
            {errors.customer_id && <span className="text-xs text-danger">{errors.customer_id.message}</span>}
          </div>

          {/* Delivery Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-secondary">Delivery Date</label>
            <input type="date" {...register("delivery_date")} className="input" />
            {errors.delivery_date && <span className="text-xs text-danger">{errors.delivery_date.message}</span>}
          </div>

          {/* Cake Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-secondary">Cake Type</label>
            <select {...register("cake_type")} className="input">
              <option value="">Select Cake Type</option>
              <option value="birthday">Birthday Cake</option>
              <option value="wedding">Wedding Cake</option>
              <option value="anniversary">Anniversary Cake</option>
              <option value="custom">Custom Cake</option>
              <option value="cupcakes">Cupcakes</option>
            </select>
            {errors.cake_type && <span className="text-xs text-danger">{errors.cake_type.message}</span>}
          </div>

          {/* Event Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-secondary">Event Type</label>
            <select {...register("event_type")} className="input">
              <option value="">Select Event Type</option>
              <option value="birthday">Birthday Party</option>
              <option value="wedding">Wedding Ceremony</option>
              <option value="corporate">Corporate Event</option>
              <option value="festival">Festival Celebration</option>
              <option value="party">General Party</option>
              <option value="other">Other Event</option>
            </select>
            {errors.event_type && <span className="text-xs text-danger">{errors.event_type.message}</span>}
          </div>

          {/* Order Value */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-secondary">Total Value (₹)</label>
            <input type="number" step="0.01" {...register("order_value")} className="input" />
            {errors.order_value && <span className="text-xs text-danger">{errors.order_value.message}</span>}
          </div>

          {/* Advance Deposit */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-secondary">Advance Paid (₹)</label>
            <input type="number" step="0.01" {...register("advance_amount")} className="input" />
            {errors.advance_amount && <span className="text-xs text-danger">{errors.advance_amount.message}</span>}
          </div>
        </div>

        {/* Dynamic Calculations display */}
        <div className="p-4 rounded-xl bg-bg-secondary/40 border border-glass-border grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-text-muted font-medium">Balance Due</span>
            <span className="text-xl font-bold text-accent-light">₹{remainingBalance.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-text-muted font-medium">Auto Payment Status</span>
            <span className="text-sm font-bold text-text-primary mt-1">
              {remainingBalance === 0 ? "Completed" : advanceAmount > 0 ? "Partially Paid" : "Pending"}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-text-secondary">Order Specifications / Notes</label>
          <textarea {...register("notes")} className="input h-24" placeholder="Enter custom frosting instructions, flavor tiers, allergen notices..."></textarea>
        </div>

        <div className="flex gap-4 justify-end mt-4">
          <button type="button" onClick={() => navigate("/orders")} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={createOrderMutation.isPending} className="btn-primary">
            {createOrderMutation.isPending ? "Submitting..." : "Create Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
