import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Service class để tương tác với API liên quan đến dịch vụ
 */
class ServiceService {
  // Lấy danh sách dịch vụ
  async getServices() {
    try {
      const response = await axios.get(`${API_URL}/services`);
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }
  
  // Lấy chi tiết dịch vụ
  async getServiceById(id) {
    try {
      const response = await axios.get(`${API_URL}/services/${id}`);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      throw error;
    }
  }
  
  // Tạo dịch vụ mới (Admin)
  async createService(serviceData) {
    try {
      const response = await axios.post(`${API_URL}/services`, serviceData);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }
  
  // Cập nhật dịch vụ (Admin)
  async updateService(id, serviceData) {
    try {
      const response = await axios.put(`${API_URL}/services/${id}`, serviceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating service ${id}:`, error);
      throw error;
    }
  }
  
  // Xóa dịch vụ (Admin)
  async deleteService(id) {
    try {
      const response = await axios.delete(`${API_URL}/services/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting service ${id}:`, error);
      throw error;
    }
  }
}

export default new ServiceService();