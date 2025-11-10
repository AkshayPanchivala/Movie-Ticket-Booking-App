import { get, post, put, del } from './api.service';
import {
  Movie,
  CreateMovieDto,
  MovieQueryParams,
  PaginatedResponse,
  ApiResponse,
  Show,
  ShowQueryParams,
} from '@/types/api.types';

const BASE_URL = '/movies';

// Get all movies with pagination and filters
export const getAllMovies = async (params?: MovieQueryParams): Promise<ApiResponse<PaginatedResponse<Movie>>> => {
  return get<PaginatedResponse<Movie>>(BASE_URL, { params });
};

// Get movie by ID
export const getMovieById = async (id: string): Promise<ApiResponse<Movie>> => {
  return get<Movie>(`${BASE_URL}/${id}`);
};

// Create movie (Admin)
export const createMovie = async (data: CreateMovieDto): Promise<ApiResponse<Movie>> => {
  return post<Movie>(BASE_URL, data);
};

// Update movie (Admin)
export const updateMovie = async (id: string, data: Partial<CreateMovieDto>): Promise<ApiResponse<Movie>> => {
  return put<Movie>(`${BASE_URL}/${id}`, data);
};

// Delete movie (Super Admin)
export const deleteMovie = async (id: string): Promise<ApiResponse<void>> => {
  return del<void>(`${BASE_URL}/${id}`);
};

// Get shows for a movie
export const getShowsByMovie = async (movieId: string, params?: ShowQueryParams): Promise<ApiResponse<Show[]>> => {
  return get<Show[]>(`${BASE_URL}/${movieId}/shows`, { params });
};

// Default export for backward compatibility
export default {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getShowsByMovie,
};
