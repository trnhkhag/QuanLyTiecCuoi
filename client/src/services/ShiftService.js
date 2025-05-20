import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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

export default new ShiftService();