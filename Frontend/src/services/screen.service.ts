import { get, post, put, del } from './api.service';
import {
  Screen,
  CreateScreenDto,
  ApiResponse,
  Seat,
  CreateSeatsDto,
} from '@/types/api.types';

const BASE_URL = '/screens';

// Get screen by ID
export const getScreenById = async (id: string): Promise<ApiResponse<Screen>> => {
  return get<Screen>(`${BASE_URL}/${id}`);
};

// Create screen (Admin)
export const createScreen = async (data: CreateScreenDto): Promise<ApiResponse<Screen>> => {
  return post<Screen>(BASE_URL, data);
};

// Update screen (Admin)
export const updateScreen = async (id: string, data: Partial<CreateScreenDto>): Promise<ApiResponse<Screen>> => {
  return put<Screen>(`${BASE_URL}/${id}`, data);
};

// Delete screen (Admin)
export const deleteScreen = async (id: string): Promise<ApiResponse<void>> => {
  return del<void>(`${BASE_URL}/${id}`);
};

// Get seats by screen
export const getSeatsByScreen = async (screenId: string): Promise<ApiResponse<Seat[]>> => {
  return get<Seat[]>(`${BASE_URL}/${screenId}/seats`);
};

// Create seats in bulk (Admin)
export const createSeatsBulk = async (screenId: string, data: CreateSeatsDto): Promise<ApiResponse<Seat[]>> => {
  return post<Seat[]>(`${BASE_URL}/${screenId}/seats/bulk`, data);
};

// Default export for backward compatibility
export default {
  getScreenById,
  createScreen,
  updateScreen,
  deleteScreen,
  getSeatsByScreen,
  createSeatsBulk,
};
