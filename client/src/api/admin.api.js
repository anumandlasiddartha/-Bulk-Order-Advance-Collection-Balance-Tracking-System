/**
 * Cakes and Crunches — Admin Operations API Client
 */

import apiClient from "./client";

export const adminApi = {
  getUsers: async () => {
    const response = await apiClient.get("/admin/users");
    return response.data;
  },

  createUser: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  getAuditLogs: async () => {
    const response = await apiClient.get("/admin/audit-logs");
    return response.data;
  },

  getSystemLogs: async () => {
    const response = await apiClient.get("/admin/system-logs");
    return response.data;
  },

  getSettings: async () => {
    const response = await apiClient.get("/admin/settings");
    return response.data;
  },

  updateSetting: async (key, value) => {
    const response = await apiClient.post(`/admin/settings/${key}`, { value });
    return response.data;
  },
};
