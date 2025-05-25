import axios from 'axios';
import { API_URL } from '../utils/env';

// Create a dedicated axios instance for auth requests with environment-based URL
const authAxios = axios.create({
  baseURL: API_URL
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

// Permission constants matching backend
export const PERMISSIONS = {
  MANAGE_HALLS: 1,
  MANAGE_BOOKINGS: 2,
  SEARCH_WEDDINGS: 4,
  MANAGE_INVOICES: 8,
  VIEW_REPORTS: 16,
  MANAGE_REGULATIONS: 32,
  MANAGE_USERS: 64,
  VIEW_PROFILE: 128
};

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
      const response = await authAxios.post('/auth/register', {
        name,
        email,
        password
      });
      
      if (response.data.token) {
        // Store complete user data including permissions
        const userData = {
          token: response.data.token,
          user: response.data.user,
          totalPermissions: response.data.user?.totalPermissions || 0
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        
        // Set the token for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        authAxios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
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
      const response = await authAxios.post('/auth/login', {
        email,
        password
      });
      
      if (response.data.token) {
        // Store complete user data including permissions
        const userData = {
          token: response.data.token,
          user: response.data.user,
          totalPermissions: response.data.user?.totalPermissions || 0
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        
        // Set the token for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        authAxios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
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
    localStorage.removeItem('token');
    // Remove the token from axios headers
    delete axios.defaults.headers.common['Authorization'];
    delete authAxios.defaults.headers.common['Authorization'];
  }

  /**
   * Get the current user from local storage
   * @returns {Object|null} The current user or null if not logged in
   */  getCurrentUser() {
    const userJson = localStorage.getItem('user');
    const userData = userJson ? JSON.parse(userJson) : null;
    if (userData && userData.user) {
      console.log('Debug - Auth user data structure:', userData.user);
      console.log('Debug - Phone fields available:', {
        SoDienThoai: userData.user.SoDienThoai,
        phone: userData.user.phone,
        SDT: userData.user.SDT
      });
    }
    return userData;
  }

  /**
   * Get the current user's total permissions
   * @returns {number} The user's total permissions value
   */
  getCurrentUserPermissions() {
    const user = this.getCurrentUser();
    return user?.totalPermissions || 0;
  }

  /**
   * Check if a user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn() {
    const user = this.getCurrentUser();
    const token = localStorage.getItem('token');
    return !!user && !!token;
  }

  /**
   * Check if the current user has a specific permission
   * @param {number} permission - Permission value to check
   * @returns {boolean} True if user has the permission
   */
  hasPermission(permission) {
    const userPermissions = this.getCurrentUserPermissions();
    return (userPermissions & permission) === permission;
  }

  /**
   * Check if the current user has any of the specified permissions
   * @param {number} permissions - Permission values combined with bitwise OR
   * @returns {boolean} True if user has any of the permissions
   */
  hasAnyPermission(permissions) {
    const userPermissions = this.getCurrentUserPermissions();
    return (userPermissions & permissions) > 0;
  }

  /**
   * Get a list of permission names the user has
   * @returns {Array<string>} Array of permission names
   */
  getUserPermissionNames() {
    const userPermissions = this.getCurrentUserPermissions();
    const permissionNames = [];
    
    Object.entries(PERMISSIONS).forEach(([name, value]) => {
      if (this.hasPermission(value)) {
        permissionNames.push(name.toLowerCase().replace(/_/g, ' '));
      }
    });
    
    return permissionNames;
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
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Initialize auth headers
setAuthHeader();

const authServiceInstance = new AuthService();
export default authServiceInstance; 