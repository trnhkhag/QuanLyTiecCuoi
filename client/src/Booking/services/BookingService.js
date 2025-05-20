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
   */  createBooking(bookingData) {
    console.log('Sending booking request with data:', bookingData);
    
    return axios.post(`${API_URL}/bookings`, bookingData)
      .then(response => {
        console.log('Booking response:', response.data);
        if (response.data && response.data.success) {
          return response.data.data;
        }
        throw new Error(response.data?.message || 'Unknown error');
      })
      .catch(error => {
        console.error('Booking error:', error);
        
        // Handle specific error scenarios
        if (error.response) {
          console.error('Error response:', error.response.data);
          
          // Handle 400 Bad Request - could be validation errors or already booked hall
          if (error.response.status === 400) {
            const errorMessage = error.response.data?.message || 'Dữ liệu đặt tiệc không hợp lệ';
            throw new Error(errorMessage);
          }
          
          // Handle 500 Internal Server Error
          if (error.response.status === 500) {
            throw new Error('Lỗi máy chủ: ' + (error.response.data?.message || 'Hệ thống đang gặp sự cố'));
          }
          
          throw new Error(error.response.data?.message || 'Lỗi máy chủ');
        }
        
        // Network errors or other issues
        throw new Error('Lỗi kết nối: ' + (error.message || 'Không thể kết nối đến máy chủ'));
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

  /**
   * Cập nhật trạng thái đặt tiệc
   * @param {string|number} id - Id đặt tiệc
   * @param {string} status - Trạng thái mới
   * @returns {Promise} - Promise that resolves to the API response
   */
  updateBookingStatus(id, status) {
    return axios.patch(`${API_URL}/bookings/${id}/status`, { status })
      .then(response => {
        if (response.data && response.data.success) {
          return response.data;
        }
        throw new Error(response.data?.message || 'Unknown error');
      })
      .catch(error => {
        console.error('Update booking status error:', error);
        
        if (error.response) {
          throw new Error(error.response.data?.message || 'Server error');
        }
        
        throw error;
      });
  }
}

export default new BookingService();