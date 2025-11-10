// Database types (formerly from Supabase)

// Auth types (formerly from Supabase)
export type User = {
  id: string;
  email?: string;
  [key: string]: any;
};

export type Session = {
  user: User;
  access_token: string;
  [key: string]: any;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'theater_admin' | 'super_admin';
  theater_id: string | null;
  is_active: boolean;
  created_at: string;
};

export type Theater = {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
};

export type Movie = {
  id: string;
  title: string;
  poster_url: string;
  trailer_url: string | null;
  synopsis: string;
  genre: string[];
  movie_cast: string[];
  rating: number;
  runtime: number;
  release_date: string;
  is_active: boolean;
  created_at: string;
};

export type Screen = {
  id: string;
  theater_id: string;
  name: string;
  total_seats: number;
  rows: number;
  columns: number;
  is_active: boolean;
  created_at: string;
};

export type Show = {
  id: string;
  movie_id: string;
  screen_id: string;
  theater_id: string;
  show_date: string;
  show_time: string;
  price: number;
  is_active: boolean;
  created_at: string;
};

export type Seat = {
  id: string;
  screen_id: string;
  row: string;
  column: number;
  seat_number: string;
  seat_type: 'regular' | 'premium' | 'vip';
  is_active: boolean;
  created_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  show_id: string;
  booking_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};

export type BookingSeat = {
  id: string;
  booking_id: string;
  seat_id: string;
  show_id: string;
  created_at: string;
};
