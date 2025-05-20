import axios from 'axios';
import { WEDDING_ENDPOINTS } from '../globals/api.global';

const API_URL = WEDDING_ENDPOINTS.BASE;

const tiecCuoiService = {
  // Get all wedding parties with pagination, sorting and filtering
  getAllTiecCuoi: async (params = {}) => {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add sorting
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      // Construct the URL with query params
      const url = queryParams.toString() 
        ? `${API_URL}?${queryParams.toString()}` 
        : API_URL;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching wedding parties:', error);
      throw error;
    }
  },

  // Get wedding party by ID
  getTiecCuoiById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching wedding party ${id}:`, error);
      throw error;
    }
  },

  // Create a new wedding party
  createTiecCuoi: async (tiecCuoiData) => {
    try {
      const response = await axios.post(API_URL, tiecCuoiData);
      return response.data;
    } catch (error) {
      console.error('Error creating wedding party:', error);
      throw error;
    }
  },

  // Update a wedding party
  updateTiecCuoi: async (id, tiecCuoiData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, tiecCuoiData);
      return response.data;
    } catch (error) {
      console.error(`Error updating wedding party ${id}:`, error);
      throw error;
    }
  },

  // Delete a wedding party
  deleteTiecCuoi: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting wedding party ${id}:`, error);
      throw error;
    }
  }
};

export default tiecCuoiService; 