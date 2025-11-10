import { get } from './api.service';
import {
  DashboardAnalytics,
  SalesReport,
  AnalyticsQueryParams,
  SalesQueryParams,
  ApiResponse,
} from '@/types/api.types';

const BASE_URL = '/analytics';

// Get dashboard analytics (Admin)
export const getDashboardAnalytics = async (params?: AnalyticsQueryParams): Promise<ApiResponse<DashboardAnalytics>> => {
  return get<DashboardAnalytics>(`${BASE_URL}/dashboard`, { params });
};

// Get sales report (Admin)
export const getSalesReport = async (params: SalesQueryParams): Promise<ApiResponse<SalesReport>> => {
  return get<SalesReport>(`${BASE_URL}/sales`, { params });
};

// Default export for backward compatibility
export default {
  getDashboardAnalytics,
  getSalesReport,
};
