/**
 * Cakes and Crunches — Register Account Page with Password Strength Indicator
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiCheckLine, RiCloseLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import toast from "react-hot-toast";

import apiClient from "../../api/client";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("staff");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password rules validation
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&]/.test(password),
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
    if (password.length === 0) return "";
    if (passed <= 1) return "Weak";
    if (passed <= 3) return "Moderate";
    return "Strong (Perfect!)";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const passedCount = Object.values(checks).filter(Boolean).length;
    if (passedCount < 4) {
      toast.error("Please satisfy all password strength requirements.");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/auth/register", {
        username,
        email,
        password,
        full_name: fullName,
        role,
      });
      toast.success("Account registered successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 text-left w-full max-w-sm mx-auto">
      <div>
        <h2 className="text-xl font-bold text-text-primary">Create Staff Identity</h2>
        <p className="text-xs text-text-secondary mt-1">Register a new access account to start tracking orders.</p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input text-xs"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input text-xs"
            placeholder="johndoe"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input text-xs"
            placeholder="john@cakes.com"
            required
          />
        </div>

        <div className="flex flex-col gap-1 relative">
          <label className="text-xs font-semibold text-text-secondary">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input text-xs pr-10 w-full"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary cursor-pointer"
            >
              {showPassword ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <div className="flex flex-col gap-2 p-3 bg-bg-secondary/40 border border-glass-border rounded-lg text-xs">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary font-medium">Strength:</span>
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
                <span className={checks.special ? "text-text-primary" : "text-text-muted"}>1 Special Character (@$!%*?&)</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-text-secondary">Default Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input text-xs"
          >
            <option value="staff">Staff (Baker / Sales)</option>
            <option value="manager">Manager</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-2 cursor-pointer text-xs"
        >
          {loading ? "Registering account..." : "Sign Up"}
        </button>

        <div className="text-center text-xs text-text-secondary mt-1">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-light hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
