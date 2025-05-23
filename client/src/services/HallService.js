import axios from 'axios';
import { WEDDING_ENDPOINTS } from '../globals/api.global';

/**
 * Service class để tương tác với API liên quan đến sảnh tiệc
 */
class HallService {
  /**
   * Lấy danh sách sảnh
   * @returns {Promise} - Promise that resolves to the API response
   */
  getHalls() {
    return axios.get(WEDDING_ENDPOINTS.HALL.GET_ALL)
      .then(response => {
        return { success: true, data: response.data.data || response.data };
      })
      .catch(error => {
        console.error('Error fetching halls:', error);
        throw new Error('Failed to fetch wedding halls');
      });
  }
  
  /**
   * Lấy chi tiết sảnh
   * @param {string|number} id - Id sảnh
   * @returns {Promise} - Promise that resolves to the API response
   */
  getHallById(id) {
    console.log('Fetching hall with ID:', id);
    return axios.get(WEDDING_ENDPOINTS.HALL.GET_BY_ID(id))
      .then(response => {
        console.log('Hall response:', response);
        // Kiểm tra cấu trúc dữ liệu trả về
        if (response.data && response.data.success) {
          return response.data.data; // Trả về data nếu API trả về format {success: true, data: {...}}
        } else if (response.data) {
          return response.data; // Trả về trực tiếp data nếu API không đóng gói trong success/data
        }
        return null;
      })
      .catch(error => {
        console.error('Error fetching hall by ID:', error);
        throw error;
      });
  }

  /**
   * Kiểm tra tình trạng sảnh
   * @param {string|number} hallId - Id sảnh
   * @param {string} date - Ngày kiểm tra
   * @param {string|number} shiftId - Ca tiệc
   * @returns {Promise} - Promise that resolves to the API response
   */
  checkHallAvailability(hallId, date, shiftId) {
    // Tạo URL với parameters
    const url = `${WEDDING_ENDPOINTS.HALL.BASE}/availability`;
    return axios.get(url, {
      params: { hallId, date, shiftId }
    })
      .then(response => {
        if (response.data && response.data.success) {
          return response.data;
        }
        throw new Error(response.data?.message || 'Unknown error');
      });
  }
}

const hallService = new HallService();
export default hallService;