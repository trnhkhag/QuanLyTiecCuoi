const express = require('express');
const router = express.Router();
const hallController = require('../controllers/hallController');

// Get all halls
router.get('/', hallController.getAllHalls);

// Get hall by ID
router.get('/:id', hallController.getHallById);

// Create new hall
router.post('/', hallController.createHall);

// Update hall
router.put('/:id', hallController.updateHall);

// Delete hall
router.delete('/:id', hallController.deleteHall);

module.exports = router;