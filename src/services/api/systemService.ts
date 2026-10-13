import apiClient from './apiClient';
import {
  SystemInfoResponse,
  HomeDashboardResponse,
  UserStreakResponse,
  UserRewardsResponse,
  FAQResponse,
  HelpCenterResponse,
  PrivacyPolicyResponse,
  TermsConditionResponse
} from '../../types/system';

export const systemService = {
  getSystemInfo: async (): Promise<SystemInfoResponse> => {
    console.log('📤 [GetSystemInfo] Request');
    const response = await apiClient.get<SystemInfoResponse>('/api/v1/system-info');
    console.log('📥 [GetSystemInfo] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getHomeDashboard: async (): Promise<HomeDashboardResponse> => {
    console.log('📤 [GetHomeDashboard] Request');
    const response = await apiClient.get<HomeDashboardResponse>('/api/v1/home');
    console.log('📥 [GetHomeDashboard] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getUserStreak: async (): Promise<UserStreakResponse> => {
    console.log('📤 [GetUserStreak] Request');
    const response = await apiClient.get<UserStreakResponse>('/api/v1/user/streak');
    console.log('📥 [GetUserStreak] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getUserRewards: async (): Promise<UserRewardsResponse> => {
    console.log('📤 [GetUserRewards] Request');
    const response = await apiClient.get<UserRewardsResponse>('/api/v1/user/rewards');
    console.log('📥 [GetUserRewards] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getFAQ: async (): Promise<FAQResponse> => {
    console.log('📤 [GetFAQ] Request');
    const response = await apiClient.get<FAQResponse>('/api/v1/faq');
    console.log('📥 [GetFAQ] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getHelpCenter: async (): Promise<HelpCenterResponse> => {
    console.log('📤 [GetHelpCenter] Request');
    const response = await apiClient.get<HelpCenterResponse>('/api/v1/help-center');
    console.log('📥 [GetHelpCenter] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getPrivacyPolicy: async (): Promise<PrivacyPolicyResponse> => {
    console.log('📤 [GetPrivacyPolicy] Request');
    const response = await apiClient.get<PrivacyPolicyResponse>('/api/v1/privacy');
    console.log('📥 [GetPrivacyPolicy] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getTermsAndConditions: async (): Promise<TermsConditionResponse> => {
    console.log('📤 [GetTermsAndConditions] Request');
    const response = await apiClient.get<TermsConditionResponse>('/api/v1/termsandcondition');
    console.log('📥 [GetTermsAndConditions] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  postCustomerSupport: async (data: { fullName: string; email: string; subject: string; message: string; }) => {
    console.log('📤 [PostCustomerSupport] Request', data);
    const response = await apiClient.post('/api/v1/customer-support', data);
    console.log('📥 [PostCustomerSupport] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getCustomerSupportSubjects: async (): Promise<any> => {
    console.log('📤 [GetCustomerSupportSubjects] Request');
    const response = await apiClient.get('/api/v1/customer-support/subjects');
    console.log('📥 [GetCustomerSupportSubjects] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getMyCustomerSupportTickets: async (params?: { page?: number; limit?: number }): Promise<any> => {
    console.log('📤 [GetMyCustomerSupportTickets] Request Params:', params);
    const response = await apiClient.get('/api/v1/customer-support/my', { params });
    console.log('📥 [GetMyCustomerSupportTickets] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  }
};

