import {
  Profile,
  Theater,
  Movie,
  Screen,
  Show,
  Seat,
  Booking,
  BookingSeat,
  User,
  Session,
} from '@/lib/types';

// Dummy Users
export const dummyUsers: User[] = [
  {
    id: 'user-1',
    email: 'user@example.com',
  },
  {
    id: 'user-2',
    email: 'admin@example.com',
  },
  {
    id: 'user-3',
    email: 'superadmin@example.com',
  },
];

// Dummy Profiles
export const dummyProfiles: Profile[] = [
  {
    id: 'user-1',
    email: 'user@example.com',
    full_name: 'John Doe',
    role: 'user',
    theater_id: null,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    email: 'admin@example.com',
    full_name: 'Jane Admin',
    role: 'theater_admin',
    theater_id: 'theater-1',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-3',
    email: 'superadmin@example.com',
    full_name: 'Super Admin',
    role: 'super_admin',
    theater_id: null,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
];

// Dummy Theaters
export const dummyTheaters: Theater[] = [
  {
    id: 'theater-1',
    name: 'Cineplex Downtown',
    location: 'Downtown',
    city: 'New York',
    address: '123 Broadway Street, New York, NY 10001',
    contact_phone: '+1-555-0101',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'theater-2',
    name: 'Galaxy Multiplex',
    location: 'Uptown',
    city: 'New York',
    address: '456 Madison Avenue, New York, NY 10022',
    contact_phone: '+1-555-0102',
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'theater-3',
    name: 'Star Cinema',
    location: 'Brooklyn',
    city: 'New York',
    address: '789 Atlantic Ave, Brooklyn, NY 11238',
    contact_phone: '+1-555-0103',
    is_active: true,
    created_at: '2024-01-03T00:00:00Z',
  },
];

// Dummy Movies
export const dummyMovies: Movie[] = [
  {
    id: 'movie-1',
    title: 'The Quantum Paradox',
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
    trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    synopsis:
      'A brilliant physicist discovers a way to manipulate time, but soon realizes that every change has devastating consequences across parallel universes. A thrilling sci-fi adventure that questions the nature of reality.',
    genre: ['Sci-Fi', 'Thriller', 'Drama'],
    movie_cast: ['Emma Stone', 'Ryan Gosling', 'Michael B. Jordan', 'Tessa Thompson'],
    rating: 8.5,
    runtime: 142,
    release_date: '2024-03-15',
    is_active: true,
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'movie-2',
    title: 'Echoes of Tomorrow',
    poster_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
    trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    synopsis:
      'In a dystopian future where memories can be extracted and sold, a memory thief discovers a secret that could bring down the entire system. A gripping cyberpunk thriller.',
    genre: ['Action', 'Sci-Fi', 'Mystery'],
    movie_cast: ['Chris Hemsworth', 'Zendaya', 'Oscar Isaac', 'Florence Pugh'],
    rating: 8.2,
    runtime: 128,
    release_date: '2024-04-20',
    is_active: true,
    created_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'movie-3',
    title: 'Moonlight Sonata',
    poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
    trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    synopsis:
      'A touching story of a young pianist who overcomes personal tragedy to perform at Carnegie Hall. An emotional journey of resilience and the power of music.',
    genre: ['Drama', 'Music', 'Biography'],
    movie_cast: ['Timoth�e Chalamet', 'Saoirse Ronan', 'Viola Davis', 'Mahershala Ali'],
    rating: 9.1,
    runtime: 135,
    release_date: '2024-05-10',
    is_active: true,
    created_at: '2024-03-01T00:00:00Z',
  },
  {
    id: 'movie-4',
    title: 'Shadow Warriors',
    poster_url: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
    trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    synopsis:
      'An elite team of special forces operatives must stop a global terrorist organization from unleashing a deadly bioweapon. Non-stop action and explosive set pieces.',
    genre: ['Action', 'Thriller', 'Adventure'],
    movie_cast: ['Dwayne Johnson', 'Charlize Theron', 'Idris Elba', 'Gal Gadot'],
    rating: 7.8,
    runtime: 118,
    release_date: '2024-06-01',
    is_active: true,
    created_at: '2024-03-15T00:00:00Z',
  },
  {
    id: 'movie-5',
    title: 'The Last Garden',
    poster_url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400',
    trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    synopsis:
      'In a world where nature has been destroyed, a botanist discovers the last living garden and must protect it from corporate greed. A stunning visual masterpiece with an environmental message.',
    genre: ['Fantasy', 'Adventure', 'Drama'],
    movie_cast: ['Lupita Nyongo', 'Benedict Cumberbatch', 'Awkwafina', 'Dev Patel'],
    rating: 8.7,
    runtime: 145,
    release_date: '2024-07-15',
    is_active: true,
    created_at: '2024-04-01T00:00:00Z',
  },
  {
    id: 'movie-6',
    title: 'Comedy Central',
    poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
    trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    synopsis:
      'A struggling comedian gets one last chance to make it big when a famous director offers him a role in a major film. Hilarious mishaps ensue as he tries to balance his old life with new fame.',
    genre: ['Comedy', 'Romance'],
    movie_cast: ['Kevin Hart', 'Jennifer Lawrence', 'Seth Rogen', 'Rebel Wilson'],
    rating: 7.5,
    runtime: 108,
    release_date: '2024-08-05',
    is_active: true,
    created_at: '2024-04-15T00:00:00Z',
  },
];

// Dummy Screens
export const dummyScreens: Screen[] = [
  {
    id: 'screen-1',
    theater_id: 'theater-1',
    name: 'Screen 1 - IMAX',
    total_seats: 120,
    rows: 10,
    columns: 12,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'screen-2',
    theater_id: 'theater-1',
    name: 'Screen 2 - Standard',
    total_seats: 80,
    rows: 8,
    columns: 10,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'screen-3',
    theater_id: 'theater-2',
    name: 'Screen 1 - Premium',
    total_seats: 100,
    rows: 10,
    columns: 10,
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'screen-4',
    theater_id: 'theater-2',
    name: 'Screen 2 - Standard',
    total_seats: 90,
    rows: 9,
    columns: 10,
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'screen-5',
    theater_id: 'theater-3',
    name: 'Screen 1',
    total_seats: 70,
    rows: 7,
    columns: 10,
    is_active: true,
    created_at: '2024-01-03T00:00:00Z',
  },
];

// Generate seats for screens
const generateSeats = (screenId: string, rows: number, columns: number): Seat[] => {
  const seats: Seat[] = [];
  const rowLabels = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));

  rowLabels.forEach((row, rowIndex) => {
    for (let col = 1; col <= columns; col++) {
      let seatType: 'regular' | 'premium' | 'vip' = 'regular';

      // Last 2 rows are VIP
      if (rowIndex >= rows - 2) {
        seatType = 'vip';
      }
      // Middle rows are premium
      else if (rowIndex >= Math.floor(rows / 3) && rowIndex < rows - 2) {
        seatType = 'premium';
      }

      seats.push({
        id: `seat-${screenId}-${row}${col}`,
        screen_id: screenId,
        row,
        column: col,
        seat_number: `${row}${col}`,
        seat_type: seatType,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
      });
    }
  });

  return seats;
};

