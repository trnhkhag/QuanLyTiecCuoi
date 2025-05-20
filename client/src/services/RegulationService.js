import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

class RegulationService {
    // Lấy danh sách quy định
    async getRegulations() {
        try {
            const response = await axios.get(`${API_URL}/regulations`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching regulations:', error);
            throw error;
        }
    }

    // Lấy chi tiết quy định
    async getRegulationById(id) {
        try {
            const response = await axios.get(`${API_URL}/regulations/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching regulation detail:', error);
            throw error;
        }
    }

    // Cập nhật quy định
    async updateRegulation(id, data) {
        try {
            const response = await axios.put(`${API_URL}/regulations/${id}`, data);
            return response.data.data;
        } catch (error) {
            console.error('Error updating regulation:', error);
            throw error;
        }
    }

    // Thêm mới quy định
    async createRegulation(data) {
        try {
            // Tạo ID tự động theo format QDx, với x là số tiếp theo
            const response = await axios.get(`${API_URL}/regulations`);
            const regulations = response.data.data;
            let maxId = 0;
            regulations.forEach(reg => {
                const num = parseInt(reg.ID_QuyDinh.replace('QD', ''));
                if (!isNaN(num) && num > maxId) maxId = num;
            });
            const newId = `QD${maxId + 1}`;
            
            const newData = { ...data, ID_QuyDinh: newId };
            const createResponse = await axios.post(`${API_URL}/regulations`, newData);
            return { ...newData, ...createResponse.data.data };
        } catch (error) {
            console.error('Error creating regulation:', error);
            throw error;
        }
    }

    // Xóa quy định
    async deleteRegulation(id) {
        try {
            await axios.delete(`${API_URL}/regulations/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting regulation:', error);
            throw error;
        }
    }
}

export default new RegulationService();