import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardService } from '../services/api/rewardService';

export const useRedeemRewards = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['redeemRewards', params],
    queryFn: () => rewardService.getRedeemRewards(params),
  });
};

export const useRedeemReward = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => rewardService.redeemReward(id),
    onSuccess: () => {
      // Invalidate relevant queries after redeeming a reward
      queryClient.invalidateQueries({ queryKey: ['redeemRewards'] });
      queryClient.invalidateQueries({ queryKey: ['myRedemptions'] });
      queryClient.invalidateQueries({ queryKey: ['systemInfo'] }); // To update points/ecoScore
      queryClient.invalidateQueries({ queryKey: ['userStreak'] });
    },
  });
};

export const useMyRedemptions = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['myRedemptions', params],
    queryFn: () => rewardService.getMyRedemptions(params),
  });
};
