import axios from 'axios';
import { WEDDING_ENDPOINTS } from '../globals/api.global';

class ShiftService {
  // Lấy danh sách ca tiệc
  async getShifts() {
    try {
      const response = await axios.get(WEDDING_ENDPOINTS.LOOKUP.SHIFTS);
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw error;
    }
  }
}

const shiftService = new ShiftService();
export default shiftService;