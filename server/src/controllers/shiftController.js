const shiftModel = require('../services/shiftService');

class ShiftController {
  // GET /v1/wedding-service/ca-tiec
  async getAllShifts(req, res) {
    try {
      const shifts = await shiftModel.getAllShifts();
      return res.status(200).json({ success: true, data: shifts, message: 'Lấy danh sách ca tiệc thành công' });
    } catch (err) {
      console.error('Controller - getAllShifts error:', err);
      return res.status(500).json({ success: false, message: 'Không thể lấy danh sách ca tiệc' });
    }
  }

  // GET /v1/wedding-service/ca-tiec/:id
  async getShiftById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const shift = await shiftModel.getShiftById(id);
      
      if (!shift) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy ca tiệc' });
      }

      return res.status(200).json({ success: true, data: shift, message: 'Lấy ca tiệc thành công' });
    } catch (err) {
      console.error('Controller - getShiftById error:', err);
      return res.status(500).json({ success: false, message: 'Không thể lấy thông tin ca tiệc' });
    }
  }
}

module.exports = new ShiftController();