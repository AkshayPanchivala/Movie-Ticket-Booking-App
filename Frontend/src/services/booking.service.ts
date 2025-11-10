import { get, post, put } from './api.service';
import {
  Booking,
  CreateBookingDto,
  BookingQueryParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api.types';

const BASE_URL = '/bookings';

// Create booking
export const createBooking = async (data: CreateBookingDto): Promise<ApiResponse<Booking>> => {
  return post<Booking>(BASE_URL, data);
};

// Get user bookings
export const getUserBookings = async (params?: BookingQueryParams): Promise<ApiResponse<PaginatedResponse<Booking>>> => {
  return get<PaginatedResponse<Booking>>(`${BASE_URL}/user`, { params });
};

// Get booking by ID
export const getBookingById = async (id: string): Promise<ApiResponse<Booking>> => {
  return get<Booking>(`${BASE_URL}/${id}`);
};

// Cancel booking
export const cancelBooking = async (id: string): Promise<ApiResponse<Booking>> => {
  return put<Booking>(`${BASE_URL}/${id}/cancel`);
};

// Get all bookings (Admin)
export const getAllBookings = async (params?: BookingQueryParams): Promise<ApiResponse<PaginatedResponse<Booking>>> => {
  return get<PaginatedResponse<Booking>>(BASE_URL, { params });
};

// Default export for backward compatibility
export default {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
};
