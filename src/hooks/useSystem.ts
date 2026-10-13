import { useQuery, useMutation } from '@tanstack/react-query';
import { systemService } from '../services/api/systemService';

export const useSystemInfo = () => {
  return useQuery({
    queryKey: ['systemInfo'],
    queryFn: () => systemService.getSystemInfo(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useHomeDashboard = () => {
  return useQuery({
    queryKey: ['homeDashboard'],
    queryFn: () => systemService.getHomeDashboard(),
  });
};

export const useUserStreak = () => {
  return useQuery({
    queryKey: ['userStreak'],
    queryFn: () => systemService.getUserStreak(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useUserRewards = () => {
  return useQuery({
    queryKey: ['userRewards'],
    queryFn: () => systemService.getUserRewards(),
  });
};

export const useFAQ = () => {
  return useQuery({
    queryKey: ['faq'],
    queryFn: () => systemService.getFAQ(),
  });
};

export const useHelpCenter = () => {
  return useQuery({
    queryKey: ['helpCenter'],
    queryFn: () => systemService.getHelpCenter(),
  });
};

export const usePrivacyPolicy = () => {
  return useQuery({
    queryKey: ['privacyPolicy'],
    queryFn: () => systemService.getPrivacyPolicy(),
  });
};

export const useTermsAndConditions = () => {
  return useQuery({
    queryKey: ['termsAndConditions'],
    queryFn: () => systemService.getTermsAndConditions(),
  });
};

export const useCustomerSupport = () => {
  return useMutation({
    mutationFn: (data: { fullName: string; email: string; subject: string; message: string; }) =>
      systemService.postCustomerSupport(data),
  });
};

export const useCustomerSupportSubjects = () => {
  return useQuery({
    queryKey: ['customerSupportSubjects'],
    queryFn: () => systemService.getCustomerSupportSubjects(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMyCustomerSupportTickets = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['myCustomerSupportTickets', params],
    queryFn: () => systemService.getMyCustomerSupportTickets(params),
  });
};

