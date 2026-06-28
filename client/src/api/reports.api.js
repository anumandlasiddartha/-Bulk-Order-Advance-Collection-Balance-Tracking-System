/**
 * Cakes and Crunches — Reports API Client
 */

import apiClient from "./client";

export const reportsApi = {
  exportCsv: async (reportType) => {
    const response = await apiClient.get(`/reports/export/csv`, {
      params: { type: reportType },
      responseType: "blob",
    });
    return response.data;
  },

  exportPdf: async () => {
    const response = await apiClient.get(`/reports/export/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
};
