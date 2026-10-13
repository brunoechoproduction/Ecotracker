import { LocationPoint, Challenge } from './challenge';
import { Stay } from './stay';

export interface EcoMapItem {
  _id: string;
  itemType: 'stay' | 'challenge';
  title: string;
  description?: string;
  location: LocationPoint;
  stay?: Stay;
  challenge?: Challenge;
}

export interface EcoMapResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    items: EcoMapItem[];
  };
}

export interface EcoMapParams {
  lat: number;
  lng: number;
  radius?: number;
  type?: 'all' | 'stays' | 'challenges';
  q?: string;
}
