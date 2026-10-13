import apiClient from './apiClient';

export const rewardService = {
  getRedeemRewards: async (params?: { page?: number; limit?: number }) => {
    console.log('📤 [GetRedeemRewards] Request', params);
    const response = await apiClient.get('/api/v1/redeem-rewards', { params });
    console.log('📥 [GetRedeemRewards] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  redeemReward: async (id: string) => {
    console.log(`📤 [RedeemReward] Request ID: ${id}`);
    const response = await apiClient.post(`/api/v1/redeem-rewards/${id}/redeem`);
    console.log('📥 [RedeemReward] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  },

  getMyRedemptions: async (params?: { page?: number; limit?: number }) => {
    console.log('📤 [GetMyRedemptions] Request', params);
    const response = await apiClient.get('/api/v1/redeem-rewards/my-redemptions', { params });
    console.log('📥 [GetMyRedemptions] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  }
};
