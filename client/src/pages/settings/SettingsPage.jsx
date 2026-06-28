/**
 * Cakes and Crunches — Global Configuration Settings
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiSettings4Line, RiSave3Line } from "react-icons/ri";
import toast from "react-hot-toast";

import { adminApi } from "../../api/admin.api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [configs, setConfigs] = useState({});

  // 1. Fetch settings from DB
  const { isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const data = await adminApi.getSettings();
      // Map setting key-value pairs locally
      const mapping = {};
      data.forEach((s) => {
        mapping[s.key] = s.value;
      });
      setConfigs(mapping);
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, val }) => adminApi.updateSetting(key, val),
    onSuccess: () => {
      toast.success("Configuration updated successfully.");
      queryClient.invalidateQueries(["settings"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to save configuration.");
    },
  });

  const handleSave = (key) => {
    updateMutation.mutate({ key, val: configs[key] });
  };

  const handleValChange = (key, value) => {
    setConfigs((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">System Settings</h1>
        <p className="text-text-secondary text-sm">Configure threshold constraints, grace days, and payment options.</p>
      </div>

      <div className="glass-card p-6 flex flex-col gap-6">
        <h3 className="text-lg font-bold border-b border-glass-border pb-3 flex items-center gap-2">
          <RiSettings4Line className="w-5 h-5 text-primary-light" /> Operations Configurations
        </h3>

        <div className="flex flex-col gap-6 text-sm">
          {/* Low Advance */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-glass-border rounded-xl bg-bg-secondary/20">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-text-primary">Minimum Advance Percentage</span>
              <span className="text-xs text-text-muted">Minimum deposit value required to book a bulk order.</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={configs.low_advance_limit_percent || ""}
                onChange={(e) => handleValChange("low_advance_limit_percent", e.target.value)}
                className="input w-24 text-center"
              />
              <button
                onClick={() => handleSave("low_advance_limit_percent")}
                className="btn-primary p-2.5 rounded-lg cursor-pointer"
              >
                <RiSave3Line className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grace Days */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-glass-border rounded-xl bg-bg-secondary/20">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-text-primary">Overdue Grace Days</span>
              <span className="text-xs text-text-muted">Grace days allowed after delivery due date before triggering warnings.</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={configs.overdue_grace_days || ""}
                onChange={(e) => handleValChange("overdue_grace_days", e.target.value)}
                className="input w-24 text-center"
              />
              <button
                onClick={() => handleSave("overdue_grace_days")}
                className="btn-primary p-2.5 rounded-lg cursor-pointer"
              >
                <RiSave3Line className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Large Order limit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-glass-border rounded-xl bg-bg-secondary/20">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-text-primary">Large Order Limit Threshold (₹)</span>
              <span className="text-xs text-text-muted">Amount above which an order triggers critical audit checks.</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={configs.large_order_limit || ""}
                onChange={(e) => handleValChange("large_order_limit", e.target.value)}
                className="input w-28 text-center"
              />
              <button
                onClick={() => handleSave("large_order_limit")}
                className="btn-primary p-2.5 rounded-lg cursor-pointer"
              >
                <RiSave3Line className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
