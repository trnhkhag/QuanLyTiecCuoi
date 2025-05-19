// filepath: d:\CNPM\QuanLyTiecCuoi\server\DatTiec\weddingBookingController.js
const weddingBookingService = require('./weddingBookingService');

/**
 * Controller quản lý các API cho chức năng đặt tiệc cưới
 */
class WeddingBookingController {
  /**
   * Tạo đặt tiệc mới
   * POST /api/bookings
   */
  async createBooking(req, res) {
    try {
      const bookingData = req.body;
      
      // Validate dữ liệu
      if (!bookingData.customerId || !bookingData.hallId || !bookingData.weddingDate || 
          !bookingData.shiftId || !bookingData.tableCount) {
        return res.status(400).json({ 
          success: false,
          message: 'Thiếu thông tin bắt buộc',
          missingFields: [
            !bookingData.customerId ? 'customerId' : null,
            !bookingData.hallId ? 'hallId' : null,
            !bookingData.weddingDate ? 'weddingDate' : null,
            !bookingData.shiftId ? 'shiftId' : null,
            !bookingData.tableCount ? 'tableCount' : null
          ].filter(Boolean)
        });
      }
      
      // Validate wedding date
      const weddingDate = new Date(bookingData.weddingDate);
      const today = new Date();
      
      if (isNaN(weddingDate.getTime()) || weddingDate < today) {
        return res.status(400).json({ 
          success: false,
          message: 'Ngày tổ chức không hợp lệ',
          error: 'Wedding date must be in the future'
        });
      }
      
      const result = await weddingBookingService.createBooking(bookingData);
      return res.status(201).json({
        success: true,
        message: 'Đặt tiệc thành công',
        data: result
      });
    } catch (error) {
      console.error('Create booking error:', error);
      
      if (error.message === 'Sảnh đã được đặt vào ngày và ca này') {
        return res.status(409).json({
          success: false,
          message: error.message,
          error: 'Hall already booked'
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi khi tạo đặt tiệc', 
        error: error.message 
      });
    }
  }

  /**
   * Lấy danh sách đặt tiệc
   * GET /api/bookings
   */
  async getAllBookings(req, res) {
    try {
      // Lấy các tham số lọc từ query
      const filters = {
        date: req.query.date,
        hallId: req.query.hallId ? parseInt(req.query.hallId) : null,
        customerId: req.query.customerId ? parseInt(req.query.customerId) : null,
        status: req.query.status
      };
      
      const bookings = await weddingBookingService.getAllBookings(filters);
      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error) {
      console.error('Get bookings error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi khi lấy danh sách đặt tiệc', 
        error: error.message 
      });
    }
  }

  /**
   * Lấy chi tiết đặt tiệc
   * GET /api/bookings/:id
   */
  async getBookingById(req, res) {
    try {
      const bookingId = parseInt(req.params.id);
      
      if (isNaN(bookingId)) {
        return res.status(400).json({
          success: false,
          message: 'ID không hợp lệ',
          error: 'Invalid booking ID'
        });
      }
      
      const booking = await weddingBookingService.getBookingById(bookingId);
      return res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      console.error('Get booking detail error:', error);
      
      if (error.message === 'Không tìm thấy đặt tiệc') {
        return res.status(404).json({
          success: false,
          message: error.message,
          error: 'Booking not found'
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi khi lấy chi tiết đặt tiệc', 
        error: error.message 
      });
    }
  }

  /**
   * Cập nhật thông tin đặt tiệc
   * PUT /api/bookings/:id
   */
  async updateBooking(req, res) {
    try {
      const bookingId = parseInt(req.params.id);
      const updateData = req.body;
      
      if (isNaN(bookingId)) {
        return res.status(400).json({
          success: false,
          message: 'ID không hợp lệ',
          error: 'Invalid booking ID'
        });
      }
      
      // Validate dữ liệu cơ bản
      if (!updateData.tableCount) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin số lượng bàn',
          error: 'Table count is required'
        });
      }
      
      const result = await weddingBookingService.updateBooking(bookingId, updateData);
      return res.status(200).json({
        success: true,
        message: 'Cập nhật đặt tiệc thành công',
        data: result
      });
    } catch (error) {
      console.error('Update booking error:', error);
      
      if (error.message === 'Không tìm thấy đặt tiệc') {
        return res.status(404).json({
          success: false,
          message: error.message,
          error: 'Booking not found'
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi khi cập nhật đặt tiệc', 
        error: error.message 
      });
    }
  }

  /**
   * Hủy đặt tiệc
   * DELETE /api/bookings/:id
   */
  async cancelBooking(req, res) {
    try {
      const bookingId = parseInt(req.params.id);
      const { reason } = req.body;
      
      if (isNaN(bookingId)) {
        return res.status(400).json({
          success: false,
          message: 'ID không hợp lệ',
          error: 'Invalid booking ID'
        });
      }
      
      // Validate reason
      if (!reason || reason.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Cần cung cấp lý do hủy',
          error: 'Cancellation reason is required'
        });
      }
      
      const result = await weddingBookingService.cancelBooking(bookingId, reason);
      return res.status(200).json({
        success: true,
        message: 'Hủy đặt tiệc thành công',
        data: result
      });
    } catch (error) {
      console.error('Cancel booking error:', error);
      
      if (error.message === 'Không tìm thấy đặt tiệc') {
        return res.status(404).json({
          success: false,
          message: error.message,
          error: 'Booking not found'
        });
      }
      
      if (error.message === 'Không thể hủy đặt tiệc quá gần ngày tổ chức') {
        return res.status(400).json({
          success: false,
          message: error.message,
          error: 'Cannot cancel booking too close to event date'
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi khi hủy đặt tiệc', 
        error: error.message 
      });
    }
  }

}

module.exports = new WeddingBookingController();
