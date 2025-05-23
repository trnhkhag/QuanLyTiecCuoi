import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { REPORT_ENDPOINTS, createUrlWithParams } from '../../globals/api.global';

// Async thunks for reports
export const fetchMonthlyReport = createAsyncThunk(
  'reports/fetchMonthlyReport',
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const url = createUrlWithParams(REPORT_ENDPOINTS.MONTHLY, { year, month });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchRevenueTrend = createAsyncThunk(
  'reports/fetchRevenueTrend',
  async ({ months = 6, month, year }, { rejectWithValue }) => {
    try {
      const url = createUrlWithParams(REPORT_ENDPOINTS.REVENUE_TREND, { months, month, year });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    monthlyData: null,
    revenueTrend: [],
    loading: {
      monthly: false,
      trend: false,
    },
    error: null,
  },
  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Monthly report cases
      .addCase(fetchMonthlyReport.pending, (state) => {
        state.loading.monthly = true;
        state.error = null;
      })
      .addCase(fetchMonthlyReport.fulfilled, (state, action) => {
        state.loading.monthly = false;
        state.monthlyData = action.payload;
      })
      .addCase(fetchMonthlyReport.rejected, (state, action) => {
        state.loading.monthly = false;
        state.error = action.payload?.message || 'Failed to fetch monthly report';
      })
      // Revenue trend cases
      .addCase(fetchRevenueTrend.pending, (state) => {
        state.loading.trend = true;
        state.error = null;
      })
      .addCase(fetchRevenueTrend.fulfilled, (state, action) => {
        state.loading.trend = false;
        state.revenueTrend = action.payload;
      })
      .addCase(fetchRevenueTrend.rejected, (state, action) => {
        state.loading.trend = false;
        state.error = action.payload?.message || 'Failed to fetch revenue trend';
      });
  },
});

export const { clearReportError } = reportSlice.actions;

export default reportSlice.reducer; 