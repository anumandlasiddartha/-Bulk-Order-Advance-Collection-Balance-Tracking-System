/**
 * Cakes and Crunches — Security Audit Log Viewer
 */

import { useQuery } from "@tanstack/react-query";
import { RiHistoryLine } from "react-icons/ri";

import { adminApi } from "../../api/admin.api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function AuditLogsPage() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: adminApi.getAuditLogs,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">Compliance Audit Logs</h1>
        <p className="text-text-secondary text-sm">Secure immutable log of sensitive business operations and data alterations.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border bg-bg-secondary/40 text-text-secondary text-xs uppercase font-semibold">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Modified Table</th>
                <th className="p-4 text-center">Row ID</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border text-sm">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted">No security log entries committed yet.</td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="hover:bg-glass-hover/40 transition-colors text-xs">
                    <td className="p-4 text-text-secondary">{l.created_at}</td>
                    <td className="p-4 font-bold text-primary-light uppercase">{l.action}</td>
                    <td className="p-4 font-semibold text-text-primary">{l.entity_type || "N/A"}</td>
                    <td className="p-4 text-center text-text-secondary">{l.entity_id || "-"}</td>
                    <td className="p-4 font-mono text-text-muted">{l.ip_address || "127.0.0.1"}</td>
                    <td className="p-4 text-text-secondary max-w-xs truncate">{l.details}</td>
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
