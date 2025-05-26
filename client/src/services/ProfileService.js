import axios from 'axios';
import { API_ENDPOINTS } from '../globals/api.global';
import store from '../redux/store';
import { updateUserProfile, setToken } from '../redux/slices/auth.slice';

class ProfileService {
  // Get current user profile
  async getProfile() {
    try {
      const response = await axios.get(API_ENDPOINTS.PROFILE.GET_PROFILE);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error('Error getting profile:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi lấy thông tin profile' 
      };
    }
  }

  // Update customer profile
  async updateCustomerProfile(profileData) {
    try {
      const response = await axios.put(API_ENDPOINTS.PROFILE.UPDATE_CUSTOMER, profileData);
      
      // Update Redux store with new profile data
      store.dispatch(updateUserProfile({
        name: profileData.fullName,
        fullName: profileData.fullName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber
      }));

      // Also update localStorage immediately for cross-tab sync
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.user) {
        currentUser.user = {
          ...currentUser.user,
          name: profileData.fullName,
          fullName: profileData.fullName,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
      
      // If new token is returned, update it in Redux store and storage
      if (response.data.token) {
        store.dispatch(setToken(response.data.token));
        
        // Also update authService for backward compatibility
        const authService = (await import('./authService')).default;
        authService.setAuthData({
          token: response.data.token,
          user: store.getState().auth.user
        });
      }
      
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      console.error('Error updating customer profile:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi cập nhật thông tin khách hàng' 
      };
    }
  }

  // Update employee profile
  async updateEmployeeProfile(profileData) {
    try {
      const response = await axios.put(API_ENDPOINTS.PROFILE.UPDATE_EMPLOYEE, profileData);
      
      // Update Redux store with new profile data
      store.dispatch(updateUserProfile({
        name: profileData.fullName,
        fullName: profileData.fullName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        employeeId: profileData.employeeId,
        department: profileData.department
      }));

      // Also update localStorage immediately for cross-tab sync
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.user) {
        currentUser.user = {
          ...currentUser.user,
          name: profileData.fullName,
          fullName: profileData.fullName,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber,
          employeeId: profileData.employeeId,
          department: profileData.department
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
      
      // If new token is returned, update it in Redux store and storage
      if (response.data.token) {
        store.dispatch(setToken(response.data.token));
        
        // Also update authService for backward compatibility
        const authService = (await import('./authService')).default;
        authService.setAuthData({
          token: response.data.token,
          user: store.getState().auth.user
        });
      }
      
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      console.error('Error updating employee profile:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi cập nhật thông tin nhân viên' 
      };
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await axios.put(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, passwordData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error changing password:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi đổi mật khẩu' 
      };
    }
  }

  // Get user permissions
  async getUserPermissions() {
    try {
      const response = await axios.get(API_ENDPOINTS.PROFILE.PERMISSIONS);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Lỗi khi lấy thông tin quyền hạn' 
      };
    }
  }
}

export default new ProfileService(); 