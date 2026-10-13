export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  username?: string;
  number?: string;
  location?: string | {
    type: string;
    coordinates: number[];
    address?: string;
    description?: string;
  };
  website?: string;
  image?: string;
  about?: string;
  isBlocked?: boolean;
  gender?: string;
  isNotification?: boolean;
  isChallengeReminder?: boolean;
  isLocationServices?: boolean;
  isEmailUpdates?: boolean;
}

export interface AuthResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    user: User;
    sessions?: any[];
  }
}

export interface DeviceInfo {
  id: string;
  deviceToken: string;
}

export interface SignUpRequest {
  email?: string;
  name?: string;
  password?: string;
  role?: string;
  device?: DeviceInfo;
}

export interface SendOTPRequest {
  email?: string;
  role?: string;
  device?: DeviceInfo;
}

export interface LoginRequest {
  email?: string;
  password?: string;
  role?: string;
  device?: DeviceInfo;
}

export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  number?: string;
  location?: string | {
    type: string;
    coordinates: number[];
    address?: string;
    description?: string;
  };
  website?: string;
  image?: string;
  about?: string;
  isNotification?: boolean;
  isChallengeReminder?: boolean;
  isLocationServices?: boolean;
  isEmailUpdates?: boolean;
}

export interface ForgotPasswordRequest {
  email?: string;
  role?: string;
}

export interface VerifyOTPRequest {
  email?: string;
  otp?: string;
  role?: string;
}

export interface VerifyEmailRequest {
  email?: string;
  otp?: string;
  device?: DeviceInfo;
}

export interface ResendOTPRequest {
  email?: string;
}

export interface ResetPasswordRequest {
  email?: string;
  password?: string;
  otp?: string;
  role?: string;
  device?: DeviceInfo;
}

export interface LogoutRequest {
  device?: DeviceInfo;
}

export interface SocialLoginRequest {
  email?: string;
  device?: DeviceInfo;
}

export interface DeleteMeRequest {
  password?: string;
}

export interface UpdatePasswordRequest {
  currentPassword?: string;
  password?: string;
  device?: DeviceInfo;
}

export interface ApiError {
  message: string;
  code?: number;
  errors?: Record<string, string[]>;
}
