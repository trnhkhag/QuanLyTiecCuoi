const db = require('../config/db');

class HallService {
  // Lấy tất cả sảnh kèm thông tin loại
  async getAllHalls() {
    try {
      // JOIN với bảng LoaiSanh để lấy thông tin loại
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
      
      // Nếu không tìm thấy sảnh
      if (halls.length === 0) {
        return null;
      }

      return halls[0];
    } catch (error) {
      console.error(`Error in getHallById service for ID ${hallId}:`, error);
      throw error;
    }
  }

  // Kiểm tra sảnh có thể đặt vào ngày và ca được chọn
  async checkHallAvailability(hallId, date, shiftId) {
    try {
      // Kiểm tra xem sảnh đã được đặt cho ngày và ca này chưa
      const [bookings] = await db.query(`
        SELECT ID_TiecCuoi 
        FROM TiecCuoi
        WHERE ID_SanhTiec = ? AND NgayToChuc = ? AND ID_Ca = ? AND TrangThai != 'Đã hủy'
      `, [hallId, date, shiftId]);
      
      // Nếu có booking thì sảnh không available
      return bookings.length === 0;
    } catch (error) {
      console.error('Error in checkHallAvailability service:', error);
      throw error;
    }
  }
}

module.exports = new HallService();