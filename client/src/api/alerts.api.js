/**
 * Cakes and Crunches — Alerts API Client
 */

import apiClient from "./client";

export const alertsApi = {
  getAll: async () => {
    const response = await apiClient.get("/alerts");
    return response.data;
  },

  resolve: async (alertId) => {
    const response = await apiClient.post(`/alerts/${alertId}/resolve`);
    return response.data;
  },

  runScan: async () => {
    const response = await apiClient.post("/alerts/scan");
    return response.data;
  },
};
