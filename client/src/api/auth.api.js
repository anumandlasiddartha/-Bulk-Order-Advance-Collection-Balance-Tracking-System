/**
 * Cakes and Crunches — Authentication API Calls
 */

import apiClient from "./client";

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  changePassword: async (old_password, new_password) => {
    const response = await apiClient.post("/auth/change-password", {
      old_password,
      new_password,
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
