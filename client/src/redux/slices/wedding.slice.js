import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { WEDDING_ENDPOINTS, createUrlWithParams } from '../../globals/api.global';

// Async thunks for weddings
export const fetchWeddings = createAsyncThunk(
  'weddings/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const url = createUrlWithParams(WEDDING_ENDPOINTS.GET_ALL, params);
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
      const response = await axios.get(WEDDING_ENDPOINTS.GET_BY_ID(id));
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
      const response = await axios.post(WEDDING_ENDPOINTS.CREATE, weddingData);
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
      const response = await axios.put(WEDDING_ENDPOINTS.UPDATE(id), data);
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
      await axios.delete(WEDDING_ENDPOINTS.DELETE(id));
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
    pagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0,
    },
    sorting: {
      sortBy: 'NgayToChuc',
      sortOrder: 'desc',
    },
    currentWedding: null,
    loading: {
      list: false,
      detail: false,
      create: false,
      update: false,
      delete: false,
    },
    error: null,
    success: null,
  },
  reducers: {
    clearWeddingError: (state) => {
      state.error = null;
    },
    clearWeddingSuccess: (state) => {
      state.success = null;
    },
    setWeddingPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setWeddingSorting: (state, action) => {
      state.sorting = { ...state.sorting, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all weddings
      .addCase(fetchWeddings.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(fetchWeddings.fulfilled, (state, action) => {
        state.loading.list = false;
        state.items = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        if (action.payload.sorting) {
          state.sorting = action.payload.sorting;
        }
      })
      .addCase(fetchWeddings.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload?.message || 'Failed to fetch weddings';
      })
      
      // Fetch wedding by ID
      .addCase(fetchWeddingById.pending, (state) => {
        state.loading.detail = true;
        state.error = null;
      })
      .addCase(fetchWeddingById.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.currentWedding = action.payload.data;
      })
      .addCase(fetchWeddingById.rejected, (state, action) => {
        state.loading.detail = false;
        state.error = action.payload?.message || 'Failed to fetch wedding details';
      })
      
      // Create wedding
      .addCase(createWedding.pending, (state) => {
        state.loading.create = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createWedding.fulfilled, (state, action) => {
        state.loading.create = false;
        state.items.push(action.payload.data);
        state.success = 'Wedding created successfully';
      })
      .addCase(createWedding.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload?.message || 'Failed to create wedding';
      })
      
      // Update wedding
      .addCase(updateWedding.pending, (state) => {
        state.loading.update = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateWedding.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedWedding = action.payload.data;
        state.items = state.items.map(item => 
          item.ID_TiecCuoi === updatedWedding.ID_TiecCuoi ? updatedWedding : item
        );
        if (state.currentWedding?.ID_TiecCuoi === updatedWedding.ID_TiecCuoi) {
          state.currentWedding = updatedWedding;
        }
        state.success = 'Wedding updated successfully';
      })
      .addCase(updateWedding.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload?.message || 'Failed to update wedding';
      })
      
      // Delete wedding
      .addCase(deleteWedding.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteWedding.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.items = state.items.filter(item => item.ID_TiecCuoi !== action.payload);
        if (state.currentWedding?.ID_TiecCuoi === action.payload) {
          state.currentWedding = null;
        }
        state.success = 'Wedding deleted successfully';
      })
      .addCase(deleteWedding.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload?.message || 'Failed to delete wedding';
      });
  },
});

export const { 
  clearWeddingError, 
  clearWeddingSuccess, 
  setWeddingPagination, 
  setWeddingSorting 
} = weddingSlice.actions;

export default weddingSlice.reducer; 