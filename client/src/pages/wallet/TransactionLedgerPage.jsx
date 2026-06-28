/**
 * Cakes and Crunches — Financial Transaction Ledger
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RiSearchLine, RiFilterLine, RiFileHistoryLine } from "react-icons/ri";

import { ledgerApi } from "../../api/ledger.api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import apiClient from "../../api/client";

export default function TransactionLedgerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // 1. Fetch Ledger records
  const { data: ledgers = [], isLoading } = useQuery({
    queryKey: ["ledgers", typeFilter],
    queryFn: () => ledgerApi.getAll(typeFilter !== "all" ? { transaction_type: typeFilter } : {}),
  });

  // 2. Fetch Users (to resolve recorded_by user ids locally)
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await apiClient.get("/users/health"); // Fallback to list when endpoint completed
      return [{ id: 1, full_name: "System Admin" }];
    },
  });

  const getUserName = (userId) => {
    const usr = users.find((u) => u.id === userId);
    return usr ? usr.full_name : `User #${userId}`;
  };

  // Filter search matches
  const filteredLedgers = ledgers.filter((l) =>
    l.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">Transaction Ledger</h1>
        <p className="text-text-secondary text-sm">Review double-entry financial credit and debit adjustments logs.</p>
      </div>

      {/* Filter and Search actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-4 rounded-xl">
        <div className="relative w-full md:max-w-md">
          <RiSearchLine className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Search Reference number or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex gap-4 items-center w-full md:w-auto">
          <RiFilterLine className="text-text-muted w-5 h-5 hidden sm:inline" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input py-2"
          >
            <option value="all">All Adjustments</option>
            <option value="credit">Credits only (+)</option>
            <option value="debit">Debits only (-)</option>
          </select>
        </div>
      </div>

      {/* Ledger Log Registry Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border bg-bg-secondary/40 text-text-secondary text-xs uppercase font-semibold">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Reference Number</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-center">Type</th>
                <th className="p-4 text-right">Adjustment Amount</th>
                <th className="p-4 text-right">Running Balance</th>
                <th className="p-4 text-center">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border text-sm">
              {filteredLedgers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted">
                    No double-entry adjustments registered.
                  </td>
                </tr>
              ) : (
                filteredLedgers.map((l) => (
                  <tr key={l.id} className="hover:bg-glass-hover/40 transition-colors">
                    <td className="p-4 text-text-secondary">
                      {l.created_at.split("T")[0]} {l.created_at.split("T")[1]?.slice(0, 5) || ""}
                    </td>
                    <td className="p-4 font-mono font-medium text-primary-light">
                      {l.reference_number}
                    </td>
                    <td className="p-4 text-text-primary max-w-xs truncate">
                      {l.description}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        l.transaction_type === "credit"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-danger/10 text-danger border-danger/20"
                      }`}>
                        {l.transaction_type}
                      </span>
                    </td>
                    <td className={`p-4 text-right font-bold ${
                      l.transaction_type === "credit" ? "text-success" : "text-danger"
                    }`}>
                      {l.transaction_type === "credit" ? "+" : "-"}₹{l.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right font-semibold text-text-primary">
                      ₹{l.running_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center font-medium text-text-secondary">
                      {getUserName(l.created_by)}
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
