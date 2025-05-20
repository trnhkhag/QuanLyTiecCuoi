// filepath: d:\CNPM\QuanLyTiecCuoi\server\TraCuuTiecCuoi\weddingLookupRoute.js
const express = require('express');
const router = express.Router();
const weddingLookupController = require('../controllers/WeddingLookupController');

// Routes cho chức năng tra cứu tiệc cưới
router.get('/', weddingLookupController.searchBookings);       // Tra cứu danh sách theo bộ lọc
router.get('/:id', weddingLookupController.getBookingDetail);  // Xem chi tiết đặt tiệc theo ID

module.exports = router;