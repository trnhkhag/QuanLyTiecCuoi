const pool = require('../config/db');

class WeddingBookingService {
  /**
   * Tạo mới đặt tiệc
   */
  async createBooking(bookingData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Kiểm tra sảnh có sẵn không
      const isAvailable = await this.checkHallAvailability(
        bookingData.hallId, 
        bookingData.weddingDate, 
        bookingData.shiftId
      );
      
      if (!isAvailable) {
        throw new Error('Sảnh đã được đặt vào ngày và ca này');
      }
      
      // 1. Tạo đặt tiệc cơ bản
      const [result] = await connection.query(
        `INSERT INTO TiecCuoi (
          ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, 
          ThoiDiemDat, SoLuongBan, SoBanDuTru
        ) VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
        [
          bookingData.customerId,
          bookingData.hallId,
          bookingData.weddingDate,
          bookingData.shiftId,
          bookingData.tableCount,
          bookingData.reserveTableCount
        ]
      );
      
      const bookingId = result.insertId;
      
      // 2. Thêm các dịch vụ đã chọn
      if (bookingData.services && bookingData.services.length > 0) {
        const serviceValues = bookingData.services.map(service => [
          bookingId,
          service.serviceId,
          service.quantity,
          service.price
        ]);
        
        await connection.query(
          `INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) 
           VALUES ?`,
          [serviceValues]
        );
      }
      
      // 3. Tạo hóa đơn đặt cọc
      await connection.query(
        `INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon) 
         VALUES (?, CURDATE(), ?, ?, 'Đặt cọc')`,
        [bookingId, bookingData.deposit, bookingData.deposit]
      );
      
      await connection.commit();
      
      return { bookingId, message: 'Đặt tiệc thành công' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Lấy danh sách đặt tiệc
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
      
      // Thêm các điều kiện lọc nếu có
      if (filters.date) {
        query += " AND t.NgayToChuc = ?";
        queryParams.push(filters.date);
      }
      
      if (filters.hallId) {
        query += " AND t.ID_SanhTiec = ?";
        queryParams.push(filters.hallId);
      }
      
      if (filters.customerId) {
        query += " AND t.ID_KhachHang = ?";
        queryParams.push(filters.customerId);
      }
      
      query += " ORDER BY t.NgayToChuc DESC";
      
      const [rows] = await pool.query(query, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết đặt tiệc
   */
  async getBookingById(bookingId) {
    try {
      // 1. Lấy thông tin cơ bản về đặt tiệc
      const [bookingRows] = await pool.query(
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
      
      if (bookingRows.length === 0) {
        throw new Error('Không tìm thấy đặt tiệc');
      }
      
      const booking = bookingRows[0];
      
      // 2. Lấy thông tin dịch vụ
      const [serviceRows] = await pool.query(
        `SELECT td.*, d.TenDichVu
         FROM Tiec_DichVu td
         JOIN DichVu d ON td.ID_DichVu = d.ID_DichVu
         WHERE td.ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      booking.services = serviceRows;
      
      return booking;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật thông tin đặt tiệc
   */
  async updateBooking(bookingId, updateData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 1. Cập nhật thông tin cơ bản
      await connection.query(
        `UPDATE TiecCuoi 
         SET SoLuongBan = ?, SoBanDuTru = ?
         WHERE ID_TiecCuoi = ?`,
        [updateData.tableCount, updateData.reserveTableCount, bookingId]
      );
      
      // 2. Xóa dịch vụ cũ
      await connection.query(
        `DELETE FROM Tiec_DichVu WHERE ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      // 3. Thêm dịch vụ mới
      if (updateData.services && updateData.services.length > 0) {
        const serviceValues = updateData.services.map(service => [
          bookingId,
          service.serviceId,
          service.quantity,
          service.price
        ]);
        
        await connection.query(
          `INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) 
           VALUES ?`,
          [serviceValues]
        );
      }
      
      await connection.commit();
      
      return { message: 'Cập nhật đặt tiệc thành công' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Hủy đặt tiệc
   */
  async cancelBooking(bookingId, reason) {
    try {
      await pool.query(
        `DELETE FROM Tiec_DichVu WHERE ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      await pool.query(
        `DELETE FROM HoaDon WHERE ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      await pool.query(
        `DELETE FROM TiecCuoi WHERE ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      return { message: 'Hủy đặt tiệc thành công' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new WeddingBookingService();