import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as theaterService from '../../services/theater.service';
import { Theater, CreateTheaterDto, TheaterQueryParams, Pagination, Screen } from '../../types/api.types';
import { extractErrorMessage } from '@/lib/toast';

interface TheaterState {
  theaters: Theater[];
  selectedTheater: Theater | null;
  screens: Screen[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TheaterState = {
  theaters: [],
  selectedTheater: null,
  screens: [],
  pagination: null,
  isLoading: false,
  error: null,
};

export const fetchTheaters = createAsyncThunk<
  { theaters: Theater[]; pagination: Pagination },
  TheaterQueryParams | undefined
>('theaters/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await theaterService.getAllTheaters(params);
    return {
      theaters: response.data.theaters as Theater[],
      pagination: response.data.pagination,
    };
  } catch (error: any) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to fetch theaters'));
  }
});

export const fetchTheaterById = createAsyncThunk<Theater, string>(
  'theaters/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await theaterService.getTheaterById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch theater'));
    }
  }
);

export const fetchScreensByTheater = createAsyncThunk<Screen[], string>(
  'theaters/fetchScreens',
  async (theaterId, { rejectWithValue }) => {
    try {
      const response = await theaterService.getScreensByTheater(theaterId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch screens'));
    }
  }
);

export const createTheater = createAsyncThunk<Theater, CreateTheaterDto>(
  'theaters/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await theaterService.createTheater(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to create theater'));
    }
  }
);

const theaterSlice = createSlice({
  name: 'theaters',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTheaters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTheaters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.theaters = action.payload.theaters;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTheaters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTheaterById.fulfilled, (state, action) => {
        state.selectedTheater = action.payload;
      })
      .addCase(fetchScreensByTheater.fulfilled, (state, action) => {
        state.screens = action.payload;
      })
      .addCase(createTheater.fulfilled, (state, action) => {
        state.theaters.unshift(action.payload);
      });
  },
});

export const { clearError } = theaterSlice.actions;
export default theaterSlice.reducer;
