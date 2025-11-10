import { post, get, setToken, removeToken } from './api.service';
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
  ApiResponse,
} from '@/types/api.types';

const BASE_URL = '/auth';

// Register new user
export const register = async (credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> => {
  const response = await post<AuthResponse>(`${BASE_URL}/register`, credentials);

  // Save token
  if (response.success && response.data.token) {
    setToken(response.data.token);
    localStorage.setItem('user_profile', JSON.stringify(response.data.profile));
  }

  return response;
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
  const response = await post<AuthResponse>(`${BASE_URL}/login`, credentials);

  // Save token
  if (response.success && response.data.token) {
    setToken(response.data.token);
    localStorage.setItem('user_profile', JSON.stringify(response.data.profile));
  }

  return response;
};

// Logout user
export const logout = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await post<void>(`${BASE_URL}/logout`);
    removeToken();
    return response;
  } catch (error) {
    // Even if API call fails, clear local storage
    removeToken();
    throw error;
  }
};

// Get current user profile
export const getProfile = async (): Promise<ApiResponse<User>> => {
  return get<User>(`${BASE_URL}/profile`);
};

// Get stored user profile from localStorage
export const getStoredProfile = (): User | null => {
  const profile = localStorage.getItem('user_profile');
  return profile ? JSON.parse(profile) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

// Get stored token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Default export for backward compatibility
export default {
  register,
  login,
  logout,
  getProfile,
  getStoredProfile,
  isAuthenticated,
  getToken: getAuthToken,
};
