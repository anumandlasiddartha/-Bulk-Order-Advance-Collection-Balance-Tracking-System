/**
 * Cakes and Crunches — Identity & Role Management Console
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiUserAddLine, RiShieldUserLine, RiShieldLine, RiUserLine } from "react-icons/ri";
import toast from "react-hot-toast";

import { adminApi } from "../../api/admin.api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function ManageUsersPage() {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("staff");

  // 1. Fetch Users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users-list"],
    queryFn: adminApi.getUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      toast.success("User registered successfully.");
      queryClient.invalidateQueries(["users-list"]);
      setUsername("");
      setEmail("");
      setPassword("");
      setFullName("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Registration failed");
    },
  });

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !fullName) {
      toast.error("Please fill in all inputs.");
      return;
    }
    createUserMutation.mutate({ username, email, password, full_name: fullName, role });
  };

  const getRoleIcon = (userRole) => {
    switch (userRole) {
      case "admin":
        return <RiShieldUserLine className="w-5 h-5 text-primary-light" />;
      case "manager":
        return <RiShieldLine className="w-5 h-5 text-success" />;
      default:
        return <RiUserLine className="w-5 h-5 text-text-secondary" />;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Staff Management</h1>
          <p className="text-text-secondary text-sm">Review active login identities and authorize user access permissions.</p>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-glass-border bg-bg-secondary/40 text-text-secondary text-xs uppercase font-semibold">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-center">Authorized Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-glass-hover/40 transition-colors">
                    <td className="p-4 font-semibold text-text-primary">{u.full_name}</td>
                    <td className="p-4 font-mono text-text-secondary">{u.username}</td>
                    <td className="p-4 text-text-secondary">{u.email}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center gap-1.5 justify-center">
                        {getRoleIcon(u.role)}
                        <span className="capitalize text-xs font-semibold text-text-primary">{u.role}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Register Form */}
      <div className="glass-card p-6 flex flex-col gap-6 h-fit text-left">
        <h3 className="text-lg font-bold border-b border-glass-border pb-3 flex items-center gap-2">
          <RiUserAddLine className="w-5 h-5 text-primary-light" /> Create Identity
        </h3>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-secondary">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" placeholder="Chef Baker" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-secondary">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input" placeholder="chefbaker" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-secondary">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="chef@cakesandcrunches.com" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-secondary">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-secondary">Role Authority</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
              <option value="staff">Staff (Baker / Teller)</option>
              <option value="manager">Manager (Sales supervisor)</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <button type="submit" disabled={createUserMutation.isPending} className="btn-primary w-full mt-2 cursor-pointer">
            {createUserMutation.isPending ? "Registering..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
