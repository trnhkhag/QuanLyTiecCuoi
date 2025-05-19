const express = require('express');
const router = express.Router();
const regulationController = require('./regulationController');

// Lấy danh sách quy định
router.get('/', regulationController.getAllRegulations);

// Lấy chi tiết quy định
router.get('/:id', regulationController.getRegulationById);

// Cập nhật quy định
router.put('/:id', regulationController.updateRegulation);

module.exports = router;