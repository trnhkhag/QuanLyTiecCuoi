import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Service class để tương tác với API liên quan đến đặt tiệc cưới
 */
class BookingService {
  /**
   * Lấy danh sách tất cả các đặt tiệc
   * @param {Object} filters - Các filter (date, hallId, status)
   * @returns {Promise} - Promise that resolves to the API response
   */
  getAllBookings(filters = {}) {
    let url = `${API_URL}/bookings`;
    const params = new URLSearchParams();
    
    if (filters.date) {
      const formattedDate = typeof filters.date === 'object'
        ? filters.date.toISOString().split('T')[0]
        : filters.date;
      params.append('date', formattedDate);
    }
    
    if (filters.hallId) {
      params.append('hallId', filters.hallId);
    }
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return axios.get(url)
      .then(response => {
        if (response.data && response.data.success) {
          return response.data;
        }
        throw new Error(response.data?.message || 'Unknown error');
      });
  }

  /**
   * Lấy chi tiết một đặt tiệc
   * @param {string|number} id - Id đặt tiệc
   * @returns {Promise} - Promise that resolves to the API response
   */
  getBookingById(id) {
    return axios.get(`${API_URL}/bookings/${id}`)
      .then(response => {
        if (response.data && response.data.success) {
          return response.data;
        }
        throw new Error(response.data?.message || 'Unknown error');
      });
  }

  /**
   * Tạo đặt tiệc mới
   * @param {Object} bookingData - Dữ liệu đặt tiệc
   * @returns {Promise} - Promise that resolves to the API response
   */
  createBooking(bookingData) {
    return axios.post(`${API_URL}/bookings`, bookingData)
      .then(response => {
        if (response.data && response.data.success) {
          return response.data;
        }
        throw new Error(response.data?.message || 'Unknown error');
      });
  }

  /**
   * Cập nhật đặt tiệc
   * @param {string|number} id - Id đặt tiệc
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise} - Promise that resolves to the API response
   */
  updateBooking(id, updateData) {
    return axios.put(`${API_URL}/bookings/${id}`, updateData)
      .then(response => {
        if (response.data && response.data.success) {
          return response.data;
        }
        throw new Error(response.data?.message || 'Unknown error');
      });
  }

  /**
   * Hủy đặt tiệc
   * @param {string|number} id - Id đặt tiệc
   * @param {string} reason - Lý do hủy
   * @returns {Promise} - Promise that resolves to the API response
   */
  cancelBooking(id, reason) {
    return axios.delete(`${API_URL}/bookings/${id}`, { data: { reason } })
      .then(response => {
        if (response.data && response.data.success) {
          return response.data;
        }
        throw new Error(response.data?.message || 'Unknown error');
      });
  }
}

export default new BookingService();