const regulationService = require('./regulationService');

class RegulationController {
    // Lấy danh sách quy định
    async getAllRegulations(req, res) {
        try {
            const regulations = await regulationService.getAllRegulations();
            return res.status(200).json({
                success: true,
                data: regulations
            });
        } catch (error) {
            console.error('Get regulations error:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách quy định',
                error: error.message
            });
        }
    }

    // Lấy chi tiết quy định
    async getRegulationById(req, res) {
        try {
            const regulationId = req.params.id;
            const regulation = await regulationService.getRegulationById(regulationId);
            
            return res.status(200).json({
                success: true,
                data: regulation
            });
        } catch (error) {
            console.error('Get regulation detail error:', error);
            
            if (error.message === 'Không tìm thấy quy định') {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                    error: 'Regulation not found'
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy chi tiết quy định',
                error: error.message
            });
        }
    }

    // Cập nhật quy định
    async updateRegulation(req, res) {
        try {
            const regulationId = req.params.id;
            const updateData = req.body;

            // Validate dữ liệu cơ bản
            if (!updateData.TenQuyDinh || !updateData.MoTa) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin tên hoặc mô tả quy định',
                    error: 'Name and description are required'
                });
            }

            const result = await regulationService.updateRegulation(regulationId, updateData);
            return res.status(200).json({
                success: true,
                message: 'Cập nhật quy định thành công',
                data: result
            });
        } catch (error) {
            console.error('Update regulation error:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật quy định',
                error: error.message
            });
        }
    }

    // Thêm mới quy định
    async createRegulation(req, res) {
        try {
            const newRegulation = req.body;
            const result = await regulationService.createRegulation(newRegulation);
            return res.status(201).json({
                success: true,
                message: 'Thêm mới quy định thành công',
                data: result
            });
        } catch (error) {
            console.error('Create regulation error:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm mới quy định',
                error: error.message
            });
        }
    }

    // Xóa quy định
    async deleteRegulation(req, res) {
        try {
            const regulationId = req.params.id;
            await regulationService.deleteRegulation(regulationId);
            return res.status(200).json({
                success: true,
                message: 'Xóa quy định thành công'
            });
        } catch (error) {
            console.error('Delete regulation error:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa quy định',
                error: error.message
            });
        }
    }
}

module.exports = new RegulationController();