// Dummy Seats for all screens
export const dummySeats: Seat[] = [
  ...generateSeats('screen-1', 10, 12),
  ...generateSeats('screen-2', 8, 10),
  ...generateSeats('screen-3', 10, 10),
  ...generateSeats('screen-4', 9, 10),
  ...generateSeats('screen-5', 7, 10),
];

// Dummy Shows
export const dummyShows: Show[] = [
  // Theater 1 shows
  {
    id: 'show-1',
    movie_id: 'movie-1',
    screen_id: 'screen-1',
    theater_id: 'theater-1',
    show_date: '2025-10-30',
    show_time: '10:00',
    price: 15.99,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'show-2',
    movie_id: 'movie-1',
    screen_id: 'screen-1',
    theater_id: 'theater-1',
    show_date: '2025-10-30',
    show_time: '14:00',
    price: 15.99,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'show-3',
    movie_id: 'movie-2',
    screen_id: 'screen-2',
    theater_id: 'theater-1',
    show_date: '2025-10-30',
    show_time: '11:30',
    price: 12.99,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'show-4',
    movie_id: 'movie-3',
    screen_id: 'screen-2',
    theater_id: 'theater-1',
    show_date: '2025-10-31',
    show_time: '18:00',
    price: 12.99,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  // Theater 2 shows
  {
    id: 'show-5',
    movie_id: 'movie-1',
    screen_id: 'screen-3',
    theater_id: 'theater-2',
    show_date: '2025-10-30',
    show_time: '12:00',
    price: 14.99,
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'show-6',
    movie_id: 'movie-4',
    screen_id: 'screen-3',
    theater_id: 'theater-2',
    show_date: '2025-10-30',
    show_time: '20:00',
    price: 14.99,
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'show-7',
    movie_id: 'movie-5',
    screen_id: 'screen-4',
    theater_id: 'theater-2',
    show_date: '2025-10-31',
    show_time: '15:30',
    price: 13.99,
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
  },
  // Theater 3 shows
  {
    id: 'show-8',
    movie_id: 'movie-6',
    screen_id: 'screen-5',
    theater_id: 'theater-3',
    show_date: '2025-10-31',
    show_time: '13:00',
    price: 11.99,
    is_active: true,
    created_at: '2024-01-03T00:00:00Z',
  },
  {
    id: 'show-9',
    movie_id: 'movie-2',
    screen_id: 'screen-5',
    theater_id: 'theater-3',
    show_date: '2025-11-01',
    show_time: '19:00',
    price: 11.99,
    is_active: true,
    created_at: '2024-01-03T00:00:00Z',
  },
];

// Dummy Bookings
export const dummyBookings: Booking[] = [
  {
    id: 'booking-1',
    user_id: 'user-1',
    show_id: 'show-1',
    booking_date: '2024-10-25T10:30:00Z',
    total_amount: 47.97,
    status: 'confirmed',
    created_at: '2024-10-25T10:30:00Z',
  },
  {
    id: 'booking-2',
    user_id: 'user-1',
    show_id: 'show-3',
    booking_date: '2024-10-26T14:15:00Z',
    total_amount: 25.98,
    status: 'confirmed',
    created_at: '2024-10-26T14:15:00Z',
  },
  {
    id: 'booking-3',
    user_id: 'user-1',
    show_id: 'show-5',
    booking_date: '2024-10-27T09:00:00Z',
    total_amount: 29.98,
    status: 'pending',
    created_at: '2024-10-27T09:00:00Z',
  },
];

// Dummy Booking Seats
export const dummyBookingSeats: BookingSeat[] = [
  {
    id: 'booking-seat-1',
    booking_id: 'booking-1',
    seat_id: 'seat-screen-1-E5',
    show_id: 'show-1',
    created_at: '2024-10-25T10:30:00Z',
  },
  {
    id: 'booking-seat-2',
    booking_id: 'booking-1',
    seat_id: 'seat-screen-1-E6',
    show_id: 'show-1',
    created_at: '2024-10-25T10:30:00Z',
  },
  {
    id: 'booking-seat-3',
    booking_id: 'booking-1',
    seat_id: 'seat-screen-1-E7',
    show_id: 'show-1',
    created_at: '2024-10-25T10:30:00Z',
  },
  {
    id: 'booking-seat-4',
    booking_id: 'booking-2',
    seat_id: 'seat-screen-2-D5',
    show_id: 'show-3',
    created_at: '2024-10-26T14:15:00Z',
  },
  {
    id: 'booking-seat-5',
    booking_id: 'booking-2',
    seat_id: 'seat-screen-2-D6',
    show_id: 'show-3',
    created_at: '2024-10-26T14:15:00Z',
  },
  {
    id: 'booking-seat-6',
    booking_id: 'booking-3',
    seat_id: 'seat-screen-3-F4',
    show_id: 'show-5',
    created_at: '2024-10-27T09:00:00Z',
  },
  {
    id: 'booking-seat-7',
    booking_id: 'booking-3',
    seat_id: 'seat-screen-3-F5',
    show_id: 'show-5',
    created_at: '2024-10-27T09:00:00Z',
  },
];

// Dummy Session
export const dummySession: Session = {
  user: dummyUsers[0],
  access_token: 'dummy-access-token',
};

// Helper functions to get data
export const getMovies = () => dummyMovies.filter((m) => m.is_active);
export const getMovieById = (id: string) => dummyMovies.find((m) => m.id === id);

export const getTheaters = () => dummyTheaters.filter((t) => t.is_active);
export const getTheaterById = (id: string) => dummyTheaters.find((t) => t.id === id);

export const getScreensByTheaterId = (theaterId: string) =>
  dummyScreens.filter((s) => s.theater_id === theaterId && s.is_active);

export const getScreenById = (id: string) => dummyScreens.find((s) => s.id === id);

export const getSeatsByScreenId = (screenId: string) =>
  dummySeats.filter((s) => s.screen_id === screenId && s.is_active);

export const getShowsByMovieId = (movieId: string) =>
  dummyShows.filter((s) => s.movie_id === movieId && s.is_active);

export const getShowsByTheaterId = (theaterId: string) =>
  dummyShows.filter((s) => s.theater_id === theaterId && s.is_active);

export const getShowById = (id: string) => dummyShows.find((s) => s.id === id);

export const getBookingsByUserId = (userId: string) =>
  dummyBookings.filter((b) => b.user_id === userId);

export const getBookingSeatsByShowId = (showId: string) =>
  dummyBookingSeats.filter((bs) => bs.show_id === showId);

export const getProfileByEmail = (email: string) =>
  dummyProfiles.find((p) => p.email === email);

export const getUserByEmail = (email: string) =>
  dummyUsers.find((u) => u.email === email);
