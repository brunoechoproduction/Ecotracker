import apiClient from './apiClient';
import {
  GetAllUsersParams,
  UpdateUserByIdRequest,
  BlockUserRequest,
  DisableProfileRequest,
  UserListResponse
} from '../../types/user';
import { User } from '../../types/auth';

export const userService = {
  getMyClients: async (): Promise<any> => {
    const response = await apiClient.get('/api/v1/user/my-clients');
    return response.data;
  },

  getAllUsers: async (params: GetAllUsersParams): Promise<UserListResponse> => {
    const response = await apiClient.get<UserListResponse>('/api/v1/user', { params });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<{data: {user: User}}>(`/api/v1/user/${id}`);
    return response.data.data.user;
  },

  disableProfile: async (data: DisableProfileRequest): Promise<any> => {
    const response = await apiClient.post('/api/v1/user/deleteMe', data);
    return response.data;
  },

  deleteUserById: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/api/v1/user/${id}`);
    return response.data;
  },

  updateUserById: async (id: string, data: UpdateUserByIdRequest): Promise<any> => {
    const response = await apiClient.patch(`/api/v1/user/${id}`, data);
    return response.data;
  },

  blockUser: async (data: BlockUserRequest): Promise<any> => {
    const response = await apiClient.patch('/api/v1/user/blockUser', data);
    return response.data;
  },

  uploadImage: async (uri: string): Promise<string> => {
    const formData = new FormData();
    const uriParts = uri.split('/');
    const fileName = uriParts[uriParts.length - 1] || 'photo.jpg';
    
    // Determine file extension and mime type
    const ext = fileName.split('.').pop()?.toLowerCase();
    const type = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg';

    formData.append('images', {
      uri: uri,
      name: fileName,
      type: type,
    } as any);

    const response = await apiClient.post('/api/v1/user/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data?.success && response.data?.data?.length > 0) {
      return response.data.data[0].Location;
    }
    throw new Error(response.data?.message || 'Failed to upload image');
  },

  getImpactReport: async (): Promise<any> => {
    const response = await apiClient.get('/api/v1/user/echo-impact-report');
    return response.data;
  },

  getBadges: async (): Promise<any> => {
    const response = await apiClient.get('/api/v1/user/badges');
    return response.data;
  },
};

