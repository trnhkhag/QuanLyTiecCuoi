const express = require('express');
const router = express.Router();
const regulationController = require('../controllers/regulationController');
const { authMiddleware, requirePermission, PERMISSIONS } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Regulations
 *   description: Quản lý quy định hệ thống
 */

/**
 * @swagger
 * /api/v1/wedding-service/regulations:
 *   get:
 *     summary: Lấy danh sách tất cả quy định
 *     tags: [Regulations]
 *     responses:
 *       200:
 *         description: Danh sách quy định
 */
// Public route - anyone can view regulations
router.get('/', regulationController.getAllRegulations);

/**
 * @swagger
 * /api/v1/wedding-service/regulations/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết quy định
 *     tags: [Regulations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID quy định
 *     responses:
 *       200:
 *         description: Thông tin chi tiết quy định
 */
// Public route - anyone can view regulation details
router.get('/:id', regulationController.getRegulationById);

/**
 * @swagger
 * /api/v1/wedding-service/regulations:
 *   post:
 *     summary: Tạo quy định mới
 *     tags: [Regulations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegulationInput'
 *     responses:
 *       201:
 *         description: Tạo quy định thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post('/', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_REGULATIONS),
  regulationController.createRegulation
);

/**
 * @swagger
 * /api/v1/wedding-service/regulations/{id}:
 *   put:
 *     summary: Cập nhật thông tin quy định
 *     tags: [Regulations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID quy định
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegulationInput'
 *     responses:
 *       200:
 *         description: Cập nhật quy định thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.put('/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_REGULATIONS),
  regulationController.updateRegulation
);

/**
 * @swagger
 * /api/v1/wedding-service/regulations/{id}:
 *   delete:
 *     summary: Xóa quy định
 *     tags: [Regulations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID quy định
 *     responses:
 *       200:
 *         description: Xóa quy định thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.delete('/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_REGULATIONS),
  regulationController.deleteRegulation
);

module.exports = router;