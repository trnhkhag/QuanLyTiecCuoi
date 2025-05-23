const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// Món ăn routes
router.get('/', foodController.getAllFoods.bind(foodController));
router.get('/:id', foodController.getFoodById.bind(foodController));

module.exports = router;