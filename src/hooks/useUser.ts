import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/api/userService';
import {
  GetAllUsersParams,
  UpdateUserByIdRequest,
  BlockUserRequest,
  DisableProfileRequest
} from '../types/user';

export const useMyClients = () => {
  return useQuery({
    queryKey: ['myClients'],
    queryFn: userService.getMyClients,
  });
};

export const useAllUsers = (params: GetAllUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAllUsers(params),
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

export const useDisableProfile = () => {
  return useMutation({
    mutationFn: (data: DisableProfileRequest) => userService.disableProfile(data),
  });
};

export const useDeleteUserById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteUserById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

export const useUpdateUserById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserByIdRequest }) => userService.updateUserById(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BlockUserRequest) => userService.blockUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};
