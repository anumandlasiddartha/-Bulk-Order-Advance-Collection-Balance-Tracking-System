/**
 * Cakes and Crunches — Auth Context
 *
 * Provides global authentication state, login, register, and logout logic.
 */

import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { authApi } from "../api/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const data = await authApi.getMe();
          if (data.success) {
            setUser(data.user);
          }
        } catch (err) {
          // Token expired or server offline
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await authApi.login(email, password);
      if (data.success && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        toast.success("Successfully logged in!");
        return true;
      }
      return false;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Login failed";
      toast.error(errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
