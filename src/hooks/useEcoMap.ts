import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ecoMapService } from '../services/api/ecoMapService';
import { EcoMapParams } from '../types/ecoMap';

export const useNearby = (params: EcoMapParams) => {
  // Use discrete key parts so React Query caches each unique combination correctly
  return useQuery({
    queryKey: ['ecoMap', params.lat, params.lng, params.type ?? 'all', params.q ?? ''],
    queryFn: () => ecoMapService.getNearby(params),
    enabled: typeof params.lat === 'number' && typeof params.lng === 'number',
    // Keep showing previous pins while new filter/search result loads — prevents empty flash
    placeholderData: keepPreviousData,
    staleTime: 30_000, // 30s — don't refetch on every tiny re-render
  });
};
