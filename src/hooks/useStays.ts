import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stayService } from '../services/api/stayService';

export const useListStays = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['stays', params],
    queryFn: () => stayService.listStays(params),
  });
};

export const useSearchStays = (params: {
  q?: string;
  type?: string;
  isCertified?: boolean;
}) => {
  return useQuery({
    queryKey: ['staysSearch', params],
    queryFn: () => stayService.searchStays(params),
  });
};

export const useStayById = (id: string) => {
  return useQuery({
    queryKey: ['stay', id],
    queryFn: () => stayService.getStayById(id),
    enabled: !!id,
  });
};

export const useStartStayVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stayId: string) => stayService.startStayVisit(stayId),
    onSuccess: (data, stayId) => {
      queryClient.invalidateQueries({ queryKey: ['stay', stayId] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['myVisits'] });
      queryClient.invalidateQueries({ queryKey: ['homeDashboard'] });
    },
  });
};

export const useSubmitStayVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      visitId,
      image,
    }: {
      visitId: string;
      image: string;
    }) => stayService.submitStayVisit(visitId, image),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['visit', variables.visitId] });
      queryClient.invalidateQueries({ queryKey: ['myVisits'] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
      queryClient.invalidateQueries({ queryKey: ['homeDashboard'] });
    },
  });
};

export const useClaimStayReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (visitId: string) => stayService.claimStayReward(visitId),
    onSuccess: (data, visitId) => {
      queryClient.invalidateQueries({ queryKey: ['visit', visitId] });
      queryClient.invalidateQueries({ queryKey: ['myVisits'] });
      queryClient.invalidateQueries({ queryKey: ['userStreak'] });
      queryClient.invalidateQueries({ queryKey: ['homeDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['stays'] });
    },
  });
};

export const useMyVisits = () => {
  return useQuery({
    queryKey: ['myVisits'],
    queryFn: () => stayService.getMyVisits(),
  });
};

export const useVisitById = (id: string) => {
  return useQuery({
    queryKey: ['visit', id],
    queryFn: () => stayService.getVisitById(id),
    enabled: !!id,
  });
};
