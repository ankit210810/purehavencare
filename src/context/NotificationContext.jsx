import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [inboxNotifications, setInboxNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Welcome to PureHaven!',
      message: 'Use code FIRSTFARM at checkout for ₹150 off your first artisan order.',
      date: 'Just now',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Free Cold-Chain Delivery',
      message: 'Complimentary insulated sub-zero express shipping on orders over ₹1,499.',
      date: 'Today',
      read: false
    }
  ]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setInboxNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addInboxNotification = useCallback((title, message) => {
    setInboxNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title,
        message,
        date: 'Just now',
        read: false
      },
      ...prev
    ]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        inboxNotifications,
        markAllRead,
        addInboxNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
