/**
 * Cakes and Crunches — Wallet API Client
 */

import apiClient from "./client";

export const walletApi = {
  getByCustomerId: async (customerId) => {
    const response = await apiClient.get(`/wallet/customer/${customerId}`);
    return response.data;
  },

  credit: async (customerId, amount, description) => {
    const response = await apiClient.post(`/wallet/customer/${customerId}/credit`, {
      amount,
      description,
    });
    return response.data;
  },

  debit: async (customerId, amount, description) => {
    const response = await apiClient.post(`/wallet/customer/${customerId}/debit`, {
      amount,
      description,
    });
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get("/wallet/stats");
    return response.data;
  },
};
