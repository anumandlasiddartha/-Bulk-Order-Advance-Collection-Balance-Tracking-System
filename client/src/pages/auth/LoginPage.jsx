import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text-secondary">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="admin@cakesandcrunches.com"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text-secondary">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="••••••••"
          required
        />
      </div>

      <button type="submit" className="btn-primary w-full mt-2 cursor-pointer">
        Sign In
      </button>

      <div className="text-center mt-4 flex flex-col gap-2">
        <Link to="/forgot-password" className="text-sm text-primary-light hover:underline font-medium">
          Forgot Password?
        </Link>
        <div className="text-xs text-text-secondary mt-1">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-light hover:underline font-bold">
            Register here
          </Link>
        </div>
      </div>
    </form>
  );
}
