import { useEffect, useState, useCallback } from 'react';
import { socketService } from '@/api/socket';
import { Booking } from '@/api/types';

export interface NotificationItem {
  id: string; // unique notification id (could be booking.id)
  booking: Booking;
  isRead: boolean;
  timestamp: number;
}

export const useBookingNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('admin_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [latestNotification, setLatestNotification] = useState<Booking | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('admin_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const socket = socketService.connect();

    const handleNewBooking = (booking: Booking) => {
      console.log('New booking received via socket:', booking);

      const newNotify: NotificationItem = {
        id: booking.id + '_' + Date.now(), // Unique ID for each notify instance
        booking,
        isRead: false,
        timestamp: Date.now(),
      };

      setNotifications((prev) => [newNotify, ...prev].slice(0, 50)); // Keep last 50
      setLatestNotification(booking);
    };

    socket.on('newBooking', handleNewBooking);

    return () => {
      socket.off('newBooking', handleNewBooking);
    };
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === notificationId ? { ...item, isRead: true } : item)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  }, []);

  const clearLatest = () => setLatestNotification(null);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== notificationId));
  }, []);

  return {
    notifications,
    latestNotification,
    markAsRead,
    markAllAsRead,
    clearLatest,
    removeNotification,
  };
};
