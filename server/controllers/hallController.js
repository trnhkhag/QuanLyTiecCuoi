const hallService = require('../services/hallService');

class HallController {
  // Lấy danh sách tất cả sảnh
  async getAllHalls(req, res) {
    try {
      const halls = await hallService.getAllHalls();
      
      res.json({
        success: true,
        data: halls
      });
    } catch (error) {
      console.error('Error in getAllHalls controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách sảnh cưới',
        error: error.message
      });
    }
  }

  // Lấy thông tin chi tiết một sảnh
  async getHallById(req, res) {
    try {
      const hallId = req.params.id;
      
      // Kiểm tra ID có hợp lệ không
      if (!hallId || isNaN(hallId)) {
        return res.status(400).json({
          success: false,
          message: 'ID sảnh không hợp lệ'
        });
      }
      
      const hall = await hallService.getHallById(hallId);
      
      // Nếu không tìm thấy sảnh
      if (!hall) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin sảnh'
        });
      }
      
      res.json({
        success: true,
        data: hall
      });
    } catch (error) {
      console.error(`Error in getHallById controller for ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin chi tiết sảnh',
        error: error.message
      });
    }
  }

  // Kiểm tra sảnh có thể đặt vào ngày và ca được chọn
  async checkHallAvailability(req, res) {
    try {
      const { hallId, date, shiftId } = req.query;
      
      // Kiểm tra tham số
      if (!hallId || !date || !shiftId) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin cần thiết (hallId, date, shiftId)'
        });
      }
      
      const isAvailable = await hallService.checkHallAvailability(hallId, date, shiftId);
      
      res.json({
        success: true,
        data: {
          isAvailable,
          hallId,
          date,
          shiftId
        }
      });
    } catch (error) {
      console.error('Error in checkHallAvailability controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi kiểm tra tình trạng sảnh',
        error: error.message
      });
    }
  }
}

module.exports = new HallController();