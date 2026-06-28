/**
 * Cakes and Crunches — Notifications Inbox view
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiNotification3Line, RiCheckDoubleLine, RiAlertLine, RiInformationLine } from "react-icons/ri";
import toast from "react-hot-toast";

import { notificationsApi } from "../../api/notifications.api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getAll,
  });

  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      toast.success("All notifications marked as read.");
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">System Notifications</h1>
          <p className="text-text-secondary text-sm">Review system alerts, low-advance flags, and overdue transaction warnings.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markReadMutation.mutate()}
            className="btn-secondary self-start sm:self-auto flex items-center gap-2 cursor-pointer"
          >
            <RiCheckDoubleLine className="w-5 h-5" /> Mark all read
          </button>
        )}
      </div>

      {/* Feed list */}
      <div className="flex flex-col gap-4">
        {notifications.length === 0 ? (
          <div className="glass-card p-12 text-center text-text-muted flex flex-col items-center gap-2">
            <RiNotification3Line className="w-10 h-10 text-primary-light/60 animate-pulse" />
            <span className="text-sm font-semibold text-text-primary">Inbox is empty</span>
            <span className="text-xs">No notifications logged for your account yet.</span>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`glass-card p-5 border flex items-start gap-4 text-left transition-all ${
                n.is_read ? "border-glass-border bg-bg-secondary/20" : "border-primary/20 bg-bg-secondary/40 glow"
              }`}
            >
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 text-primary-light self-start">
                {n.type === "warning" ? <RiAlertLine className="w-5 h-5" /> : <RiInformationLine className="w-5 h-5" />}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-sm text-text-primary uppercase tracking-wide">
                  {n.title}
                </span>
                <p className="text-sm text-text-secondary leading-relaxed mt-1">{n.message}</p>
                <span className="text-[10px] text-text-muted font-mono mt-1">Logged: {n.created_at.split("T")[0]} {n.created_at.split("T")[1]?.slice(0,5)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
