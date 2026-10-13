import { Challenge } from './challenge';

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  username: string;
  image?: string;
  points: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  treesPlanted: number;
}

export interface SystemInfoResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    system: {
      totalUsers: number;
      totalActiveChallenges: number;
      totalActiveStays: number;
    };
    topUsers: LeaderboardUser[];
  };
}

export interface UserStreakStats {
  ecoScore: number;
  points: number;
  xp: number;
  streak: number;
  level: number;
  xpProgress: number; // e.g. 5420
  xpTarget: number; // e.g. 7000
  trustScore?: number; // e.g. 94
  globalRank?: number; // e.g. 3
}

export interface WeeklyProgressDay {
  day: string;
  date: string;
  status: string;
  isActive: boolean;
}

export interface UserStreakResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    currentStreak: number;
    longestStreak: number;
    bestStreak: number;
    lastStreakDate: string;
    daysActive: number;
    xpFromStreak: number;
    isPersonalBest: boolean;
    personalBestMessage: string;
    weeklyProgress: WeeklyProgressDay[];
    points: number;
    xp: number;
    treesPlanted: number;
  };
}

export interface HomeDashboardResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    stats: UserStreakStats;
    challenges: Challenge[];
  };
}

export interface RewardItem {
  _id: string;
  title: string;
  description: string;
  pointsCost: number;
  code?: string;
  isRedeemed: boolean;
  redeemedAt?: string;
}

export interface UserRewardsResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    rewards: RewardItem[];
  };
}

export interface FAQQuestion {
  q: string;
  a: string;
}

export interface FAQCategory {
  id?: number | string;
  _id?: string;
  category: string;
  questions: FAQQuestion[];
}

export interface FAQResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    faqs: FAQCategory[];
  };
}

export interface HelpCenterItem {
  email: string;
  phoneNumber: string;
  officeAddress: string;
  responseTime: string;
  operatingHours: string;
}

export interface HelpCenterResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    helpCenter: HelpCenterItem;
  };
}

export interface PolicySectionItem {
  title: string;
  content: string;
}

export interface PrivacyPolicyResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    privacyPolicy: PolicySectionItem[];
  };
}

export interface TermsConditionItem {
  title: string;
  content: string;
}

export interface TermsConditionResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    termsAndConditions: TermsConditionItem[];
  };
}

