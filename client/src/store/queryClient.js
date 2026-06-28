/**
 * Cakes and Crunches — TanStack Query Client Configuration
 *
 * Global query client with default settings for caching,
 * retries, and stale time management.
 */

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 minutes before data is considered stale
      gcTime: 10 * 60 * 1000,         // 10 minutes before unused data is garbage collected
      retry: 2,                        // Retry failed queries twice
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      refetchOnWindowFocus: false,     // Don't refetch on window focus
      refetchOnMount: true,            // Refetch on component mount if stale
    },
    mutations: {
      retry: 1,
    },
  },
});
