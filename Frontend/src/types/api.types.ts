// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  [key: string]: T[] | Pagination;
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'theater_admin' | 'super_admin';
  theater_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    full_name?: string;
  };
  token: string;
  profile: User;
}

// Movie Types
export interface Movie {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  trailer_url?: string;
  director: string;
  genre: string[];
  language: string;
  duration: number;
  movie_cast: string[];
  rating: number;
  runtime: number;
  release_date: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateMovieDto {
  title: string;
  description: string;
  poster_url: string;
  trailer_url?: string;
  director: string;
  genre: string[];
  language: string;
  duration: number;
  movie_cast?: string[];
  rating?: number;
  runtime: number;
  release_date: string;
}

// Theater Types
export interface Theater {
  id: string;
  name: string;
  location: string;
  city: string;
  total_screens: number;
  facilities: string[];
  is_active: boolean;
  created_at: string;
  screens?: Screen[];
}

export interface CreateTheaterDto {
  name: string;
  location: string;
  city: string;
  total_screens: number;
  facilities?: string[];
}

// Screen Types
export interface Screen {
  id: string;
  theater_id: string;
  name: string;
  total_seats: number;
  rows: number;
  columns: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateScreenDto {
  theater_id: string;
  name: string;
  total_seats: number;
  rows: number;
  columns: number;
}

// Seat Types
export interface Seat {
  id: string;
  screen_id: string;
  row: string;
  column: number;
  seat_number: string;
  seat_type: 'regular' | 'premium' | 'vip';
  is_active: boolean;
  created_at?: string;
}

export interface SeatWithBookingStatus extends Seat {
  is_booked: boolean;
}

export interface CreateSeatsDto {
  seats: Array<{
    row: string;
    column: number;
    seat_type: 'regular' | 'premium' | 'vip';
  }>;
}

// Show Types
export interface Show {
  id: string;
  movie_id: string;
  screen_id: string;
  theater_id: string;
  show_date: string;
  show_time: string;
  price: number;
  is_active: boolean;
  created_at: string;
  movie?: Movie;
  theater?: Theater;
  screen?: Screen;
}

export interface CreateShowDto {
  movie_id: string;
  screen_id: string;
  theater_id: string;
  show_date: string;
  show_time: string;
  price: number;
}

export interface ShowSeatsResponse {
  show: {
    id: string;
    movie_id: string;
    show_date: string;
    show_time: string;
  };
  seats: SeatWithBookingStatus[];
}

// Booking Types
export interface Booking {
  id: string;
  user_id: string;
  show_id: string;
  booking_date: string;
  total_amount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  payment_method: 'card' | 'upi' | 'netbanking' | 'wallet';
  payment_details: Record<string, any>;
  created_at: string;
  show?: Show;
  booking_seats?: BookingSeat[];
}

export interface BookingSeat {
  id: string;
  seat: {
    seat_number: string;
  };
}

export interface CreateBookingDto {
  show_id: string;
  seat_ids: string[];
  payment_method: 'card' | 'upi' | 'netbanking' | 'wallet';
  payment_details: Record<string, any>;
}

// Analytics Types
export interface DashboardAnalytics {
  overview: {
    total_bookings: number;
    total_revenue: number;
    total_users: number;
    total_movies: number;
    total_theaters: number;
    total_shows: number;
  };
  bookings_by_date: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
  popular_movies: Array<{
    movie_id: string;
    title: string;
    total_bookings: number;
    revenue: number;
  }>;
  theater_performance: Array<{
    theater_id: string;
    name: string;
    total_bookings: number;
    revenue: number;
    occupancy_rate: number;
  }>;
}

export interface SalesReport {
  summary: {
    total_bookings: number;
    total_revenue: number;
    average_ticket_price: number;
    total_seats_sold: number;
  };
  sales_by_period: Array<{
    period: string;
    bookings: number;
    revenue: number;
    seats_sold: number;
  }>;
}

// Query Params
export interface MovieQueryParams extends PaginationParams {
  genre?: string;
  search?: string;
}

export interface TheaterQueryParams extends PaginationParams {
  city?: string;
}

export interface ShowQueryParams {
  theater_id?: string;
  date?: string;
  city?: string;
}

export interface BookingQueryParams extends PaginationParams {
  status?: 'confirmed' | 'cancelled' | 'completed';
  theater_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface UserQueryParams extends PaginationParams {
  role?: 'user' | 'theater_admin' | 'super_admin';
  search?: string;
}

export interface AnalyticsQueryParams {
  theater_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface SalesQueryParams extends AnalyticsQueryParams {
  group_by?: 'daily' | 'weekly' | 'monthly';
}
