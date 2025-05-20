import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { INVOICE_ENDPOINTS, createUrlWithParams } from '../../globals/api.global';

// Async thunks for invoices
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const url = createUrlWithParams(INVOICE_ENDPOINTS.GET_ALL, params);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(INVOICE_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/create',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(INVOICE_ENDPOINTS.CREATE, invoiceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(INVOICE_ENDPOINTS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(INVOICE_ENDPOINTS.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0,
    },
    sorting: {
      sortBy: 'NgayLap',
      sortOrder: 'desc',
    },
    currentInvoice: null,
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
    clearInvoiceError: (state) => {
      state.error = null;
    },
    clearInvoiceSuccess: (state) => {
      state.success = null;
    },
    setInvoicePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setInvoiceSorting: (state, action) => {
      state.sorting = { ...state.sorting, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading.list = false;
        state.items = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        if (action.payload.sorting) {
          state.sorting = action.payload.sorting;
        }
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload?.message || 'Failed to fetch invoices';
      })
      
      // Fetch invoice by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading.detail = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.currentInvoice = action.payload.data;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading.detail = false;
        state.error = action.payload?.message || 'Failed to fetch invoice details';
      })
      
      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading.create = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading.create = false;
        state.items.push(action.payload.data);
        state.success = 'Invoice created successfully';
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload?.message || 'Failed to create invoice';
      })
      
      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading.update = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedInvoice = action.payload.data;
        state.items = state.items.map(item => 
          item.ID_HoaDon === updatedInvoice.ID_HoaDon ? updatedInvoice : item
        );
        if (state.currentInvoice?.ID_HoaDon === updatedInvoice.ID_HoaDon) {
          state.currentInvoice = updatedInvoice;
        }
        state.success = 'Invoice updated successfully';
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload?.message || 'Failed to update invoice';
      })
      
      // Delete invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.items = state.items.filter(item => item.ID_HoaDon !== action.payload);
        if (state.currentInvoice?.ID_HoaDon === action.payload) {
          state.currentInvoice = null;
        }
        state.success = 'Invoice deleted successfully';
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload?.message || 'Failed to delete invoice';
      });
  },
});

export const { 
  clearInvoiceError, 
  clearInvoiceSuccess, 
  setInvoicePagination, 
  setInvoiceSorting 
} = invoiceSlice.actions;

export default invoiceSlice.reducer; 