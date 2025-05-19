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
            if (!updateData.description) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin mô tả',
                    error: 'Description is required'
                });
            }

            // Validate chi tiết dựa vào loại quy định
            switch (regulationId) {
                case 'QD1':
                    if (!updateData.details?.halls || !Array.isArray(updateData.details.halls)) {
                        return res.status(400).json({
                            success: false,
                            message: 'Thiếu thông tin cấu hình sảnh',
                            error: 'Hall configuration is required'
                        });
                    }
                    break;

                case 'QD2':
                    if (!updateData.details?.maxServices || !updateData.details?.maxDishes) {
                        return res.status(400).json({
                            success: false,
                            message: 'Thiếu thông tin cấu hình dịch vụ/món ăn',
                            error: 'Service/dish configuration is required'
                        });
                    }
                    break;

                case 'QD4':
                    if (updateData.details?.lateFeePercentage === undefined || 
                        updateData.details?.enabled === undefined) {
                        return res.status(400).json({
                            success: false,
                            message: 'Thiếu thông tin cấu hình phạt',
                            error: 'Penalty configuration is required'
                        });
                    }
                    break;
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
}

module.exports = new RegulationController();