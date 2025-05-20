const express = require('express');
const router = express.Router();
const weddingBookingController = require('../controllers/weddingBookingController');

// Routes cho chức năng đặt tiệc
router.post('/', weddingBookingController.createBooking);
router.get('/', weddingBookingController.getAllBookings);
router.get('/:id', weddingBookingController.getBookingById);
router.put('/:id', weddingBookingController.updateBooking);
router.patch('/:id/status', weddingBookingController.updateBookingStatus);
router.delete('/:id', weddingBookingController.cancelBooking);

module.exports = router;