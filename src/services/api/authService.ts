import apiClient from './apiClient';
import { 
  AuthResponse, 
  SignUpRequest, 
  SendOTPRequest, 
  LoginRequest, 
  UpdateProfileRequest,
  ForgotPasswordRequest,
  VerifyOTPRequest,
  VerifyEmailRequest,
  ResendOTPRequest,
  ResetPasswordRequest,
  LogoutRequest,
  SocialLoginRequest,
  DeleteMeRequest,
  UpdatePasswordRequest
} from '../../types/auth';

export const authService = {
  updateMyPassword: async (data: UpdatePasswordRequest): Promise<AuthResponse> => {
    console.log('📤 [UpdateMyPassword] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.patch<AuthResponse>('/api/v1/user/updateMyPassword', data);
    console.log('📥 [UpdateMyPassword] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
    console.log('📤 [SignUp] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.post<AuthResponse>('/api/v1/user/signup', data);
    console.log('📥 [SignUp] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  sendOTP: async (data: SendOTPRequest): Promise<any> => {
    console.log('📤 [SendOTP] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.post('/api/v1/user/sendOTP', data);
    console.log('📥 [SendOTP] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    console.log('📤 [Login] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.post<AuthResponse>('/api/v1/user/login', data);
    console.log('📥 [Login] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<any> => {
    console.log('📤 [UpdateProfile] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.patch('/api/v1/user/updateProfile', data);
    console.log('📥 [UpdateProfile] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<any> => {
    console.log('📤 [ForgotPassword] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.post('/api/v1/user/forgotpassword', data);
    console.log('📥 [ForgotPassword] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  verifyOTPResetPassword: async (data: VerifyOTPRequest): Promise<any> => {
    console.log('📤 [VerifyOTP] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.post('/api/v1/user/verifyOTPResetPassword', data);
    console.log('📥 [VerifyOTP] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<AuthResponse> => {
    console.log('📤 [VerifyEmail] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.post<AuthResponse>('/api/v1/user/verifyEmail', data);
    console.log('📥 [VerifyEmail] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  resendOTP: async (data: ResendOTPRequest): Promise<any> => {
    console.log('📤 [ResendOTP] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.post('/api/v1/user/sendOTP', data);
    console.log('📥 [ResendOTP] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<any> => {
    console.log('📤 [ResetPassword] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.patch('/api/v1/user/resetPassword', data);
    console.log('📥 [ResetPassword] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  logout: async (data: LogoutRequest): Promise<any> => {
    console.log('📤 [Logout] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.post('/api/v1/user/logout', data);
    console.log('📥 [Logout] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  socialLogin: async (data: SocialLoginRequest): Promise<AuthResponse> => {
    console.log('📤 [SocialLogin] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.post<AuthResponse>('/api/v1/user/socialLogin', data);
    console.log('📥 [SocialLogin] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  deleteMe: async (data: DeleteMeRequest): Promise<any> => {
    console.log('📤 [DeleteMe] Payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.post('/api/v1/user/deleteMe', data);
    console.log('📥 [DeleteMe] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  getMyNotifications: async (): Promise<any> => {
    console.log('📤 [GetMyNotifications] Request');
    const response = await apiClient.get('/api/v1/user/mynotifications');
    console.log('📥 [GetMyNotifications] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  deleteMyNotifications: async (): Promise<any> => {
    console.log('📤 [DeleteMyNotifications] Request');
    const response = await apiClient.delete('/api/v1/user/mynotifications');
    console.log('📥 [DeleteMyNotifications] Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  },
};
