import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

/**
 * Authentication service for handling auth-related API requests
 */
class AuthService {
  /**
   * Register a new user
   * @param {string} name - User's name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - Response from the API
   */
  async register(name, email, password) {
    try {
      const response = await axios.post(`${API_URL}/register`, { name, email, password });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Log in a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - Response from the API
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Log out the current user by removing from local storage
   */
  logout() {
    localStorage.removeItem('user');
  }

  /**
   * Get the current user from local storage
   * @returns {Object|null} The current user or null if not logged in
   */
  getCurrentUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Check if a user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn() {
    return !!this.getCurrentUser();
  }

  /**
   * Handle API errors
   * @private
   */
  _handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data.message || 
                           (error.response.data.errors && error.response.data.errors[0].message) || 
                           'Xác thực thất bại';
      
      return new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau.');
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  }
}

export default new AuthService(); 