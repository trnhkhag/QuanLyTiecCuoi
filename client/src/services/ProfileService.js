import axios from 'axios';
import { API_ENDPOINTS } from '../globals/api.global';

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