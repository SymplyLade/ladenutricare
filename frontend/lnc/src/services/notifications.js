import api from './api';

export const getNotifications = (skip = 0, limit = 20, unreadOnly = false) =>
  api.get(`/notifications?skip=${skip}&limit=${limit}&unread_only=${unreadOnly}`);

export const getUnreadCount = () => api.get('/notifications/unread-count');

export const markAsRead = (id) => api.put(`/notifications/${id}/read`);

export const markAllRead = () => api.put('/notifications/read-all');