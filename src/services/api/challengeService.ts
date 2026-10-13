import apiClient from './apiClient';
import {
  ChallengeListResponse,
  ChallengeDetailResponse,
  ChallengeAttemptResponse,
  ChallengeAttemptsListResponse,
  LocationPoint
} from '../../types/challenge';

export const challengeService = {
  listChallenges: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    difficulty?: string;
    proofType?: string;
    status?: string;
    sortBy?: string;
  }): Promise<ChallengeListResponse> => {
    console.log('📤 [ListChallenges] Params:', JSON.stringify(params, null, 2));
    const response = await apiClient.get<ChallengeListResponse>('/api/v1/challenges', { params });
    console.log('📥 [ListChallenges] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  searchChallenges: async (q: string, type?: string): Promise<ChallengeListResponse> => {
    console.log('📤 [SearchChallenges] Query:', q, 'Type:', type);
    const response = await apiClient.get<ChallengeListResponse>('/api/v1/challenges/search', {
      params: { q, type }
    });
    console.log('📥 [SearchChallenges] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getChallengeById: async (id: string): Promise<ChallengeDetailResponse> => {
    console.log('📤 [GetChallengeById] ID:', id);
    const response = await apiClient.get<ChallengeDetailResponse>(`/api/v1/challenges/${id}`);
    console.log('📥 [GetChallengeById] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  startChallenge: async (challengeId: string): Promise<ChallengeAttemptResponse> => {
    console.log('📤 [StartChallenge] challengeId:', challengeId);
    const response = await apiClient.post<ChallengeAttemptResponse>('/api/v1/challenge-attempts/start', {
      challengeId
    });
    console.log('📥 [StartChallenge] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  submitChallengeAttempt: async (
    attemptId: string,
    payload: {
      status?: 'completed' | 'failed';
      image?: string;
      location?: LocationPoint;
    }
  ): Promise<ChallengeAttemptResponse> => {
    console.log(`📤 [SubmitChallengeAttempt] ID: ${attemptId}, Payload:`, JSON.stringify(payload, null, 2));
    const response = await apiClient.patch<ChallengeAttemptResponse>(
      `/api/v1/challenge-attempts/${attemptId}/submit`,
      payload,
      { validateStatus: (status) => status < 500 } // Don't throw error on 400 response
    );
    console.log('📥 [SubmitChallengeAttempt] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  claimChallengeReward: async (attemptId: string): Promise<any> => {
    console.log('📤 [ClaimChallengeReward] ID:', attemptId);
    const response = await apiClient.patch<any>(`/api/v1/challenge-attempts/${attemptId}/claim`);
    console.log('📥 [ClaimChallengeReward] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getMyAttempts: async (): Promise<ChallengeAttemptsListResponse> => {
    console.log('📤 [GetMyAttempts] Request');
    const response = await apiClient.get<ChallengeAttemptsListResponse>('/api/v1/challenge-attempts/my');
    console.log('📥 [GetMyAttempts] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getAttemptById: async (id: string): Promise<ChallengeAttemptResponse> => {
    console.log('📤 [GetAttemptById] ID:', id);
    const response = await apiClient.get<ChallengeAttemptResponse>(`/api/v1/challenge-attempts/${id}`);
    console.log('📥 [GetAttemptById] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  }
};
