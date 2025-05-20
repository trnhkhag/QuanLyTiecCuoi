const express = require('express');
const router = express.Router();
const hallController = require('./hallController');

// Định nghĩa routes cho hall API
router.get('/', hallController.getAllHalls);
router.get('/:id', hallController.getHallById);
router.get('/check-availability', hallController.checkHallAvailability);

module.exports = router;