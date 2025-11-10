import { get } from './api.service';
import { ApiResponse } from '@/types/api.types';

export interface AppConfig {
  platform_fee: number;
  currency: string;
  currency_symbol: string;
}

const BASE_URL = '/config';

// Get app configuration
export const getConfig = async (): Promise<ApiResponse<AppConfig>> => {
  return get<AppConfig>(BASE_URL);
};

export default {
  getConfig,
};
