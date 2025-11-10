import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as movieService from '../../services/movie.service';
import { Movie, CreateMovieDto, MovieQueryParams, Pagination } from '../../types/api.types';
import { extractErrorMessage } from '@/lib/toast';

interface MovieState {
  movies: Movie[];
  selectedMovie: Movie | null;
  pagination: Pagination | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movies: [],
  selectedMovie: null,
  pagination: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

// Async thunks
export const fetchMovies = createAsyncThunk<
  { movies: Movie[]; pagination: Pagination },
  MovieQueryParams | undefined
>('movies/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await movieService.getAllMovies(params);
    return {
      movies: response.data.movies as Movie[],
      pagination: response.data.pagination,
    };
  } catch (error: any) {
    return rejectWithValue(extractErrorMessage(error, 'Failed to fetch movies'));
  }
});

export const fetchMovieById = createAsyncThunk<Movie, string>(
  'movies/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await movieService.getMovieById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to fetch movie'));
    }
  }
);

export const createMovie = createAsyncThunk<Movie, CreateMovieDto>(
  'movies/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await movieService.createMovie(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to create movie'));
    }
  }
);

export const updateMovie = createAsyncThunk<Movie, { id: string; data: Partial<CreateMovieDto> }>(
  'movies/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await movieService.updateMovie(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to update movie'));
    }
  }
);

export const deleteMovie = createAsyncThunk<string, string>(
  'movies/delete',
  async (id, { rejectWithValue }) => {
    try {
      await movieService.deleteMovie(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to delete movie'));
    }
  }
);

// Slice
const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all movies
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movies = action.payload.movies;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch movie by ID
    builder
      .addCase(fetchMovieById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create movie
    builder
      .addCase(createMovie.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.isCreating = false;
        state.movies.unshift(action.payload);
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Update movie
    builder
      .addCase(updateMovie.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.movies.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
        if (state.selectedMovie?.id === action.payload.id) {
          state.selectedMovie = action.payload;
        }
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete movie
    builder
      .addCase(deleteMovie.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.movies = state.movies.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedMovie } = movieSlice.actions;
export default movieSlice.reducer;
