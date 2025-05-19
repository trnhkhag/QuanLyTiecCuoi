const pool = require('../config/db');

class WeddingLookupService {
  /**
   * Lấy danh sách các tiệc cưới có thể lọc theo ngày hoặc tên khách hàng
   */
  async getAllBookings(filters = {}) {
    try {
      let query = `
        SELECT t.ID_TiecCuoi, k.HoTen AS TenKhachHang, k.SoDienThoai,
               s.TenSanh, t.NgayToChuc, c.TenCa, t.SoLuongBan,
               t.SoBanDuTru, h.TienThanhToan AS TienCoc
        FROM TiecCuoi t
        JOIN KhachHang k ON t.ID_KhachHang = k.ID_KhachHang
        JOIN SanhTiec s ON t.ID_SanhTiec = s.ID_SanhTiec
        JOIN CaTiec c ON t.ID_Ca = c.ID_Ca
        LEFT JOIN HoaDon h ON t.ID_TiecCuoi = h.ID_TiecCuoi AND h.LoaiHoaDon = 'Đặt cọc'
        WHERE 1=1
      `;

      const queryParams = [];

      if (filters.date) {
        query += ' AND t.NgayToChuc = ?';
        queryParams.push(filters.date);
      }

      if (filters.customerName) {
        query += ' AND k.HoTen LIKE ?';
        queryParams.push(`%${filters.customerName}%`);
      }

      if (filters.hallName) {
        query += ' AND s.TenSanh LIKE ?';
        queryParams.push(`%${filters.hallName}%`);
      }

      query += ' ORDER BY t.NgayToChuc DESC';

      const [rows] = await pool.query(query, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết một tiệc cưới
   */
  async getBookingById(bookingId) {
    try {
      const [rows] = await pool.query(
        `SELECT t.*, k.HoTen AS TenKhachHang, k.SoDienThoai,
                s.TenSanh, s.GiaThue, c.TenCa,
                h.TienThanhToan AS TienCoc
         FROM TiecCuoi t
         JOIN KhachHang k ON t.ID_KhachHang = k.ID_KhachHang
         JOIN SanhTiec s ON t.ID_SanhTiec = s.ID_SanhTiec
         JOIN CaTiec c ON t.ID_Ca = c.ID_Ca
         LEFT JOIN HoaDon h ON t.ID_TiecCuoi = h.ID_TiecCuoi AND h.LoaiHoaDon = 'Đặt cọc'
         WHERE t.ID_TiecCuoi = ?`,
        [bookingId]
      );

      if (rows.length === 0) {
        throw new Error('Không tìm thấy tiệc cưới');
      }

      const booking = rows[0];

      // Lấy danh sách dịch vụ đi kèm
      const [services] = await pool.query(
        `SELECT td.*, d.TenDichVu 
         FROM Tiec_DichVu td 
         JOIN DichVu d ON td.ID_DichVu = d.ID_DichVu
         WHERE td.ID_TiecCuoi = ?`,
        [bookingId]
      );

      booking.services = services;

      return booking;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new WeddingLookupService();