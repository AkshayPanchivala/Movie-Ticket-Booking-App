import { toast } from 'sonner';

/**
 * Display an error message in a toast notification
 * @param error - Error message string or error object from API
 * @param fallbackMessage - Optional fallback message if error is undefined
 */
export const showErrorToast = (error: any, fallbackMessage: string = 'An error occurred'): void => {
  let errorMessage = fallbackMessage;

  // Handle different error formats
  if (typeof error === 'string') {
    // Direct string message
    errorMessage = error;
  } else if (error?.error?.message) {
    // API error format: { error: { message: string, code: string } }
    errorMessage = error.error.message;
  } else if (error?.message) {
    // Standard Error object or { message: string }
    errorMessage = error.message;
  } else if (error?.data?.error?.message) {
    // Nested API error format
    errorMessage = error.data.error.message;
  }

  toast.error(errorMessage, {
    duration: 4000,
    position: 'top-right',
  });
};

/**
 * Display a success message in a toast notification
 * @param message - Success message to display
 */
export const showSuccessToast = (message: string): void => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  });
};

/**
 * Display an info message in a toast notification
 * @param message - Info message to display
 */
export const showInfoToast = (message: string): void => {
  toast.info(message, {
    duration: 3000,
    position: 'top-right',
  });
};

/**
 * Display a warning message in a toast notification
 * @param message - Warning message to display
 */
export const showWarningToast = (message: string): void => {
  toast.warning(message, {
    duration: 4000,
    position: 'top-right',
  });
};

/**
 * Display a loading toast and return a function to dismiss it
 * @param message - Loading message to display
 * @returns Function to dismiss the loading toast
 */
export const showLoadingToast = (message: string = 'Loading...'): (() => void) => {
  const toastId = toast.loading(message, {
    position: 'top-right',
  });

  // Return dismiss function
  return () => toast.dismiss(toastId);
};

/**
 * Handle API errors and display appropriate toast message
 * Useful for handling errors from API service calls
 * @param error - Error object from API
 * @param customMessage - Optional custom message to display instead of API error
 */
export const handleApiError = (error: any, customMessage?: string): void => {
  if (customMessage) {
    showErrorToast(customMessage);
    return;
  }

  // Log error in development
  if (import.meta.env.DEV) {
    console.error('[API Error]:', error);
  }

  showErrorToast(error);
};

/**
 * Extract error message from any error format
 * @param error - Error in any format
 * @param fallback - Fallback message if no error message found
 * @returns Extracted error message string
 */
export const extractErrorMessage = (error: any, fallback: string = 'An error occurred'): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.error?.message) {
    return error.error.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.data?.error?.message) {
    return error.data.error.message;
  }

  return fallback;
};
