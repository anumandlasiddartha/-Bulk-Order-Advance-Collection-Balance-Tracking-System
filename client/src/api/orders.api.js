/**
 * Cakes and Crunches — Orders API Client
 */

import apiClient from "./client";

export const ordersApi = {
  getAll: async () => {
    const response = await apiClient.get("/orders");
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  create: async (orderData) => {
    const response = await apiClient.post("/orders", orderData);
    return response.data;
  },

  getInvoicePdf: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/invoice`, {
      responseType: "blob",
    });
    return response.data;
  },
};
