const db = require('../config/db');

class HallManagementService {
  // Lấy tất cả sảnh kèm thông tin loại
  async getAllHalls() {
    try {
      const [halls] = await db.query(`
        SELECT s.ID_SanhTiec, s.TenSanh, s.SucChua, s.GiaThue, 
               l.ID_LoaiSanh, l.TenLoai, l.GiaBanToiThieu
        FROM SanhTiec s
        JOIN LoaiSanh l ON s.ID_LoaiSanh = l.ID_LoaiSanh
        ORDER BY s.ID_SanhTiec
      `);
      return halls;
    } catch (error) {
      console.error('Error in getAllHalls service:', error);
      throw error;
    }
  }

  // Lấy chi tiết một sảnh theo ID
  async getHallById(hallId) {
    try {
      const [halls] = await db.query(`
        SELECT s.ID_SanhTiec, s.TenSanh, s.SucChua, s.GiaThue,
               l.ID_LoaiSanh, l.TenLoai, l.GiaBanToiThieu
        FROM SanhTiec s
        JOIN LoaiSanh l ON s.ID_LoaiSanh = l.ID_LoaiSanh
        WHERE s.ID_SanhTiec = ?
      `, [hallId]);
      return halls[0];
    } catch (error) {
      console.error('Error in getHallById service:', error);
      throw error;
    }
  }

  // Tạo sảnh mới
  async createHall(hallData) {
    try {
      const [result] = await db.query(
        'INSERT INTO SanhTiec (TenSanh, SucChua, GiaThue, ID_LoaiSanh) VALUES (?, ?, ?, ?)',
        [hallData.TenSanh, hallData.SucChua, hallData.GiaThue, hallData.ID_LoaiSanh]
      );
      return this.getHallById(result.insertId);
    } catch (error) {
      console.error('Error in createHall service:', error);
      throw error;
    }
  }

  // Cập nhật thông tin sảnh
  async updateHall(hallId, hallData) {
    try {
      await db.query(
        'UPDATE SanhTiec SET TenSanh = ?, SucChua = ?, GiaThue = ?, ID_LoaiSanh = ? WHERE ID_SanhTiec = ?',
        [hallData.TenSanh, hallData.SucChua, hallData.GiaThue, hallData.ID_LoaiSanh, hallId]
      );
      return this.getHallById(hallId);
    } catch (error) {
      console.error('Error in updateHall service:', error);
      throw error;
    }
  }

  // Xóa sảnh
  async deleteHall(hallId) {
    try {
      const [result] = await db.query('DELETE FROM SanhTiec WHERE ID_SanhTiec = ?', [hallId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in deleteHall service:', error);
      throw error;
    }
  }

  // Lấy tất cả loại sảnh
  async getAllHallTypes() {
    try {
      const [types] = await db.query('SELECT * FROM LoaiSanh ORDER BY TenLoai');
      return types;
    } catch (error) {
      console.error('Error in getAllHallTypes service:', error);
      throw error;
    }
  }

  // Tạo loại sảnh mới
  async createHallType(typeData) {
    try {
      const [result] = await db.query(
        'INSERT INTO LoaiSanh (TenLoai, GiaBanToiThieu) VALUES (?, ?)',
        [typeData.TenLoai, typeData.GiaBanToiThieu]
      );
      const [newType] = await db.query('SELECT * FROM LoaiSanh WHERE ID_LoaiSanh = ?', [result.insertId]);
      return newType[0];
    } catch (error) {
      console.error('Error in createHallType service:', error);
      throw error;
    }
  }

  // Cập nhật loại sảnh
  async updateHallType(typeId, typeData) {
    try {
      await db.query(
        'UPDATE LoaiSanh SET TenLoai = ?, GiaBanToiThieu = ? WHERE ID_LoaiSanh = ?',
        [typeData.TenLoai, typeData.GiaBanToiThieu, typeId]
      );
      const [updatedType] = await db.query('SELECT * FROM LoaiSanh WHERE ID_LoaiSanh = ?', [typeId]);
      return updatedType[0];
    } catch (error) {
      console.error('Error in updateHallType service:', error);
      throw error;
    }
  }

  // Xóa loại sảnh
  async deleteHallType(typeId) {
    try {
      const [result] = await db.query('DELETE FROM LoaiSanh WHERE ID_LoaiSanh = ?', [typeId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in deleteHallType service:', error);
      throw error;
    }
  }
}

module.exports = new HallManagementService();