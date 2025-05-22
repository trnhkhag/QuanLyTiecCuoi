const express = require('express');
const router = express.Router();
const regulationController = require('../controllers/regulationController');

// Lấy danh sách quy định
router.get('/', regulationController.getAllRegulations);

// Lấy chi tiết quy định
router.get('/:id', regulationController.getRegulationById);

// Cập nhật quy định
router.put('/:id', regulationController.updateRegulation);

// Thêm mới quy định
router.post('/', regulationController.createRegulation);

// Xóa quy định
router.delete('/:id', regulationController.deleteRegulation);

module.exports = router;