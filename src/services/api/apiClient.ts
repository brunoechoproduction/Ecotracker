import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

if (__DEV__) {
  if ((global as any).originalXMLHttpRequest) {
    (global as any).XMLHttpRequest = (global as any).originalXMLHttpRequest;
    (global as any).FormData = (global as any).originalFormData;
  }
}

export const formatBaseUrl = (url?: string): string => {
  const raw = url?.trim() || 'https://main.d1s6ddufwl8qkb.amplifyapp.com';
  return raw.replace(/\/+$/, '').replace(/\/api\/v1\/?$/, '');
};

const BASE_URL = formatBaseUrl(process.env.EXPO_PUBLIC_API_URL);

let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => inMemoryAccessToken;

export const clearTokens = async () => {
  inMemoryAccessToken = null;
  await SecureStore.deleteItemAsync('refresh_token');
  await SecureStore.deleteItemAsync('access_token');
};

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─── Refresh Token Queue (prevents race conditions) ──────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

// ─── Shared Token Refresh Helper ─────────────────────────────────────────────
const refreshAccessTokenFlow = async (refreshToken: string): Promise<string> => {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    if (__DEV__) {
      console.log(`\n🔄 ──── TOKEN REFRESH ────`);
      console.log(`   Attempting to refresh access token...`);
    }

    // Use a fresh axios instance (not apiClient) to avoid interceptor loops
    const refreshResponse = await axios.post(
      `${BASE_URL}/api/v1/user/login`,
      {},
      {
        headers: {
          Authorization: `${refreshToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const newAccessToken = refreshResponse.data?.data?.token;
    const newRefreshToken = refreshResponse.data?.data?.refreshToken;

    if (newAccessToken) {
      inMemoryAccessToken = newAccessToken;
      await SecureStore.setItemAsync('access_token', newAccessToken);

      if (newRefreshToken) {
        await SecureStore.setItemAsync('refresh_token', newRefreshToken);
      }

      if (__DEV__) {
        console.log(`   ✅ Token refreshed successfully!`);
        console.log(`   🔑 New Access Token: ${newAccessToken.substring(0, 25)}...`);
      }

      processQueue(null, newAccessToken);
      return newAccessToken;
    } else {
      throw new Error('No token in refresh response');
    }
  } catch (refreshError) {
    if (__DEV__) {
      console.log(`   ❌ Token refresh failed!`, refreshError);
    }

    processQueue(refreshError, null);

    // Clear auth and redirect to login
    await clearTokens();
    await SecureStore.deleteItemAsync('user');
    router.replace('/(auth)/login');

    throw refreshError;
  } finally {
    isRefreshing = false;
  }
};

// ─── Request Interceptor: Attach access token ────────────────────────────────
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // If we don't have an access token, but we have a refresh token in SecureStore,
    // trigger a refresh to get a valid access token before sending the request.
    if (!inMemoryAccessToken && !config.url?.includes('/api/v1/user/login')) {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      if (refreshToken) {
        try {
          const newToken = await refreshAccessTokenFlow(refreshToken);
          config.headers.Authorization = newToken;
        } catch (refreshErr) {
          // If refresh fails, the flow handles it (clears auth and redirects to login).
          console.error('Pre-request token refresh failed:', refreshErr);
        }
      }
    } else if (inMemoryAccessToken) {
      config.headers.Authorization = inMemoryAccessToken;
    }

    // Debug logging in dev mode
    if (__DEV__) {
      console.log(`\n🌐 ──── API REQUEST ────`);
      console.log(`   ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      // console.log(`   📋 Headers:`, JSON.stringify(config.headers, null, 2));
      if (config.data) {
        console.log(`   📦 Body:`, JSON.stringify(config.data, null, 2));
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor: Handle 401/400 + token refresh ────────────────────────
apiClient.interceptors.response.use(
  (response) => {
    // Debug logging in dev mode
    if (__DEV__) {
      console.log(`\n✅ ──── API RESPONSE ────`);
      console.log(`   ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
      // console.log(`   📋 Headers:`, JSON.stringify(response.headers, null, 2));
      console.log(`   📦 Data:`, JSON.stringify(response.data, null, 2));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Debug logging in dev mode
    if (__DEV__) {
      console.log(`\n❌ ──── API ERROR ────`);
      console.log(`   ${error.response?.status || 'NETWORK_ERROR'} ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`);
      if (error.response?.headers) {
        // console.log(`   📋 Headers:`, JSON.stringify(error.response.headers, null, 2));
      }
      console.log(`   📦 Error:`, JSON.stringify(error.response?.data, null, 2));
      if (!error.response) {
        console.log(`   ⚠️ No response received - possible network/timeout issue`);
      }
    }

    const errorStatus = error.response?.status;
    const errorMessage = error.response?.data?.message || '';

    // Some endpoints return 400 Bad Request with "You are not logged in..." message when token is missing/expired.
    const isUnauthorized =
      errorStatus === 401 ||
      (errorStatus === 400 && errorMessage.toLowerCase().includes('not logged in'));

    // Only attempt refresh on unauthorized status and not already retried
    if (isUnauthorized && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const newToken = await refreshAccessTokenFlow(refreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = newToken;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
