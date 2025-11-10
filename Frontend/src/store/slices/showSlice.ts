import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as showService from '../../services/show.service';
import * as movieService from '../../services/movie.service';
import { Show, ShowSeatsResponse, CreateShowDto, ShowQueryParams } from '../../types/api.types';
import { extractErrorMessage } from '@/lib/toast';

interface ShowState {
  shows: Show[];
  selectedShow: Show | null;
  availableSeats: ShowSeatsResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ShowState = {
  shows: [],
  selectedShow: null,
  availableSeats: null,
  isLoading: false,
  error: null,
};

export const fetchShowsByMovie = createAsyncThunk<Show[], { movieId: string; params?: ShowQueryParams }>(
  'shows/fetchByMovie',
  async ({ movieId, params }, { rejectWithValue }) => {
    try {
      const response = await movieService.getShowsByMovie(movieId, params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch shows'));
    }
  }
);

export const fetchShowById = createAsyncThunk<Show, string>(
  'shows/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await showService.getShowById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch show'));
    }
  }
);

export const fetchAvailableSeats = createAsyncThunk<ShowSeatsResponse, string>(
  'shows/fetchAvailableSeats',
  async (showId, { rejectWithValue }) => {
    try {
      const response = await showService.getAvailableSeats(showId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch available seats'));
    }
  }
);

export const createShow = createAsyncThunk<Show, CreateShowDto>(
  'shows/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await showService.createShow(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to create show'));
    }
  }
);

const showSlice = createSlice({
  name: 'shows',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAvailableSeats: (state) => {
      state.availableSeats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShowsByMovie.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShowsByMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shows = action.payload;
      })
      .addCase(fetchShowsByMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchShowById.fulfilled, (state, action) => {
        state.selectedShow = action.payload;
      })
      .addCase(fetchAvailableSeats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAvailableSeats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableSeats = action.payload;
      })
      .addCase(fetchAvailableSeats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createShow.fulfilled, (state, action) => {
        state.shows.unshift(action.payload);
      });
  },
});

export const { clearError, clearAvailableSeats } = showSlice.actions;
export default showSlice.reducer;
