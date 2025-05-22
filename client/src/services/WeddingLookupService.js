import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_BASE = `${API_URL}/lookup`;

export const searchWeddings = async (params) => {
  try {
    const response = await axios.get(API_BASE, { params });
    if (response.data && response.data.data) {
      return response.data.data;
    }
    throw new Error('Không có dữ liệu trả về từ API');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi gọi API');
  }
};

export const getWeddingById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/${id}`);
    if (response.data) {
      return response.data;
    }
    throw new Error('Không tìm thấy dữ liệu');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi gọi API');
  }
};