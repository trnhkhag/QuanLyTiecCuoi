const foodController = require('../services/foodService');

class FoodController {
  // Lấy tất cả món ăn
  async getAllFoods(req, res) {
    try {
      const foods = await foodController.getAllFoods();
      return res.status(200).json({ success: true, data: foods });
    } catch (error) {
      console.error('Error in getAllFoods:', error.message);
      return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách món ăn' });
    }
  }
    // Lấy món ăn theo ID
    async getFoodById(req, res) {
      try {
        const id = parseInt(req.params.id);
        const food = await foodController.getFoodById(id);
        if (!food) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy món ăn' });
        }
        return res.status(200).json({ success: true, data: food });
      } catch (error) {
        console.error('Error in getFoodById:', error.message);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin món ăn' });
      }
    }
}

module.exports = new FoodController();