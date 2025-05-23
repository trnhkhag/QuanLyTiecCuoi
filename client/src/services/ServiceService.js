import axios from 'axios';
import { WEDDING_ENDPOINTS } from '../globals/api.global';

/**
 * Service class để tương tác với API liên quan đến dịch vụ
 */
class ServiceService {  // Lấy danh sách dịch vụ
  async getServices() {
    try {
      const response = await axios.get(WEDDING_ENDPOINTS.SERVICE.GET_ALL);
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
      const response = await axios.get(WEDDING_ENDPOINTS.SERVICE.GET_BY_ID(id));
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      throw error;
    }
  }
}

const serviceService = new ServiceService();
export default serviceService;