const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

// Ca tiệc routes
router.get('/v1/wedding-service/ca-tiec', shiftController.getAllShifts.bind(shiftController));
router.get('/v1/wedding-service/ca-tiec/:id', shiftController.getShiftById.bind(shiftController));

module.exports = router;