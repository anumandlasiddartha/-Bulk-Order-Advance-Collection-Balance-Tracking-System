/**
 * Cakes and Crunches — Dropdown Notifications Panel
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiCheckDoubleLine, RiAlertLine, RiInformationLine } from "react-icons/ri";
import toast from "react-hot-toast";

import { notificationsApi } from "../../api/notifications.api";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function NotificationPanel({ onClose }) {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getAll,
  });

  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      toast.success("Notifications marked as read.");
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const unreadLogs = notifications.filter((n) => !n.is_read);

  return (
    <div className="absolute right-4 top-16 w-80 glass-card p-4 flex flex-col gap-4 z-50">
      <div className="flex justify-between items-center border-b border-glass-border pb-2">
        <h4 className="text-sm font-bold text-text-primary">Notifications ({unreadLogs.length})</h4>
        {unreadLogs.length > 0 && (
          <button
            onClick={() => markReadMutation.mutate()}
            className="text-xs text-primary-light hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RiCheckDoubleLine className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-6">No historical notifications recorded.</p>
        ) : (
          notifications.slice(0, 5).map((n) => (
            <div
              key={n.id}
              className={`p-2 rounded-lg flex gap-3 text-xs text-left border ${
                n.is_read ? "border-transparent bg-transparent" : "border-glass-border bg-bg-secondary/40"
              }`}
            >
              <div className="p-1.5 bg-primary/10 rounded text-primary-light self-start">
                {n.type === "warning" ? <RiAlertLine className="w-4 h-4" /> : <RiInformationLine className="w-4 h-4" />}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-text-primary">{n.title}</span>
                <span className="text-text-secondary text-[11px] leading-relaxed">{n.message}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <button onClick={onClose} className="btn-secondary w-full py-1.5 text-xs">
        Close Menu
      </button>
    </div>
  );
}
