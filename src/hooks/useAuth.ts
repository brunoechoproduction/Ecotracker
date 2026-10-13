import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/api/authService';
import { getDeviceDetails } from '../services/utilities/deviceUtils';
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
} from '../types/auth';

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: SignUpRequest) => {
      const device = await getDeviceDetails();
      return authService.signUp({ ...data, device });
    },
  });
};

export const useSendOTP = () => {
  return useMutation({
    mutationFn: async (data: SendOTPRequest) => {
      const device = await getDeviceDetails();
      return authService.sendOTP({ ...data, device });
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const device = await getDeviceDetails();
      return authService.login({ ...data, device });
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authService.updateProfile(data),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
  });
};

export const useVerifyOTPResetPassword = () => {
  return useMutation({
    mutationFn: (data: VerifyOTPRequest) => authService.verifyOTPResetPassword(data),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (data: VerifyEmailRequest) => {
      const device = await getDeviceDetails();
      return authService.verifyEmail({ ...data, device });
    },
  });
};

export const useResendOTP = () => {
  return useMutation({
    mutationFn: (data: ResendOTPRequest) => authService.resendOTP(data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const device = await getDeviceDetails();
      return authService.resetPassword({ ...data, device });
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async (data: LogoutRequest) => {
      const device = await getDeviceDetails();
      return authService.logout({ ...data, device });
    },
  });
};

export const useSocialLogin = () => {
  return useMutation({
    mutationFn: async (data: SocialLoginRequest) => {
      const device = await getDeviceDetails();
      return authService.socialLogin({ ...data, device });
    },
  });
};

export const useDeleteMe = () => {
  return useMutation({
    mutationFn: (data: DeleteMeRequest) => authService.deleteMe(data),
  });
};

export const useMyNotifications = () => {
  return useQuery({
    queryKey: ['myNotifications'],
    queryFn: authService.getMyNotifications,
  });
};

export const useDeleteMyNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.deleteMyNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myNotifications'] });
    }
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (data: Omit<UpdatePasswordRequest, 'device'>) => {
      const device = await getDeviceDetails();
      return authService.updateMyPassword({ ...data, device });
    },
  });
};
