// filepath: d:\CNPM\QuanLyTiecCuoi\server\TraCuuTiecCuoi\weddingLookupRoutes.js
const express = require('express');
const router = express.Router();
const weddingLookupService = require('../services/weddingLookupService');

/**
 * @route   GET /api/weddings
 * @desc    Lấy danh sách tiệc cưới
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/weddings API được gọi', req.query);
    const filters = req.query;
    const bookings = await weddingLookupService.getAllBookings(filters);
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error in GET /api/weddings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách tiệc cưới',
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/weddings/filter
 * @desc    Lấy danh sách tiệc cưới đã lọc
 * @access  Public
 */
router.get('/filter', async (req, res) => {
  try {
    console.log('GET /api/weddings/filter API được gọi', req.query);
    const filters = req.query;
    const bookings = await weddingLookupService.getAllBookings(filters);
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error in GET /api/weddings/filter:', error);
    res.status(500).json({ 
      success: false,
      message: 'Đã xảy ra lỗi khi lọc danh sách tiệc cưới',
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/weddings/:id
 * @desc    Lấy thông tin chi tiết của tiệc cưới theo ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    console.log('GET /api/weddings/:id API được gọi với ID:', req.params.id);
    const bookingId = req.params.id;
    
    const booking = await weddingLookupService.getBookingById(bookingId);
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(`Error in GET /api/weddings/${req.params.id}:`, error);
    res.status(404).json({
      success: false,
      message: 'Không tìm thấy tiệc cưới với ID này',
      error: error.message
    });
  }
});

module.exports = router;