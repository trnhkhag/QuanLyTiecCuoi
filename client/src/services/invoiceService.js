import axios from 'axios';
import { INVOICE_ENDPOINTS } from '../globals/api.global';

const API_URL = INVOICE_ENDPOINTS.BASE;

const invoiceService = {
  // Get all invoices
  getAllInvoices: async (params = {}) => {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add sorting
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      // Add filtering by invoice type (can be an array)
      if (params.loaiHoaDon && params.loaiHoaDon.length > 0) {
        queryParams.append('loaiHoaDon', params.loaiHoaDon.join(','));
      }
      
      // Construct the URL with query params
      const url = queryParams.toString() 
        ? `${API_URL}?${queryParams.toString()}` 
        : API_URL;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // Get invoice by ID
  getInvoiceById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/v1/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error);
      throw error;
    }
  },

  // Create a new invoice
  createInvoice: async (invoiceData) => {
    try {
      const response = await axios.post(API_URL, invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  // Update an invoice
  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await axios.put(`${API_URL}/v1/${id}`, invoiceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice ${id}:`, error);
      throw error;
    }
  },

  // Delete an invoice
  deleteInvoice: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/v1/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting invoice ${id}:`, error);
      throw error;
    }
  }
};

export default invoiceService; 