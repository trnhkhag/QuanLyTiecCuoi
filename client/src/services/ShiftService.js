import axios from 'axios';
import { WEDDING_ENDPOINTS } from '../globals/api.global';

class ShiftService {
  // Lấy danh sách ca tiệc
  async getShifts() {
    try {
      const response = await axios.get(WEDDING_ENDPOINTS.CA_TIEC.GET_ALL);
      const shifts = response.data.success ? response.data.data : [];
      
      // Log để debug cấu trúc dữ liệu
      console.log('API shifts response from server:', shifts);
      
      // Không cần chuyển đổi vì đang dùng API chính thức từ controller
      return shifts;
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw error;
    }
  }
}

const shiftService = new ShiftService();
export default shiftService;