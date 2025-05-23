import axios from 'axios';
import { WEDDING_ENDPOINTS } from '../globals/api.global';

class RegulationService {
    // Lấy danh sách quy định
    async getRegulations() {
        try {
            const response = await axios.get(WEDDING_ENDPOINTS.REGULATION.GET_ALL);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching regulations:', error);
            throw error;
        }
    }

    // Lấy chi tiết quy định
    async getRegulationById(id) {
        try {
            const response = await axios.get(WEDDING_ENDPOINTS.REGULATION.GET_BY_ID(id));
            return response.data.data;
        } catch (error) {
            console.error('Error fetching regulation detail:', error);
            throw error;
        }
    }

    // Tạo quy định mới
    async createRegulation(regulationData) {
        try {
            const response = await axios.post(WEDDING_ENDPOINTS.REGULATION.CREATE, regulationData);
            return response.data;
        } catch (error) {
            console.error('Error creating regulation:', error);
            throw error;
        }
    }

    // Cập nhật quy định
    async updateRegulation(id, regulationData) {
        try {
            const response = await axios.put(WEDDING_ENDPOINTS.REGULATION.UPDATE(id), regulationData);
            return response.data;
        } catch (error) {
            console.error('Error updating regulation:', error);
            throw error;
        }
    }

    // Xóa quy định
    async deleteRegulation(id) {
        try {
            await axios.delete(WEDDING_ENDPOINTS.REGULATION.DELETE(id));
            return true;
        } catch (error) {
            console.error('Error deleting regulation:', error);
            throw error;
        }
    }
}

export default new RegulationService();