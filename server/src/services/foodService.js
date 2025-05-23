const db = require('../config/db');

class FoodModel {
  // Lấy tất cả món ăn
  async getAllFoods() {
    try {
      const [rows] = await db.query('SELECT ID_MonAn, TenMonAn, DonGia FROM MonAn ORDER BY ID_MonAn');
      return rows;
    } catch (error) {
      console.error('Error in getAllFoods:', error.message);
      throw error;
    }
  }

  // Lấy món ăn theo ID
  async getFoodById(id) {
    try {
      const [rows] = await db.query('SELECT ID_MonAn, TenMonAn, DonGia FROM MonAn WHERE ID_MonAn = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error(`Error in getFoodById(${id}):`, error.message);
      throw error;
    }
  }
}

module.exports = new FoodModel();
