/**
 * Cakes and Crunches — Notifications API Client
 */

import apiClient from "./client";

export const notificationsApi = {
  getAll: async () => {
    const response = await apiClient.get("/notifications");
    return response.data;
  },

  markAllRead: async () => {
    const response = await apiClient.post("/notifications/mark-read");
    return response.data;
  },
};
