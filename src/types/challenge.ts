export interface LocationPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
  description?: string;
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  points: number;
  xp: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'daily' | 'weekly' | 'rare' | 'destination';
  image?: string;
  endTime?: string;
  selfCheck?: boolean;
  category?: string;
  isGPS?: boolean;
  location?: LocationPoint;
  textForAi?: string;
  isImageUpload?: boolean;
  active?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChallengeAttempt {
  _id: string;
  challengeId: string | Challenge;
  userId: string;
  status: 'started' | 'completed' | 'failed' | 'pending';
  startedAt?: string;
  completedAt?: string;
  image?: string;
  location?: LocationPoint;
  rewardClaimed?: boolean;
  pointsEarned?: number;
  xpEarned?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChallengeListResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    challenges: Challenge[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ChallengeDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    challenge: Challenge;
    userProgress?: {
      status: string;
      attemptId?: string;
      rewardClaimed?: boolean;
    };
  };
}

export interface ChallengeAttemptResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    attempt: ChallengeAttempt;
  };
}

export interface ChallengeAttemptsListResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    attempts: ChallengeAttempt[];
  };
}
