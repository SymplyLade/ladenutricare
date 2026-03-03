import { useState, useEffect, useCallback } from 'react';
import { getUnreadCount, getNotifications, markAsRead } from '../services/notifications';

export const useNotifications = (pollInterval = 30000) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Failed to fetch unread count', error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await getNotifications(0, 10);
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markNotificationAsRead = useCallback(async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchNotifications();
    }, pollInterval);
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount, pollInterval]);

  return {
    unreadCount,
    notifications,
    loading,
    markAsRead: markNotificationAsRead,
    refresh: fetchNotifications,
  };
};