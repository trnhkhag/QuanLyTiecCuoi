import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { WEDDING_ENDPOINTS, createUrlWithParams } from '../../globals/api.global';

// Async thunks for weddings
export const fetchWeddings = createAsyncThunk(
  'weddings/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const url = createUrlWithParams(WEDDING_ENDPOINTS.CA_TIEC.GET_ALL, params);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchWeddingById = createAsyncThunk(
  'weddings/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${WEDDING_ENDPOINTS.CA_TIEC.BASE}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createWedding = createAsyncThunk(
  'weddings/create',
  async (weddingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(WEDDING_ENDPOINTS.CA_TIEC.BASE, weddingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateWedding = createAsyncThunk(
  'weddings/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${WEDDING_ENDPOINTS.CA_TIEC.BASE}/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteWedding = createAsyncThunk(
  'weddings/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${WEDDING_ENDPOINTS.CA_TIEC.BASE}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const weddingSlice = createSlice({
  name: 'weddings',
  initialState: {
    items: [],
    selectedWedding: null,
    loading: false,
    error: null
  },
  reducers: {
    clearSelectedWedding: (state) => {
      state.selectedWedding = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all weddings
      .addCase(fetchWeddings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeddings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchWeddings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch weddings';
      })
      // Fetch wedding by ID
      .addCase(fetchWeddingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeddingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedWedding = action.payload.data;
      })
      .addCase(fetchWeddingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch wedding';
      })
      // Create wedding
      .addCase(createWedding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWedding.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload.data);
      })
      .addCase(createWedding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create wedding';
      })
      // Update wedding
      .addCase(updateWedding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWedding.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(w => w.id === action.payload.data.id);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        if (state.selectedWedding?.id === action.payload.data.id) {
          state.selectedWedding = action.payload.data;
        }
      })
      .addCase(updateWedding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update wedding';
      })
      // Delete wedding
      .addCase(deleteWedding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWedding.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(w => w.id !== action.payload);
        if (state.selectedWedding?.id === action.payload) {
          state.selectedWedding = null;
        }
      })
      .addCase(deleteWedding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete wedding';
      });
  }
});

export const { clearSelectedWedding } = weddingSlice.actions;
export default weddingSlice.reducer; 