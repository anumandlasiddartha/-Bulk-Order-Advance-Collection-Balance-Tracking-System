/**
 * Cakes and Crunches — User Profile Settings
 */

import { useState, useContext } from "react";
import { RiUserLine, RiKeyLine, RiShieldLine, RiEyeLine, RiEyeOffLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import toast from "react-hot-toast";

import { AuthContext } from "../../context/AuthContext";
import apiClient from "../../api/client";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password rules validation
  const checks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword),
  };

  const getStrengthPercent = () => {
    const passed = Object.values(checks).filter(Boolean).length;
    return (passed / 4) * 100;
  };

  const getStrengthColor = () => {
    const passed = Object.values(checks).filter(Boolean).length;
    if (passed <= 1) return "bg-danger";
    if (passed <= 3) return "bg-warning";
    return "bg-success";
  };

  const getStrengthText = () => {
    const passed = Object.values(checks).filter(Boolean).length;
    if (newPassword.length === 0) return "";
    if (passed <= 1) return "Weak";
    if (passed <= 3) return "Moderate";
    return "Strong";
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Both current and new passwords are required.");
      return;
    }

    const passedCount = Object.values(checks).filter(Boolean).length;
    if (passedCount < 4) {
      toast.error("New password does not satisfy strength parameters.");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="text-center text-text-secondary text-sm py-12">Please sign in to view your profile.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">Profile Credentials</h1>
        <p className="text-text-secondary text-sm">Manage your staff login identity and update account passwords.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Identity Card */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="glass-card p-6 flex flex-col gap-5 items-center text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent-light flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {user.full_name?.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex flex-col gap-0.5">
              <h2 className="text-xl font-bold text-text-primary">{user.full_name}</h2>
              <span className="text-xs text-text-muted font-mono">@{user.username}</span>
            </div>

            <div className="px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary-light text-xs font-bold uppercase tracking-wider">
              {user.role}
            </div>

            <div className="w-full border-t border-glass-border pt-4 text-xs text-text-secondary flex flex-col gap-2 text-left">
              <div className="flex justify-between">
                <span className="font-semibold">Email:</span>
                <span className="text-text-primary">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Authority:</span>
                <span className="text-text-primary capitalize">{user.role} Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Forms & Details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Password Form */}
          <div className="glass-card p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold border-b border-glass-border pb-3 flex items-center gap-2">
              <RiKeyLine className="w-5 h-5 text-primary-light" /> Change Password
            </h3>

            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 relative">
                <label className="text-xs font-semibold text-text-secondary">Current Password</label>
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="input text-xs pr-10 w-full"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary cursor-pointer"
                  >
                    {showOld ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1 relative">
                <label className="text-xs font-semibold text-text-secondary">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input text-xs pr-10 w-full"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary cursor-pointer"
                  >
                    {showNew ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password strength suggester */}
              {newPassword.length > 0 && (
                <div className="flex flex-col gap-2 p-3 bg-bg-secondary/40 border border-glass-border rounded-lg text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary font-medium">New Password Strength:</span>
                    <span className={`font-bold ${
                      getStrengthColor() === "bg-danger" ? "text-danger" : getStrengthColor() === "bg-warning" ? "text-warning" : "text-success"
                    }`}>{getStrengthText()}</span>
                  </div>

                  <div className="w-full bg-glass-border h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${getStrengthColor()}`} style={{ width: `${getStrengthPercent()}%` }} />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    <div className="flex items-center gap-1">
                      {checks.length ? <RiCheckLine className="text-success" /> : <RiCloseLine className="text-text-muted" />}
                      <span className={checks.length ? "text-text-primary" : "text-text-muted"}>8+ Characters</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {checks.uppercase ? <RiCheckLine className="text-success" /> : <RiCloseLine className="text-text-muted" />}
                      <span className={checks.uppercase ? "text-text-primary" : "text-text-muted"}>1 Uppercase</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {checks.number ? <RiCheckLine className="text-success" /> : <RiCloseLine className="text-text-muted" />}
                      <span className={checks.number ? "text-text-primary" : "text-text-muted"}>1 Number</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {checks.special ? <RiCheckLine className="text-success" /> : <RiCloseLine className="text-text-muted" />}
                      <span className={checks.special ? "text-text-primary" : "text-text-muted"}>1 Special Symbol</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary self-end px-6 py-2 cursor-pointer text-xs"
              >
                {loading ? "Saving..." : "Change Password"}
              </button>
            </form>
          </div>

          {/* Access Roles Guidelines */}
          <div className="glass-card p-6 flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold border-b border-glass-border pb-2 flex items-center gap-2">
              <RiShieldLine className="w-5 h-5 text-primary-light" /> Authority Levels & Privileges
            </h3>
            
            <div className="flex flex-col gap-3 leading-relaxed text-text-secondary">
              <p>
                Your account is currently authorized under the role of <strong className="text-text-primary capitalize">{user.role}</strong>. Based on standard Cakes and Crunches security controls:
              </p>
              <ul className="list-disc pl-4 flex flex-col gap-1">
                <li><strong>Staff Roles</strong> can register bookings, log payment installments, and inspect lists.</li>
                <li><strong>Manager Roles</strong> can adjust customer wallet credits, debit dues, and trigger overdue logs scans.</li>
                <li><strong>Admin Roles</strong> hold full configuration capabilities (User registry creation, system parameters, setting values updates, audit logging registries).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
