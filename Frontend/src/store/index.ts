import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import bookingReducer from './slices/bookingSlice';
import theaterReducer from './slices/theaterSlice';
import showReducer from './slices/showSlice';
import { errorMiddleware } from './middleware/errorMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    bookings: bookingReducer,
    theaters: theaterReducer,
    shows: showReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(errorMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
