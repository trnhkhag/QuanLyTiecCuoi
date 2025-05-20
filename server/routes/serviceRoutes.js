const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Lấy tất cả dịch vụ
router.get('/', serviceController.getAllServices);

// Lấy chi tiết dịch vụ
router.get('/:id', serviceController.getServiceById);

// Tạo dịch vụ mới
router.post('/', serviceController.createService);

// Cập nhật dịch vụ
router.put('/:id', serviceController.updateService);

// Xóa dịch vụ
router.delete('/:id', serviceController.deleteService);

module.exports = router;