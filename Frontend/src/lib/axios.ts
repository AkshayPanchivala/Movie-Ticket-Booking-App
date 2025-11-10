import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '@/types/api.types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Create axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Token management helpers
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_profile');
};

// Handle unauthorized access
const handleUnauthorized = (): void => {
  // Clear token and redirect to login
  removeToken();

  // Dispatch logout event
  window.dispatchEvent(new Event('unauthorized'));

  // Redirect to login if not already there
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token to requests
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      // Log error in development
      if (import.meta.env.DEV) {
        console.error(`[API Error] ${status}:`, errorData);
      }

      // Handle 401 Unauthorized - logout user
      if (status === 401) {
        handleUnauthorized();
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.warn('Access forbidden - insufficient permissions');
      }

      // Handle 429 Rate Limit
      if (status === 429) {
        console.warn('Rate limit exceeded - please try again later');
      }

      return Promise.reject(errorData);
    } else if (error.request) {
      // Request was made but no response received
      console.error('[API Error] No response received:', error.request);
      return Promise.reject({
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error - please check your connection',
        },
      } as ApiError);
    } else {
      // Something else happened
      console.error('[API Error]', error.message);
      return Promise.reject({
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: error.message || 'An unknown error occurred',
        },
      } as ApiError);
    }
  }
);

export default axiosInstance;
