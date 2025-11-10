import { get, post, put, del } from './api.service';
import {
  Show,
  CreateShowDto,
  ApiResponse,
  ShowSeatsResponse,
  PaginatedResponse,
} from '@/types/api.types';

const BASE_URL = '/shows';

export interface ShowQueryParams {
  theater_id?: string;
  movie_id?: string;
  screen_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

// Get all shows with filters
export const getAllShows = async (params?: ShowQueryParams): Promise<ApiResponse<PaginatedResponse<Show>>> => {
  return get<PaginatedResponse<Show>>(BASE_URL, { params });
};

// Get show by ID
export const getShowById = async (id: string): Promise<ApiResponse<Show>> => {
  return get<Show>(`${BASE_URL}/${id}`);
};

// Create show (Admin)
export const createShow = async (data: CreateShowDto): Promise<ApiResponse<Show>> => {
  return post<Show>(BASE_URL, data);
};

// Update show (Admin)
export const updateShow = async (id: string, data: Partial<CreateShowDto>): Promise<ApiResponse<Show>> => {
  return put<Show>(`${BASE_URL}/${id}`, data);
};

// Delete show (Admin)
export const deleteShow = async (id: string): Promise<ApiResponse<void>> => {
  return del<void>(`${BASE_URL}/${id}`);
};

// Get available seats for show
export const getAvailableSeats = async (showId: string): Promise<ApiResponse<ShowSeatsResponse>> => {
  return get<ShowSeatsResponse>(`${BASE_URL}/${showId}/seats`);
};

// Default export for backward compatibility
export default {
  getAllShows,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
  getAvailableSeats,
};
