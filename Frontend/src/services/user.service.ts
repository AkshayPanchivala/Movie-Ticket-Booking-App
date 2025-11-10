import { get, put, post } from './api.service';
import {
  User,
  UserQueryParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api.types';

const BASE_URL = '/users';

// Create user by admin (Super Admin) - doesn't return auth tokens
export const createUserByAdmin = async (data: {
  email: string;
  password: string;
  full_name: string;
  role?: string;
  theater_id?: string;
}): Promise<ApiResponse<User>> => {
  return post<User>(BASE_URL, data);
};

// Get all users (Super Admin)
export const getAllUsers = async (params?: UserQueryParams): Promise<ApiResponse<PaginatedResponse<User>>> => {
  return get<PaginatedResponse<User>>(BASE_URL, { params });
};

// Update user role (Super Admin)
export const updateUserRole = async (
  userId: string,
  data: { role: string; theater_id?: string }
): Promise<ApiResponse<User>> => {
  return put<User>(`${BASE_URL}/${userId}/role`, data);
};

// Deactivate user (Super Admin)
export const deactivateUser = async (userId: string): Promise<ApiResponse<User>> => {
  return put<User>(`${BASE_URL}/${userId}/deactivate`);
};

// Activate user (Super Admin)
export const activateUser = async (userId: string): Promise<ApiResponse<User>> => {
  return put<User>(`${BASE_URL}/${userId}/activate`);
};

// Default export for backward compatibility
export default {
  createUserByAdmin,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  activateUser,
};
