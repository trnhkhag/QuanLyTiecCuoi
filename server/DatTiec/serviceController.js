const serviceService = require('./serviceService');

class ServiceController {
  // Lấy tất cả dịch vụ
  async getAllServices(req, res) {
    try {
      const services = await serviceService.getAllServices();
      
      res.json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error('Error in getAllServices controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách dịch vụ',
        error: error.message
      });
    }
  }

  // Lấy chi tiết dịch vụ
  async getServiceById(req, res) {
    try {
      const serviceId = req.params.id;
      
      // Kiểm tra ID có hợp lệ không
      if (!serviceId || isNaN(serviceId)) {
        return res.status(400).json({
          success: false,
          message: 'ID dịch vụ không hợp lệ'
        });
      }
      
      const service = await serviceService.getServiceById(serviceId);
      
      // Nếu không tìm thấy dịch vụ
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin dịch vụ'
        });
      }
      
      res.json({
        success: true,
        data: service
      });
    } catch (error) {
      console.error(`Error in getServiceById controller for ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin chi tiết dịch vụ',
        error: error.message
      });
    }
  }

  // Tạo dịch vụ mới
  async createService(req, res) {
    try {
      const { TenDichVu, DonGia } = req.body;
      
      // Kiểm tra thông tin đầu vào
      if (!TenDichVu || !DonGia) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin dịch vụ cần thiết (TenDichVu, DonGia)'
        });
      }
      
      // Kiểm tra định dạng giá
      if (isNaN(DonGia) || DonGia <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Giá dịch vụ không hợp lệ'
        });
      }
      
      const newService = await serviceService.createService({ TenDichVu, DonGia });
      
      res.status(201).json({
        success: true,
        message: 'Tạo dịch vụ mới thành công',
        data: newService
      });
    } catch (error) {
      console.error('Error in createService controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo dịch vụ mới',
        error: error.message
      });
    }
  }

  // Cập nhật dịch vụ
  async updateService(req, res) {
    try {
      const serviceId = req.params.id;
      const { TenDichVu, DonGia } = req.body;
      
      // Kiểm tra ID có hợp lệ không
      if (!serviceId || isNaN(serviceId)) {
        return res.status(400).json({
          success: false,
          message: 'ID dịch vụ không hợp lệ'
        });
      }
      
      // Kiểm tra thông tin đầu vào
      if (!TenDichVu || !DonGia) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin dịch vụ cần thiết (TenDichVu, DonGia)'
        });
      }
      
      // Kiểm tra định dạng giá
      if (isNaN(DonGia) || DonGia <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Giá dịch vụ không hợp lệ'
        });
      }
      
      const updatedService = await serviceService.updateService(serviceId, { TenDichVu, DonGia });
      
      // Nếu không tìm thấy dịch vụ để cập nhật
      if (!updatedService) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy dịch vụ để cập nhật'
        });
      }
      
      res.json({
        success: true,
        message: 'Cập nhật dịch vụ thành công',
        data: updatedService
      });
    } catch (error) {
      console.error(`Error in updateService controller for ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật dịch vụ',
        error: error.message
      });
    }
  }

  // Xóa dịch vụ
  async deleteService(req, res) {
    try {
      const serviceId = req.params.id;
      
      // Kiểm tra ID có hợp lệ không
      if (!serviceId || isNaN(serviceId)) {
        return res.status(400).json({
          success: false,
          message: 'ID dịch vụ không hợp lệ'
        });
      }
      
      const result = await serviceService.deleteService(serviceId);
      
      // Nếu không tìm thấy dịch vụ để xóa
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy dịch vụ để xóa'
        });
      }
      
      res.json({
        success: true,
        message: 'Xóa dịch vụ thành công'
      });
    } catch (error) {
      console.error(`Error in deleteService controller for ID ${req.params.id}:`, error);
      
      // Nếu là lỗi không thể xóa do ràng buộc khóa ngoại
      if (error.message.includes('đã được sử dụng')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa dịch vụ',
        error: error.message
      });
    }
  }
}

module.exports = new ServiceController();