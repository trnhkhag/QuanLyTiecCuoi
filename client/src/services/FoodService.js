import axios from 'axios';
import { WEDDING_ENDPOINTS } from '../globals/api.global';

class FoodService {
  async getFoods() {
    try {
      // Sử dụng LOOKUP.FOODS endpoint thay vì FOOD.GET_ALL
      console.log('Fetching foods from API:', WEDDING_ENDPOINTS.LOOKUP.FOODS);
      const response = await axios.get(WEDDING_ENDPOINTS.LOOKUP.FOODS);
      
      console.log('Foods API response:', response);
      
      if (response && response.status === 200) {
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (response.data && typeof response.data === 'object') {
          return response.data;
        }
      }
      
      console.warn('Unexpected foods response format:', response);
      // Trả về dữ liệu mẫu khi không nhận được dữ liệu từ API
      return [
        { ID_MonAn: 1, TenMonAn: "Gà hấp lá chanh", DonGia: 250000 },
        { ID_MonAn: 2, TenMonAn: "Bò lúc lắc", DonGia: 300000 },
        { ID_MonAn: 3, TenMonAn: "Tôm nướng muối ớt", DonGia: 350000 },
        { ID_MonAn: 4, TenMonAn: "Súp cua", DonGia: 150000 },
        { ID_MonAn: 5, TenMonAn: "Chè hạt sen", DonGia: 100000 }
      ];
    } catch (error) {
      console.error('Error fetching foods:', error);
      // Trả về dữ liệu mẫu trong trường hợp lỗi
      return [
        { ID_MonAn: 1, TenMonAn: "Gà hấp lá chanh", DonGia: 250000 },
        { ID_MonAn: 2, TenMonAn: "Bò lúc lắc", DonGia: 300000 },
        { ID_MonAn: 3, TenMonAn: "Tôm nướng muối ớt", DonGia: 350000 },
        { ID_MonAn: 4, TenMonAn: "Súp cua", DonGia: 150000 },
        { ID_MonAn: 5, TenMonAn: "Chè hạt sen", DonGia: 100000 }
      ];
    }
  }

  async getFoodById(id) {
    try {
      const url = WEDDING_ENDPOINTS.FOOD.GET_BY_ID(id);
      console.log('Fetching food details from:', url);
      const response = await axios.get(url);
      
      if (response && response.status === 200) {
        const data = response.data?.data || response.data;
        console.log('Food details fetched successfully:', data);
        return data;
      } else {
        throw new Error('Invalid response format for food details');
      }
    } catch (error) {
      console.error(`Error fetching details for food ${id}:`, error);
      throw new Error(`Failed to fetch food details for ID: ${id}`);
    }
  }
}

export default new FoodService();