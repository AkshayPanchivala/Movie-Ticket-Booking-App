import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as bookingService from '../../services/booking.service';
import { Booking, CreateBookingDto, BookingQueryParams, Pagination } from '../../types/api.types';
import { extractErrorMessage } from '@/lib/toast';

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  pagination: Pagination | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  selectedBooking: null,
  pagination: null,
  isLoading: false,
  isCreating: false,
  error: null,
};

export const fetchUserBookings = createAsyncThunk<
  { bookings: Booking[]; pagination: Pagination },
  BookingQueryParams | undefined
>('bookings/fetchUserBookings', async (params, { rejectWithValue }) => {
  try {
    const response = await bookingService.getUserBookings(params);
    return {
      bookings: response.data.bookings as Booking[],
      pagination: response.data.pagination,
    };
  } catch (error: any) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to fetch bookings'));
  }
});

export const fetchBookingById = createAsyncThunk<Booking, string>(
  'bookings/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingService.getBookingById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch booking'));
    }
  }
);

export const createBooking = createAsyncThunk<Booking, CreateBookingDto>(
  'bookings/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await bookingService.createBooking(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to create booking'));
    }
  }
);

export const cancelBooking = createAsyncThunk<Booking, string>(
  'bookings/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingService.cancelBooking(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to cancel booking'));
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.bookings;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBookingById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createBooking.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isCreating = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export const { clearError, clearSelectedBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
