import apiClient from './apiClient';

export const notificationService = {
  getNotifications: async (params?: { type?: string; page?: number; limit?: number }) => {
    console.log('📤 [GetNotifications] Request Params:', params);
    const response = await apiClient.get('/api/v1/notifications', { params });
    console.log('📥 [GetNotifications] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getUnreadCount: async () => {
    console.log('📤 [GetUnreadCount] Request');
    const response = await apiClient.get('/api/v1/notifications/unread-count');
    console.log('📥 [GetUnreadCount] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  markAsRead: async (id: string) => {
    console.log(`📤 [MarkAsRead] Request ID: ${id}`);
    const response = await apiClient.patch(`/api/v1/notifications/${id}/read`);
    console.log('📥 [MarkAsRead] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  markAllAsRead: async () => {
    console.log('📤 [MarkAllAsRead] Request');
    const response = await apiClient.patch('/api/v1/notifications/read-all');
    console.log('📥 [MarkAllAsRead] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  deleteNotification: async (id: string) => {
    console.log(`📤 [DeleteNotification] Request ID: ${id}`);
    const response = await apiClient.delete(`/api/v1/notifications/${id}`);
    console.log('📥 [DeleteNotification] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  deleteAllNotifications: async () => {
    console.log('📤 [DeleteAllNotifications] Request');
    const response = await apiClient.delete('/api/v1/notifications');
    console.log('📥 [DeleteAllNotifications] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  }
};
