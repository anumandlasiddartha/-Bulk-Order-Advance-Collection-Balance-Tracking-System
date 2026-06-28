/**
 * Cakes and Crunches — Application Entry Point
 * 
 * Mounts the React app with providers for routing,
 * TanStack Query, auth context, and toast notifications.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { queryClient } from "./store/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SidebarProvider>
            <NotificationProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "rgba(15, 23, 42, 0.9)",
                    color: "#f1f5f9",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "12px",
                    fontSize: "14px",
                  },
                  success: {
                    iconTheme: { primary: "#10b981", secondary: "#f1f5f9" },
                  },
                  error: {
                    iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" },
                  },
                }}
              />
            </NotificationProvider>
          </SidebarProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
