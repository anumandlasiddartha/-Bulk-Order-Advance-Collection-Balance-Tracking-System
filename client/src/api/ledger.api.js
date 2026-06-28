/**
 * Cakes and Crunches — Ledger API Client
 */

import apiClient from "./client";

export const ledgerApi = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/ledger", { params });
    return response.data;
  },
};
