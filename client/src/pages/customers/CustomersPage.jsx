/**
 * Cakes and Crunches — Customers Registry Page
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { RiUserAddLine, RiSearchLine, RiMailLine, RiPhoneLine, RiMapPinLine, RiArrowRightSLine } from "react-icons/ri";
import toast from "react-hot-toast";

import apiClient from "../../api/client";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // 1. Fetch Customers
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await apiClient.get("/customers");
      return res.data;
    },
  });

  // 2. Add Customer Mutation
  const addCustomerMutation = useMutation({
    mutationFn: async (newCustomer) => {
      const res = await apiClient.post("/customers", newCustomer);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Customer profile registered successfully.");
      queryClient.invalidateQueries(["customers"]);
      setShowAddModal(false);
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create customer profile.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Name and Phone number are required.");
      return;
    }
    addCustomerMutation.mutate({ name, phone, email: email || null, address: address || null });
  };

  // Filter customers by search term
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary text-left">Customer Directory</h1>
          <p className="text-text-secondary text-sm text-left">Manage client contact details, address records, and look up wallets.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary self-start sm:self-auto flex items-center gap-2 cursor-pointer"
        >
          <RiUserAddLine className="w-5 h-5" /> Add Customer
        </button>
      </div>

      {/* Search Filter bar */}
      <div className="relative w-full max-w-md">
        <RiSearchLine className="absolute left-3 top-3.5 text-text-muted w-5 h-5" />
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Customer registry table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border bg-bg-secondary/40 text-text-secondary text-xs uppercase font-semibold">
                <th className="p-4">Client Name</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Billing Address</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted">
                    No matching customer records found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/customers/${c.id}`)}
                    className="hover:bg-glass-hover/30 transition-colors cursor-pointer"
                  >
                    <td className="p-4 font-semibold text-text-primary text-left">{c.name}</td>
                    <td className="p-4 font-medium text-text-secondary text-left">{c.phone}</td>
                    <td className="p-4 text-text-secondary text-left">{c.email || "—"}</td>
                    <td className="p-4 text-text-muted text-left max-w-xs truncate">{c.address || "—"}</td>
                    <td className="p-4 text-center">
                      <button className="text-primary-light hover:underline inline-flex items-center gap-0.5">
                        Details <RiArrowRightSLine className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-md flex flex-col gap-6 text-left" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold border-b border-glass-border pb-3 flex items-center gap-2">
              <RiUserAddLine className="w-5 h-5 text-primary-light" /> Register New Customer
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-secondary">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-secondary">Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                  placeholder="E.g. +91 9988776655"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-secondary">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="john@example.com"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-secondary">Billing Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input min-h-[80px]"
                  placeholder="Enter billing address..."
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-glass-border pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addCustomerMutation.isPending}
                  className="btn-primary px-4 py-2 cursor-pointer"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
