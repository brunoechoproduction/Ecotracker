import apiClient from './apiClient';
import { EcoMapParams, EcoMapResponse } from '../../types/ecoMap';

export const ecoMapService = {
  getNearby: async (params: EcoMapParams): Promise<EcoMapResponse> => {
    console.log('📤 [GetNearbyMap] Params:', JSON.stringify(params, null, 2));
    const response = await apiClient.get<EcoMapResponse>('/api/v1/eco-map', { params });
    console.log('📥 [GetNearbyMap] Response:', response.data?.success ? 'Success' : 'Failed');
    return response.data;
  }
};
