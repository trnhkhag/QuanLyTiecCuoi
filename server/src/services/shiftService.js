// filepath: d:\CNPM\QuanLyTiecCuoi\server\services\shiftService.js
const db = require('../config/db');

class ShiftModel {
  // Lấy tất cả ca tiệc
  async getAllShifts() {
    try {
      const [rows] = await db.query('SELECT ID_Ca, TenCa FROM CaTiec ORDER BY ID_Ca');
      return rows;
    } catch (error) {
      console.error('Error in getAllShifts:', error.message);
      throw error;
    }
  }

  // Lấy ca tiệc theo ID
  async getShiftById(id) {
    try {
      const [rows] = await db.query('SELECT ID_Ca, TenCa FROM CaTiec WHERE ID_Ca = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error(`Error in getShiftById(${id}):`, error.message);
      throw error;
    }
  }
}

module.exports = new ShiftModel();