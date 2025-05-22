import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

class AdminHallService {
  // API quản lý sảnh
  getAllHalls() {
    return axios.get(`${API_URL}/lobby/halls`);
  }

  getHallById(id) {
    return axios.get(`${API_URL}/lobby/halls/${id}`);
  }

  createHall(hallData) {
    return axios.post(`${API_URL}/lobby/halls`, hallData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  updateHall(id, data) {
    const headers = data instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' };
    
    return axios.put(`${API_URL}/lobby/halls/${id}`, data, { headers });
  }

  deleteHall(id) {
    return axios.delete(`${API_URL}/lobby/halls/${id}`);
  }

  // API quản lý loại sảnh
  getAllHallTypes() {
    return axios.get(`${API_URL}/lobby/hall-types`);
  }

  createHallType(typeData) {
    return axios.post(`${API_URL}/lobby/hall-types`, typeData);
  }

  updateHallType(id, typeData) {
    return axios.put(`${API_URL}/lobby/hall-types/${id}`, typeData);
  }

  deleteHallType(id) {
    return axios.delete(`${API_URL}/lobby/hall-types/${id}`);
  }
}

const adminHallService = new AdminHallService();
export default adminHallService;