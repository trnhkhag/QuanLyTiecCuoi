import axios from 'axios';
import { WEDDING_ENDPOINTS, createUrlWithParams } from '../globals/api.global';

// Tạo instance của axios với base URL
const api = axios.create({
  baseURL: WEDDING_ENDPOINTS.BOOKING.BASE
});

// Thêm interceptor để xử lý token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung
    const errorMessage = error.response?.data?.message || error.message;
    console.error('API Error:', errorMessage);
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status
    });
  }
);

class WeddingBookingService {
  /**
   * Lấy danh sách đặt tiệc với bộ lọc
   * @param {Object} filters - Các tham số lọc (date, customerName, status)
   * @returns {Promise}
   */
  async getAllBookings(filters = {}) {
    try {
      const url = createUrlWithParams(WEDDING_ENDPOINTS.BOOKING.GET_ALL, filters);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error getting bookings:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một đặt tiệc
   * @param {number} id - ID đặt tiệc
   * @returns {Promise}
   */
  async getBookingById(id) {
    try {
      const response = await api.get(WEDDING_ENDPOINTS.BOOKING.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error getting booking details:', error);
      throw error;
    }
  }

  /**
   * Tạo đặt tiệc mới
   * @param {Object} bookingData - Dữ liệu đặt tiệc
   * @returns {Promise}
   */
  async createBooking(bookingData) {
    try {
      const response = await api.post(WEDDING_ENDPOINTS.BOOKING.CREATE, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin đặt tiệc
   * @param {number} id - ID đặt tiệc
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise}
   */
  async updateBooking(id, updateData) {
    try {
      const response = await api.put(WEDDING_ENDPOINTS.BOOKING.UPDATE(id), updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  /**
   * Cập nhật trạng thái thanh toán
   * @param {number} id - ID đặt tiệc
   * @param {boolean} isFullyPaid - true nếu đã thanh toán đầy đủ
   * @returns {Promise}
   */
  async updateBookingStatus(id, isFullyPaid) {
    try {
      const response = await api.patch(`${WEDDING_ENDPOINTS.BOOKING.UPDATE(id)}/status`, {
        isFullyPaid
      });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  /**
   * Xóa đặt tiệc
   * @param {number} id - ID đặt tiệc
   * @returns {Promise}
   */
  async deleteBooking(id) {
    try {
      const response = await api.delete(WEDDING_ENDPOINTS.BOOKING.DELETE(id));
      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  /**
   * Kiểm tra sảnh có sẵn không
   * @param {Object} params - Tham số kiểm tra (hallId, date, shiftId)
   * @returns {Promise}
   */
  async checkHallAvailability(params) {
    try {
      const url = createUrlWithParams(`${WEDDING_ENDPOINTS.BOOKING.BASE}/check-availability`, params);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error checking hall availability:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách ca tiệc
   * @returns {Promise}
   */
  async getShifts() {
    try {
      const response = await axios.get(WEDDING_ENDPOINTS.LOOKUP.SHIFTS);
      return response.data;
    } catch (error) {
      console.error('Error getting shifts:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách món ăn
   * @returns {Promise}
   */
  async getFoods() {
    try {
      const response = await axios.get(WEDDING_ENDPOINTS.LOOKUP.FOODS);
      return response.data;
    } catch (error) {
      console.error('Error getting foods:', error);
      throw error;
    }
  }
}

export default new WeddingBookingService();
