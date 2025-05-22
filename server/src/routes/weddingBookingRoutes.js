const express = require('express');
const router = express.Router();
const weddingBookingController = require('../controllers/weddingBookingController');

// Get all bookings
router.get('/', weddingBookingController.getAllBookings);

// Get booking by ID
router.get('/:id', weddingBookingController.getBookingById);

// Create new booking
router.post('/', weddingBookingController.createBooking);

// Update booking
router.put('/:id', weddingBookingController.updateBooking);

// Delete booking
router.delete('/:id', weddingBookingController.deleteBooking);

module.exports = router;