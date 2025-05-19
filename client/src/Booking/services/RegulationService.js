import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

class RegulationService {
    // Lấy danh sách quy định
    async getRegulations() {
        try {
            const response = await axios.get(`${API_URL}/regulations`);
            return response.data;
        } catch (error) {
            console.error('Error fetching regulations:', error);
            throw error;
        }
    }

    // Lấy chi tiết quy định
    async getRegulationById(id) {
        try {
            const response = await axios.get(`${API_URL}/regulations/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching regulation detail:', error);
            throw error;
        }
    }

    // Cập nhật quy định
    async updateRegulation(id, data) {
        try {
            const response = await axios.put(`${API_URL}/regulations/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating regulation:', error);
            throw error;
        }
    }
}

export default new RegulationService();