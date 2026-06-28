/**
 * Cakes and Crunches — Reminder Center
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiNotificationBadgeLine, RiCheckDoubleLine, RiAlertLine, RiRefreshLine } from "react-icons/ri";
import toast from "react-hot-toast";

import { alertsApi } from "../../api/alerts.api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function ReminderCenterPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("unresolved");

  // 1. Query Alerts
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: alertsApi.getAll,
  });

  // Resolve Mutation
  const resolveMutation = useMutation({
    mutationFn: alertsApi.resolve,
    onSuccess: () => {
      toast.success("Alert warning resolved successfully.");
      queryClient.invalidateQueries(["alerts"]);
    },
  });

  // Scan Dues Mutation
  const scanMutation = useMutation({
    mutationFn: alertsApi.runScan,
    onSuccess: (data) => {
      toast.success(data.message || "Overdue scan completed.");
      queryClient.invalidateQueries(["alerts"]);
    },
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
      case "high":
        return "text-danger border-danger/20 bg-danger/10";
      case "medium":
        return "text-warning border-warning/20 bg-warning/10";
      default:
        return "text-info border-info/20 bg-info/10";
    }
  };

  const filteredAlerts = alerts.filter((a) =>
    tab === "unresolved" ? !a.is_resolved : a.is_resolved
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Reminder Center</h1>
          <p className="text-text-secondary text-sm">Monitor automated warnings, overdue dues notifications, and payment reminders.</p>
        </div>
        <button
          onClick={() => scanMutation.mutate()}
          disabled={scanMutation.isPending}
          className="btn-secondary self-start sm:self-auto flex items-center gap-2 cursor-pointer"
        >
          <RiRefreshLine className={`w-4 h-4 ${scanMutation.isPending ? "animate-spin" : ""}`} /> Scan Dues
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-glass-border">
        <button
          onClick={() => setTab("unresolved")}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            tab === "unresolved" ? "border-primary text-primary-light" : "border-transparent text-text-secondary"
          }`}
        >
          Active Reminders ({alerts.filter((a) => !a.is_resolved).length})
        </button>
        <button
          onClick={() => setTab("resolved")}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            tab === "resolved" ? "border-primary text-primary-light" : "border-transparent text-text-secondary"
          }`}
        >
          Resolved Archive ({alerts.filter((a) => a.is_resolved).length})
        </button>
      </div>

      {/* Feed list */}
      <div className="flex flex-col gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="glass-card p-12 text-center text-text-muted flex flex-col items-center gap-2">
            <RiCheckDoubleLine className="w-10 h-10 text-success/60" />
            <span className="text-sm font-semibold text-text-primary">All clear!</span>
            <span className="text-xs">No active alerts match this queue configuration.</span>
          </div>
        ) : (
          filteredAlerts.map((a) => (
            <div
              key={a.id}
              className="glass-card p-5 border border-glass-border flex items-start justify-between gap-4 text-left hover:border-primary/10 transition-all"
            >
              <div className="flex gap-4">
                <div className="p-3 bg-bg-secondary rounded-lg border border-glass-border self-start">
                  <RiAlertLine className="w-5 h-5 text-primary-light" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-text-primary uppercase tracking-wide">
                      {a.type.replace("_", " ")}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${getPriorityColor(a.priority)}`}>
                      {a.priority}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mt-1">{a.message}</p>
                  <span className="text-[10px] text-text-muted font-mono mt-1">Logged at: {a.created_at.split("T")[0]} {a.created_at.split("T")[1]?.slice(0,5)}</span>
                </div>
              </div>

              {!a.is_resolved && (
                <button
                  onClick={() => resolveMutation.mutate(a.id)}
                  disabled={resolveMutation.isPending}
                  className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 cursor-pointer hover:border-success hover:text-success"
                >
                  <RiCheckDoubleLine className="w-4 h-4" /> Resolve
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
