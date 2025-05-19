import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class HallManagementService {
  // API quản lý sảnh
  getAllHalls() {
    return axios.get(`${API_URL}/lobby/halls`);
  }

  getHallById(id) {
    return axios.get(`${API_URL}/lobby/halls/${id}`);
  }

  createHall(hallData) {
    return axios.post(`${API_URL}/lobby/halls`, hallData);
  }

  updateHall(id, hallData) {
    return axios.put(`${API_URL}/lobby/halls/${id}`, hallData);
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

export default new HallManagementService();