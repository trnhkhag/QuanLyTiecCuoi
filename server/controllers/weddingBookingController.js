const weddingBookingService = require('../services/weddingBookingService');
const pool = require('../config/db');

/**
 * Controller quản lý các API cho chức năng đặt tiệc cưới
 */
class WeddingBookingController {
  /**
   * Tạo đặt tiệc mới
   * POST /api/bookings
   */  async createBooking(req, res) {
    const connection = await pool.getConnection();
    
    try {
      // Lấy dữ liệu từ request
      const bookingData = req.body;
      console.log('Received booking data:', bookingData);
        // Debug required fields
      console.log('Validating required fields:', {
        hallId: bookingData.hallId,
        weddingDate: bookingData.weddingDate,
        shiftId: bookingData.shiftId,
        type: {
          hallId: typeof bookingData.hallId,
          weddingDate: typeof bookingData.weddingDate,
          shiftId: typeof bookingData.shiftId
        }
      });

      // Validate required fields
      if (!bookingData.hallId || !bookingData.weddingDate || !bookingData.shiftId) {
        console.error('Missing required fields:', {
          hallId: bookingData.hallId || 'Missing',
          weddingDate: bookingData.weddingDate || 'Missing',
          shiftId: bookingData.shiftId || 'Missing'
        });
        
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc',
          error: 'Missing required fields'
        });
      }
      
      await connection.beginTransaction();
      
      // Luôn sử dụng khách hàng mẫu có sẵn trong database (ID=1)
      // Sử dụng let thay vì const vì biến này có thể thay đổi giá trị sau này
      let customerId = 1;
      console.log('Using sample customer with ID:', customerId);
      
      /* 
       * Đã bỏ phần tạo khách hàng mới vì hiện chưa có chức năng login
       * Sau này sẽ thêm chức năng đăng nhập và tạo khách hàng mới khi người dùng đăng nhập
       * Hiện tại chỉ sử dụng khách hàng mẫu đã có sẵn trong database với ID=1
       */      // Format wedding date to YYYY-MM-DD for MySQL compatibility
      let formattedWeddingDate = bookingData.weddingDate;
      if (bookingData.weddingDate && bookingData.weddingDate.includes('T')) {
        formattedWeddingDate = bookingData.weddingDate.split('T')[0];
        console.log('Formatted wedding date:', formattedWeddingDate);
      }      // Chuẩn bị dữ liệu cho booking service      
      const serviceBookingData = {
        customerId,
        // Remove customerName as it's not in the TiecCuoi table schema
        hallId: parseInt(bookingData.hallId),
        weddingDate: formattedWeddingDate, // Use the formatted date
        shiftId: parseInt(bookingData.shiftId),
        tableCount: parseInt(bookingData.numberOfTables) || 0,
        reserveTableCount: parseInt(bookingData.numberOfGuests) || 0, // Using guest count as reserve tables for now
        note: bookingData.note || '',
        deposit: parseInt(bookingData.deposit) || 0,
        services: []
      };
      
      console.log('Prepared booking data:', serviceBookingData);// Xử lý dịch vụ nếu có
      if (bookingData.services && bookingData.services.length > 0) {
        console.log('Processing services:', bookingData.services);
        
        for (const service of bookingData.services) {
          // Log để debug
          console.log('Processing service:', service);
          
          if (!service.id) {
            console.warn('Missing service ID, skipping service:', service);
            continue;
          }
          
          try {
            const [serviceData] = await connection.query(
              'SELECT DonGia FROM DichVu WHERE ID_DichVu = ?',
              [service.id]
            );
            
            if (serviceData && serviceData.length > 0) {
              const serviceItem = {
                id: parseInt(service.id),
                quantity: parseInt(service.quantity) || 1,
                price: parseFloat(serviceData[0].DonGia)
              };
              
              console.log('Adding service to booking data:', serviceItem);
              serviceBookingData.services.push(serviceItem);
            } else {
              console.warn('Service not found in database:', service.id);
            }
          } catch (serviceError) {
            console.error('Error processing service:', serviceError);
          }
        }
      }
      
      // Kiểm tra sảnh có sẵn không
      const isAvailable = await weddingBookingService.checkHallAvailability(
        serviceBookingData.hallId,
        serviceBookingData.weddingDate,
        serviceBookingData.shiftId
      );
      
      if (!isAvailable) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Sảnh đã được đặt vào ngày và ca này',
          error: 'Hall already booked'
        });
      }
        // Chỉ commit khi xác minh sảnh có sẵn
      // await connection.commit();
      
      try {
        // Gọi service để tạo đặt tiệc
        const result = await weddingBookingService.createBooking(serviceBookingData);
        
        await connection.commit();
        
        res.status(201).json({
          success: true,
          message: 'Đặt tiệc thành công',
          data: result
        });
      } catch (serviceError) {
        await connection.rollback();
        console.error('Error in booking service:', serviceError);
        res.status(500).json({
          success: false,
          message: 'Lỗi khi tạo đơn đặt tiệc',
          error: serviceError.message
        });
      }
      
    } catch (error) {
      await connection.rollback();
      console.error('Error creating booking:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo đơn đặt tiệc',
        error: error.message
      });
    } finally {
      connection.release();
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

  /**
   * Cập nhật trạng thái đặt tiệc
   * PATCH /api/bookings/:id/status
   */
  async updateBookingStatus(req, res) {
    try {
      const bookingId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (isNaN(bookingId)) {
        return res.status(400).json({
          success: false,
          message: 'ID không hợp lệ',
          error: 'Invalid booking ID'
        });
      }
      
      // Validate status
      if (!status || status.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Cần cung cấp trạng thái mới',
          error: 'Status is required'
        });
      }
      
      // Call service to update booking status
      await pool.query(
        'UPDATE TiecCuoi SET TrangThai = ? WHERE ID_TiecCuoi = ?',
        [status, bookingId]
      );
      
      return res.status(200).json({
        success: true,
        message: 'Cập nhật trạng thái đặt tiệc thành công',
        data: { bookingId, status }
      });
    } catch (error) {
      console.error('Update booking status error:', error);
      
      if (error.message === 'Không tìm thấy đặt tiệc') {
        return res.status(404).json({
          success: false,
          message: error.message,
          error: 'Booking not found'
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi khi cập nhật trạng thái đặt tiệc', 
        error: error.message 
      });
    }
  }
}

module.exports = new WeddingBookingController();
