/**
 * Cakes and Crunches — Notification Context
 *
 * Manages active alerts, unread notifications counts, and panels.
 */

import { createContext, useState, useEffect } from "react";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Basic initialization for bootability
    const dummyNotifications = [
      {
        id: 1,
        type: "warning",
        title: "Overdue Balance",
        message: "Order ORD-20260628-X928 is overdue for payment.",
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: 2,
        type: "info",
        title: "Large Order Placed",
        message: "New bulk order of ₹55,000 received.",
        timestamp: new Date().toISOString(),
        read: false,
      }
    ];
    setNotifications(dummyNotifications);
    setUnreadCount(dummyNotifications.filter(n => !n.read).length);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
