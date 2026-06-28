/**
 * Cakes and Crunches — Payments API Client
 */

import apiClient from "./client";

export const paymentsApi = {
  getByOrderId: async (orderId) => {
    const response = await apiClient.get(`/payments/order/${orderId}`);
    return response.data;
  },

  collect: async (paymentData) => {
    const response = await apiClient.post("/payments", paymentData);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get("/orders"); // To fetch orders and compute global financial metrics
    return response.data;
  },
};
