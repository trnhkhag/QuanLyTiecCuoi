import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Service class để tương tác với API liên quan đến sảnh tiệc
 */
class HallService {
  /**
   * Lấy danh sách sảnh
   * @returns {Promise} - Promise that resolves to the API response
   */
  getHalls() {
    return axios.get(`${API_URL}/halls`)
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
    return axios.get(`${API_URL}/halls/${id}`)
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
    return axios.get(`${API_URL}/halls/availability`, {
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

export default new HallService();