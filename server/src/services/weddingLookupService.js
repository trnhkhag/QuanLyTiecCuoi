const { pool } = require('../config/db');

class weddingLookupService {
  /**
   * Lấy danh sách các tiệc cưới có thể lọc theo ngày hoặc tên khách hàng
   */
  async getAllBookings(filters = {}) {
    try {
      let query = `
        SELECT t.ID_TiecCuoi, t.ID_KhachHang, k.HoTen AS TenKhachHang, k.SoDienThoai,
               t.ID_SanhTiec, s.TenSanh, t.NgayToChuc, t.ID_Ca, c.TenCa, 
               t.SoLuongBan, t.SoBanDuTru, t.TrangThai, t.ThoiDiemDat,
               h.TienThanhToan AS TienCoc, s.GiaThue
        FROM TiecCuoi t
        JOIN KhachHang k ON t.ID_KhachHang = k.ID_KhachHang
        JOIN SanhTiec s ON t.ID_SanhTiec = s.ID_SanhTiec
        JOIN CaTiec c ON t.ID_Ca = c.ID_Ca
        LEFT JOIN HoaDon h ON t.ID_TiecCuoi = h.ID_TiecCuoi AND h.LoaiHoaDon = 'Thanh toán đặt cọc'
        WHERE 1=1
      `;

      const queryParams = [];

      if (filters.date) {
        query += ' AND DATE(t.NgayToChuc) = ?';
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

      if (filters.hallId) {
        query += ' AND t.ID_SanhTiec = ?';
        queryParams.push(filters.hallId);
      }
      
      if (filters.status) {
        query += ' AND t.TrangThai = ?';
        queryParams.push(filters.status);
      }

      query += ' ORDER BY t.NgayToChuc DESC';

      console.log('Query:', query);
      console.log('Params:', queryParams);

      const [rows] = await pool.query(query, queryParams);
      console.log(`Found ${rows.length} bookings`);
      return rows;
    } catch (error) {
      console.error('Error in getAllBookings:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một tiệc cưới
   */
  async getBookingById(bookingId) {
    try {
      //s.TenSanh, s.GiaThue, c.TenCa, c.ThoiGianBatDau, c.ThoiGianKetThuc,
      const [rows] = await pool.query(
        `SELECT t.*, k.HoTen AS TenKhachHang, k.SoDienThoai,
                s.TenSanh, s.GiaThue, c.TenCa, 
                h.TienThanhToan AS TienCoc, h.TongTien
         FROM TiecCuoi t
         JOIN KhachHang k ON t.ID_KhachHang = k.ID_KhachHang
         JOIN SanhTiec s ON t.ID_SanhTiec = s.ID_SanhTiec
         JOIN CaTiec c ON t.ID_Ca = c.ID_Ca
         LEFT JOIN HoaDon h ON t.ID_TiecCuoi = h.ID_TiecCuoi AND h.LoaiHoaDon = 'Thanh toán đặt cọc'
         WHERE t.ID_TiecCuoi = ?`,
        [bookingId]
      );

      if (rows.length === 0) {
        throw new Error("Không tìm thấy tiệc cưới");
      }

      const booking = rows[0];

      // Lấy danh sách dịch vụ đi kèm
      const [services] = await pool.query(
        `SELECT td.*, d.TenDichVu, d.DonGia AS Gia
         FROM Tiec_DichVu td 
         JOIN DichVu d ON td.ID_DichVu = d.ID_DichVu
         WHERE td.ID_TiecCuoi = ?`,
        [bookingId]
      );

      booking.DichVu = services;

      // Lấy danh sách món ăn nếu có
      const [foods] = await pool.query(
        `SELECT tm.*, m.TenMonAn
         FROM Tiec_MonAn tm
         JOIN MonAn m ON tm.ID_MonAn = m.ID_MonAn
         WHERE tm.ID_TiecCuoi = ?`,
        [bookingId]
      );

      booking.MonAn = foods;

      return booking;
    } catch (error) {
      console.error('Error in getBookingById:', error);
      throw error;
    }
  }
}

module.exports = new weddingLookupService();