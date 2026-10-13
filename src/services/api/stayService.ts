import apiClient from './apiClient';
import {
  StayListResponse,
  StayDetailResponse,
  StayVisitResponse,
  StayVisitsListResponse
} from '../../types/stay';

export const stayService = {
  listStays: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<StayListResponse> => {
    console.log('📤 [ListStays] Params:', JSON.stringify(params, null, 2));
    const response = await apiClient.get<StayListResponse>('/api/v1/stays', { params });
    console.log('📥 [ListStays] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  searchStays: async (params: {
    q?: string;
    type?: string;
    isCertified?: boolean;
  }): Promise<StayListResponse> => {
    console.log('📤 [SearchStays] Params:', JSON.stringify(params, null, 2));
    const response = await apiClient.get<StayListResponse>('/api/v1/stays/search', { params });
    console.log('📥 [SearchStays] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getStayById: async (id: string): Promise<StayDetailResponse> => {
    console.log('📤 [GetStayById] ID:', id);
    const response = await apiClient.get<StayDetailResponse>(`/api/v1/stays/${id}`);
    console.log('📥 [GetStayById] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  startStayVisit: async (stayId: string): Promise<StayVisitResponse> => {
    console.log('📤 [StartStayVisit] stayId:', stayId);
    const response = await apiClient.post<StayVisitResponse>('/api/v1/stay-visits/start', {
      stayId
    });
    console.log('📥 [StartStayVisit] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  submitStayVisit: async (
    visitId: string,
    image: string
  ): Promise<StayVisitResponse> => {
    console.log(`📤 [SubmitStayVisit] ID: ${visitId}, Image:`, image);
    const response = await apiClient.patch<StayVisitResponse>(
      `/api/v1/stay-visits/${visitId}/submit`,
      { image }
    );
    console.log('📥 [SubmitStayVisit] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  claimStayReward: async (visitId: string): Promise<any> => {
    console.log('📤 [ClaimStayReward] ID:', visitId);
    const response = await apiClient.patch<any>(`/api/v1/stay-visits/${visitId}/claim`);
    console.log('📥 [ClaimStayReward] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getMyVisits: async (): Promise<StayVisitsListResponse> => {
    console.log('📤 [GetMyVisits] Request');
    const response = await apiClient.get<StayVisitsListResponse>('/api/v1/stay-visits/my');
    console.log('📥 [GetMyVisits] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getVisitById: async (id: string): Promise<StayVisitResponse> => {
    console.log('📤 [GetVisitById] ID:', id);
    const response = await apiClient.get<StayVisitResponse>(`/api/v1/stay-visits/${id}`);
    console.log('📥 [GetVisitById] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  }
};
