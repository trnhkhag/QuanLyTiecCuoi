// filepath: d:\CNPM\QuanLyTiecCuoi\server\TraCuuTiecCuoi\weddingLookupController.js
const weddingLookupService = require('../services/WeddingLookupService');

/**
 * Controller quản lý API tra cứu thông tin tiệc cưới
 */
class WeddingLookupController {
  /**
   * Tìm kiếm danh sách tiệc cưới theo ngày, sảnh, khách hàng
   * GET /api/lookup/bookings
   */
  async searchBookings(req, res) {
    try {
      const filters = {
        date: req.query.date || null,
        hallName: req.query.hallName || null,
        customerName: req.query.customerName || null
      };

      const results = await weddingLookupService.getAllBookings(filters);

      return res.status(200).json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (error) {
      console.error('Tra cứu danh sách tiệc cưới lỗi:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tra cứu danh sách tiệc cưới',
        error: error.message
      });
    }
  }

  /**
   * Lấy chi tiết tiệc cưới theo ID
   * GET /api/lookup/bookings/:id
   */
  async getBookingDetail(req, res) {
    try {
      const bookingId = parseInt(req.params.id);

      if (isNaN(bookingId)) {
        return res.status(400).json({
          success: false,
          message: 'ID đặt tiệc không hợp lệ',
          error: 'Invalid booking ID'
        });
      }

      const booking = await weddingLookupService.getBookingById(bookingId);

      return res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết tiệc cưới:', error);

      if (error.message === 'Không tìm thấy đặt tiệc') {
        return res.status(404).json({
          success: false,
          message: error.message,
          error: 'Booking not found'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy chi tiết tiệc cưới',
        error: error.message
      });
    }
  }
}

module.exports = new WeddingLookupController();