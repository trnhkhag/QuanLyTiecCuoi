import axios from 'axios';
import { WEDDING_ENDPOINTS } from '../globals/api.global';

class AdminHallService {
  // API quản lý sảnh
  getAllHalls() {
    return axios.get(WEDDING_ENDPOINTS.HALL.GET_ALL);
  }

  getHallById(id) {
    return axios.get(WEDDING_ENDPOINTS.HALL.GET_BY_ID(id));
  }

  createHall(hallData) {
    return axios.post(WEDDING_ENDPOINTS.HALL.CREATE, hallData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  updateHall(id, data) {
    const headers = data instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' };
    
    return axios.put(WEDDING_ENDPOINTS.HALL.UPDATE(id), data, { headers });
  }

  deleteHall(id) {
    return axios.delete(WEDDING_ENDPOINTS.HALL.DELETE(id));
  }

  // API quản lý loại sảnh
  getAllHallTypes() {
    return axios.get(WEDDING_ENDPOINTS.HALL_TYPE.GET_ALL);
  }

  createHallType(typeData) {
    return axios.post(WEDDING_ENDPOINTS.HALL_TYPE.CREATE, typeData);
  }

  updateHallType(id, typeData) {
    return axios.put(WEDDING_ENDPOINTS.HALL_TYPE.UPDATE(id), typeData);
  }

  deleteHallType(id) {
    return axios.delete(WEDDING_ENDPOINTS.HALL_TYPE.DELETE(id));
  }
}

export default new AdminHallService();