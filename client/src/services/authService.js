import axios from 'axios';

// Create a dedicated axios instance for auth requests with direct base URL
const authAxios = axios.create({
  baseURL: 'http://localhost:3001'
});

// Debug logging for auth requests
authAxios.interceptors.request.use(
  config => {
    console.log('Auth API Request:', { 
      url: config.url,
      method: config.method,
      data: config.data,
      baseURL: config.baseURL,
      fullUrl: config.baseURL + config.url
    });
    return config;
  },
  error => {
    console.error('Auth API Request Error:', error);
    return Promise.reject(error);
  }
);

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
      console.log('Attempting to register...');
      
      // Use authAxios with direct route path
      const response = await authAxios.post('/api/auth/register', {
        name,
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        // Set the token for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response || error);
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
      console.log('Attempting to login...');
      console.log('Login payload:', { email, password });
      
      // Use authAxios with direct route path
      const response = await authAxios.post('/api/auth/login', {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        // Set the token for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response || error);
      throw this._handleError(error);
    }
  }

  /**
   * Log out the current user by removing from local storage
   */
  logout() {
    localStorage.removeItem('user');
    // Remove the token from axios headers
    delete axios.defaults.headers.common['Authorization'];
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
    const user = this.getCurrentUser();
    return !!user && !!user.token;
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

// Set the authorization header if the user is already logged in
const setAuthHeader = () => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    const user = JSON.parse(userJson);
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      authAxios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
  }
};

// Initialize auth headers
setAuthHeader();

const authServiceInstance = new AuthService();
export default authServiceInstance; 