import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Service class để tương tác với API liên quan đến dịch vụ
 */
class ServiceService {  // Lấy danh sách dịch vụ
  async getServices() {
    try {
      const response = await axios.get(`${API_URL}/services`);
      console.log('API response for services:', response);
      
      // Kiểm tra cấu trúc dữ liệu
      let servicesData = [];
      if (response.data) {
        if (response.data.success && Array.isArray(response.data.data)) {
          servicesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          servicesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          servicesData = response.data.data;
        }
      }
      
      console.log('Services data after processing:', servicesData);
      return servicesData;
    } catch (error) {
      console.error('Error fetching services:', error);
      return []; // Return empty array instead of throwing error
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
}

export default new ServiceService();