import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/api/notificationService';

export const useNotifications = (params?: { type?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getNotifications(params),
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['unreadNotificationCount'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 60000, // Poll every minute if desired
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => notificationService.deleteAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
};
