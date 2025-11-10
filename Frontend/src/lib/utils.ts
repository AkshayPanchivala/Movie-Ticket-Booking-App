import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Display notification toast messages based on type
 * @param message - The message to display
 * @param type - Type of notification: 'success', 'error', 'info', 'warning', 'loading'
 * @returns Toast ID for dismissing if needed
 */
export const NotificationMessageToaster = (message: string, type: string) => {
  const options = {
    duration: type === 'error' || type === 'warning' ? 4000 : 3000,
    position: 'top-right' as const,
  };

  switch (type.toLowerCase()) {
    case 'success':
      return toast.success(message, options);

    case 'error':
      return toast.error(message, options);

    case 'info':
      return toast.info(message, options);

    case 'warning':
      return toast.warning(message, options);

    case 'loading':
      return toast.loading(message, { position: 'top-right' });

    default:
      return toast(message, options);
  }
};
