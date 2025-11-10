import { get, post, put, del } from './api.service';
import {
  Theater,
  CreateTheaterDto,
  TheaterQueryParams,
  PaginatedResponse,
  ApiResponse,
  Screen,
} from '@/types/api.types';

const BASE_URL = '/theaters';

// Get all theaters with pagination and filters
export const getAllTheaters = async (params?: TheaterQueryParams): Promise<ApiResponse<PaginatedResponse<Theater>>> => {
  return get<PaginatedResponse<Theater>>(BASE_URL, { params });
};

// Get theater by ID
export const getTheaterById = async (id: string): Promise<ApiResponse<Theater>> => {
  return get<Theater>(`${BASE_URL}/${id}`);
};

// Create theater (Super Admin)
export const createTheater = async (data: CreateTheaterDto): Promise<ApiResponse<Theater>> => {
  return post<Theater>(BASE_URL, data);
};

// Update theater (Super Admin)
export const updateTheater = async (id: string, data: Partial<CreateTheaterDto>): Promise<ApiResponse<Theater>> => {
  return put<Theater>(`${BASE_URL}/${id}`, data);
};

// Delete theater (Super Admin)
export const deleteTheater = async (id: string): Promise<ApiResponse<void>> => {
  return del<void>(`${BASE_URL}/${id}`);
};

// Get screens by theater
export const getScreensByTheater = async (theaterId: string): Promise<ApiResponse<Screen[]>> => {
  return get<Screen[]>(`${BASE_URL}/${theaterId}/screens`);
};

// Default export for backward compatibility
export default {
  getAllTheaters,
  getTheaterById,
  createTheater,
  updateTheater,
  deleteTheater,
  getScreensByTheater,
};
