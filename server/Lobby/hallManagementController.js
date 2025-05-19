const hallManagementService = require('./hallManagementService');

class HallManagementController {
  // Lấy danh sách tất cả sảnh
  async getAllHalls(req, res) {
    try {
      const halls = await hallManagementService.getAllHalls();
      res.json({
        success: true,
        data: halls
      });
    } catch (error) {
      console.error('Error in getAllHalls controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách sảnh',
        error: error.message
      });
    }
  }

  // Lấy chi tiết sảnh
  async getHallById(req, res) {
    try {
      const hallId = req.params.id;
      const hall = await hallManagementService.getHallById(hallId);
      
      if (!hall) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sảnh'
        });
      }

      res.json({
        success: true,
        data: hall
      });
    } catch (error) {
      console.error('Error in getHallById controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin sảnh',
        error: error.message
      });
    }
  }

  // Tạo sảnh mới
  async createHall(req, res) {
    try {
      const hallData = req.body;
      
      // Thêm đường dẫn ảnh nếu có upload file
      if (req.file) {
        hallData.HinhAnh = '/uploads/halls/' + req.file.filename;
      }
      
      // Validate dữ liệu đầu vào
      if (!hallData.TenSanh || !hallData.SucChua || !hallData.GiaThue || !hallData.ID_LoaiSanh) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin sảnh bắt buộc'
        });
      }

      const newHall = await hallManagementService.createHall(hallData);
      res.status(201).json({
        success: true,
        message: 'Tạo sảnh mới thành công',
        data: newHall
      });
    } catch (error) {
      console.error('Error in createHall controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo sảnh mới',
        error: error.message
      });
    }
  }

  // Cập nhật sảnh
  async updateHall(req, res) {
    try {
      const hallId = req.params.id;
      const hallData = req.body;

      // Validate dữ liệu đầu vào cơ bản
      if (!hallData.TenSanh || !hallData.SucChua || !hallData.GiaThue || !hallData.ID_LoaiSanh) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin sảnh bắt buộc'
        });
      }

      // Thêm đường dẫn ảnh nếu có upload file mới
      if (req.file) {
        hallData.HinhAnh = '/uploads/halls/' + req.file.filename;
      }

      const updatedHall = await hallManagementService.updateHall(hallId, hallData);
      
      if (!updatedHall) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sảnh để cập nhật'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật sảnh thành công',
        data: updatedHall
      });
    } catch (error) {
      console.error('Error in updateHall controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật sảnh',
        error: error.message
      });
    }
  }

  // Xóa sảnh
  async deleteHall(req, res) {
    try {
      const hallId = req.params.id;
      const result = await hallManagementService.deleteHall(hallId);
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sảnh để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa sảnh thành công'
      });
    } catch (error) {
      console.error('Error in deleteHall controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa sảnh',
        error: error.message
      });
    }
  }

  // Lấy danh sách loại sảnh
  async getAllHallTypes(req, res) {
    try {
      const types = await hallManagementService.getAllHallTypes();
      res.json({
        success: true,
        data: types
      });
    } catch (error) {
      console.error('Error in getAllHallTypes controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách loại sảnh',
        error: error.message
      });
    }
  }

  // Tạo loại sảnh mới
  async createHallType(req, res) {
    try {
      const typeData = req.body;

      if (!typeData.TenLoai || !typeData.GiaBanToiThieu) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin loại sảnh bắt buộc'
        });
      }

      const newType = await hallManagementService.createHallType(typeData);
      res.status(201).json({
        success: true,
        message: 'Tạo loại sảnh mới thành công',
        data: newType
      });
    } catch (error) {
      console.error('Error in createHallType controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo loại sảnh mới',
        error: error.message
      });
    }
  }

  // Cập nhật loại sảnh
  async updateHallType(req, res) {
    try {
      const typeId = req.params.id;
      const typeData = req.body;

      if (!typeData.TenLoai || !typeData.GiaBanToiThieu) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin loại sảnh bắt buộc'
        });
      }

      const updatedType = await hallManagementService.updateHallType(typeId, typeData);
      
      if (!updatedType) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy loại sảnh để cập nhật'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật loại sảnh thành công',
        data: updatedType
      });
    } catch (error) {
      console.error('Error in updateHallType controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật loại sảnh',
        error: error.message
      });
    }
  }

  // Xóa loại sảnh
  async deleteHallType(req, res) {
    try {
      const typeId = req.params.id;
      const result = await hallManagementService.deleteHallType(typeId);
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy loại sảnh để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa loại sảnh thành công'
      });
    } catch (error) {
      console.error('Error in deleteHallType controller:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa loại sảnh',
        error: error.message
      });
    }
  }
}

module.exports = new HallManagementController();