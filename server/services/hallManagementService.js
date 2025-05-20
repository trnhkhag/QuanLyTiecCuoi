const db = require('../config/db');

class HallManagementService {
  // Lấy tất cả sảnh kèm thông tin loại
  async getAllHalls() {
    try {
      const [halls] = await db.query(`
        SELECT s.ID_SanhTiec, s.TenSanh, s.SucChua, s.GiaThue, s.HinhAnh,
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
        SELECT s.ID_SanhTiec, s.TenSanh, s.SucChua, s.GiaThue, s.HinhAnh,
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
        'INSERT INTO SanhTiec (TenSanh, SucChua, GiaThue, ID_LoaiSanh, HinhAnh) VALUES (?, ?, ?, ?, ?)',
        [hallData.TenSanh, hallData.SucChua, hallData.GiaThue, hallData.ID_LoaiSanh, hallData.HinhAnh]
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
      const updateFields = [];
      const params = [];

      if (hallData.TenSanh !== undefined) {
        updateFields.push('TenSanh = ?');
        params.push(hallData.TenSanh);
      }
      if (hallData.SucChua !== undefined) {
        updateFields.push('SucChua = ?');
        params.push(hallData.SucChua);
      }
      if (hallData.GiaThue !== undefined) {
        updateFields.push('GiaThue = ?');
        params.push(hallData.GiaThue);
      }
      if (hallData.ID_LoaiSanh !== undefined) {
        updateFields.push('ID_LoaiSanh = ?');
        params.push(hallData.ID_LoaiSanh);
      }
      if (hallData.HinhAnh !== undefined) {
        updateFields.push('HinhAnh = ?');
        params.push(hallData.HinhAnh);
      }

      params.push(hallId);

      await db.query(
        `UPDATE SanhTiec SET ${updateFields.join(', ')} WHERE ID_SanhTiec = ?`,
        params
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
}

module.exports = new HallManagementService();