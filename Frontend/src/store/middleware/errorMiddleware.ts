import { Middleware } from '@reduxjs/toolkit';
import { showErrorToast, extractErrorMessage } from '@/lib/toast';

/**
 * Redux middleware to show toast notifications for rejected async thunks
 */
export const errorMiddleware: Middleware = () => (next) => (action) => {
  // Check if this is a rejected async thunk action
  if (action.type?.endsWith('/rejected')) {
    // Extract error message using utility function
    const errorMessage = extractErrorMessage(
      action.payload || action.error,
      'An error occurred'
    );

    // Exclude auth/logout rejections (they're handled separately)
    if (!action.type.includes('auth/logout')) {
      showErrorToast(errorMessage);
    }
  }

  return next(action);
};
