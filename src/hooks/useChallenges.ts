import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { challengeService } from '../services/api/challengeService';
import { LocationPoint } from '../types/challenge';

export const useListChallenges = (params?: {
  page?: number;
  limit?: number;
  type?: string;
  difficulty?: string;
  proofType?: string;
  status?: string;
  sortBy?: string;
}) => {
  return useQuery({
    queryKey: ['challenges', params],
    queryFn: () => challengeService.listChallenges(params),
  });
};

export const useSearchChallenges = (q: string, type?: string) => {
  return useQuery({
    queryKey: ['challengesSearch', q, type],
    queryFn: () => challengeService.searchChallenges(q, type),
    enabled: !!q,
  });
};

export const useChallengeById = (id: string) => {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: () => challengeService.getChallengeById(id),
    enabled: !!id,
  });
};

export const useStartChallenge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (challengeId: string) => challengeService.startChallenge(challengeId),
    onSuccess: (data, challengeId) => {
      queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['myAttempts'] });
      queryClient.invalidateQueries({ queryKey: ['homeDashboard'] });
    },
  });
};

export const useSubmitChallengeAttempt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      attemptId,
      payload,
    }: {
      attemptId: string;
      payload: {
        status?: 'completed' | 'failed';
        image?: string;
        location?: LocationPoint;
      };
    }) => challengeService.submitChallengeAttempt(attemptId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attempt', variables.attemptId] });
      queryClient.invalidateQueries({ queryKey: ['myAttempts'] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['homeDashboard'] });
    },
  });
};

export const useClaimChallengeReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attemptId: string) => challengeService.claimChallengeReward(attemptId),
    onSuccess: (data, attemptId) => {
      queryClient.invalidateQueries({ queryKey: ['attempt', attemptId] });
      queryClient.invalidateQueries({ queryKey: ['myAttempts'] });
      queryClient.invalidateQueries({ queryKey: ['userStreak'] });
      queryClient.invalidateQueries({ queryKey: ['homeDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
};

export const useMyAttempts = () => {
  return useQuery({
    queryKey: ['myAttempts'],
    queryFn: () => challengeService.getMyAttempts(),
  });
};

export const useAttemptById = (id: string) => {
  return useQuery({
    queryKey: ['attempt', id],
    queryFn: () => challengeService.getAttemptById(id),
    enabled: !!id,
  });
};
