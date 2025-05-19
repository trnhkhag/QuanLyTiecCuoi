const express = require('express');
const router = express.Router();
const hallManagementController = require('./hallManagementController');
const upload = require('../middlewares/uploadMiddleware');

// Routes quản lý sảnh
router.get('/halls', hallManagementController.getAllHalls);
router.get('/halls/:id', hallManagementController.getHallById);
router.post('/halls', upload.single('image'), hallManagementController.createHall);
router.put('/halls/:id', upload.single('image'), hallManagementController.updateHall);
router.delete('/halls/:id', hallManagementController.deleteHall);

// Routes quản lý loại sảnh
router.get('/hall-types', hallManagementController.getAllHallTypes);
router.post('/hall-types', hallManagementController.createHallType);
router.put('/hall-types/:id', hallManagementController.updateHallType);
router.delete('/hall-types/:id', hallManagementController.deleteHallType);

module.exports = router;