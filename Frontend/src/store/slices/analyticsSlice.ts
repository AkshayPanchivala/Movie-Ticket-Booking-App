import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as analyticsService from '@/services/analytics.service';
import { DashboardAnalytics, SalesReport, AnalyticsQueryParams, SalesQueryParams } from '@/types/api.types';

interface AnalyticsState {
  dashboardData: DashboardAnalytics | null;
  salesReport: SalesReport | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  dashboardData: null,
  salesReport: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchDashboardAnalytics = createAsyncThunk(
  'analytics/fetchDashboard',
  async (params?: AnalyticsQueryParams) => {
    const response = await analyticsService.getDashboardAnalytics(params);
    return response.data;
  }
);

export const fetchSalesReport = createAsyncThunk(
  'analytics/fetchSalesReport',
  async (params: SalesQueryParams) => {
    const response = await analyticsService.getSalesReport(params);
    return response.data;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.dashboardData = null;
      state.salesReport = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Analytics
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch dashboard analytics';
      })
      // Fetch Sales Report
      .addCase(fetchSalesReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesReport = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch sales report';
      });
  },
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
