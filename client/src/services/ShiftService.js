import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ShiftService {
  // Lấy danh sách ca tiệc
  async getShifts() {
    try {
      const response = await axios.get(`${API_URL}/lookups/shifts`);
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw error;
    }
  }
}

const shiftService = new ShiftService();
export default shiftService;