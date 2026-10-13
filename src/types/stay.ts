import { LocationPoint } from './challenge';

export interface Stay {
  _id: string;
  title: string;
  description: string;
  type: string; // e.g. 'resort' | 'hotel' | 'hostel' | 'eco-lodge' | 'villa'
  location?: LocationPoint;
  price?: string;
  rate?: number;
  rateType?: string;
  rating?: number;
  features?: string[];
  image?: string;
  images?: string[];
  isCertified?: boolean;
  pointsReward?: number;
  points?: number;
  xpReward?: number;
  xp?: number;
  treesPlanted?: number;
  website?: string;
  whatsapp?: string;
  phoneNumber?: string;
  textForAi?: string;
  active?: boolean;
  createdBy?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StayVisit {
  _id: string;
  stayId: string | Stay;
  userId: string;
  status: 'started' | 'completed' | 'failed' | 'pending';
  startedAt?: string;
  completedAt?: string;
  image?: string;
  rewardClaimed?: boolean;
  pointsEarned?: number;
  xpEarned?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StayListResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    stays: Stay[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface StayDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    stay: Stay;
    userProgress?: {
      status: string;
      visitId?: string;
      rewardClaimed?: boolean;
    };
  };
}

export interface StayVisitResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    visit: StayVisit;
  };
}

export interface StayVisitsListResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    visits: StayVisit[];
  };
}
