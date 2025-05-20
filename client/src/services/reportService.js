import axios from 'axios';
import { REPORT_ENDPOINTS, createUrlWithParams } from '../globals/api.global';

const reportService = {
  // Get monthly revenue report
  getMonthlyReport: async (params = {}) => {
    try {
      const url = createUrlWithParams(REPORT_ENDPOINTS.MONTHLY, params);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      throw error;
    }
  },
  
  // Get revenue trend over time
  getRevenueTrend: async (months = 6) => {
    try {
      const url = createUrlWithParams(REPORT_ENDPOINTS.REVENUE_TREND, { months });
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue trend:', error);
      throw error;
    }
  }
};

export default reportService; 