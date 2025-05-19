import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/lookup';

export const searchWeddings = async (params) => {
  const response = await axios.get(API_BASE, { params });
  return response.data.data;
};

export const getWeddingById = async (id) => {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data;
};