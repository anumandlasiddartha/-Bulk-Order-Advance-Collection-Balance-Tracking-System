/**
 * Cakes and Crunches — Technical System Logs
 */

import { useQuery } from "@tanstack/react-query";
import { RiTerminalBoxLine } from "react-icons/ri";

import { adminApi } from "../../api/admin.api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function SystemLogsPage() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["system-logs"],
    queryFn: adminApi.getSystemLogs,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">System Logs</h1>
        <p className="text-text-secondary text-sm">Real-time technical operation logs for database transactions and server events.</p>
      </div>

      <div className="glass-card p-6 flex flex-col gap-4 text-left">
        <h3 className="text-lg font-bold border-b border-glass-border pb-3 flex items-center gap-2">
          <RiTerminalBoxLine className="w-5 h-5 text-primary-light" /> Live Operations Feed
        </h3>

        <div className="flex flex-col gap-2 font-mono text-xs bg-bg-primary p-4 rounded-lg overflow-y-auto max-h-96 border border-glass-border">
          {logs.length === 0 ? (
            <span className="text-text-muted">[INFO] Operational logger active. Listening for system events...</span>
          ) : (
            logs.map((l) => (
              <div key={l.id} className="flex gap-2 py-1 border-b border-glass-border/30 last:border-0">
                <span className="text-text-muted">[{l.timestamp.split("T")[1]?.slice(0,8)}]</span>
                <span className="text-success">[TX-COMMIT]</span>
                <span className="text-text-secondary">{l.activity}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
