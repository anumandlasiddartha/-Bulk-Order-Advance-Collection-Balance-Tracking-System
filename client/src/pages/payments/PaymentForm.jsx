/**
 * Cakes and Crunches — Collect Payment Form Modal
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { paymentsApi } from "../../api/payments.api";

const paymentSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero"),
  payment_method: z.string().min(1, "Payment method is required"),
  reference_number: z.string().optional(),
  notes: z.string().optional(),
});

export default function PaymentForm({ order, onClose }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: order.remaining_balance,
      payment_method: "upi",
      reference_number: "",
      notes: "",
    },
  });

  const collectMutation = useMutation({
    mutationFn: paymentsApi.collect,
    onSuccess: () => {
      toast.success("Payment recorded and balance updated!");
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["order", order.id.toString()]);
      queryClient.invalidateQueries(["payments", order.id.toString()]);
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to process payment");
    },
  });

  const onSubmit = (data) => {
    if (data.amount > order.remaining_balance) {
      toast.error(`Payment cannot exceed remaining due of ₹${order.remaining_balance}`);
      return;
    }
    collectMutation.mutate({
      ...data,
      order_id: order.id,
    });
  };

  return (
    <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md glass-card p-6 flex flex-col gap-6 relative">
        <div>
          <h3 className="text-xl font-bold text-text-primary">Collect Payment</h3>
          <p className="text-text-secondary text-xs mt-0.5">Order: {order.order_number}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex justify-between text-sm p-3 bg-bg-secondary/40 rounded-lg border border-glass-border">
            <span className="text-text-secondary">Outstanding Balance:</span>
            <span className="font-bold text-accent-light">₹{order.remaining_balance.toLocaleString()}</span>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-secondary">Amount to Collect (₹)</label>
            <input type="number" step="0.01" {...register("amount")} className="input" />
            {errors.amount && <span className="text-xs text-danger">{errors.amount.message}</span>}
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-secondary">Payment Method</label>
            <select {...register("payment_method")} className="input">
              <option value="upi">UPI (GPay / PhonePe)</option>
              <option value="cash">Cash</option>
              <option value="card">Credit / Debit Card</option>
              <option value="bank_transfer">Bank NetBanking</option>
              <option value="cheque">Cheque Deposit</option>
            </select>
            {errors.payment_method && <span className="text-xs text-danger">{errors.payment_method.message}</span>}
          </div>

          {/* Ref Number */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-secondary">Transaction Ref Number (Optional)</label>
            <input type="text" {...register("reference_number")} className="input" placeholder="UPI transaction ID, Cheque number" />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-text-secondary">Notes (Optional)</label>
            <textarea {...register("notes")} className="input h-16" placeholder="Installment details..."></textarea>
          </div>

          <div className="flex gap-4 justify-end mt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={collectMutation.isPending} className="btn-primary">
              {collectMutation.isPending ? "Recording..." : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
