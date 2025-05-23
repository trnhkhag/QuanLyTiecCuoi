const express = require('express');
const router = express.Router();
const regulationController = require('../controllers/regulationController');

/**
 * @swagger
 * tags:
 *   name: Regulation Management
 *   description: Quản lý quy định tiệc cưới
 */

/**
 * @swagger
 * /api/v1/wedding-service/regulations:
 *   get:
 *     summary: Lấy danh sách tất cả quy định
 *     tags: [Regulation Management]
 *     responses:
 *       200:
 *         description: Danh sách quy định
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Regulation'
 */
router.get('/', regulationController.getAllRegulations);

/**
 * @swagger
 * /api/v1/wedding-service/regulations/{id}:
 *   get:
 *     summary: Lấy thông tin quy định theo ID
 *     tags: [Regulation Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của quy định
 *     responses:
 *       200:
 *         description: Thông tin chi tiết quy định
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Regulation'
 */
router.get('/:id', regulationController.getRegulationById);

/**
 * @swagger
 * /api/v1/wedding-service/regulations:
 *   post:
 *     summary: Tạo quy định mới
 *     tags: [Regulation Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề quy định
 *               content:
 *                 type: string
 *                 description: Nội dung quy định
 *               type:
 *                 type: string
 *                 description: Loại quy định
 *                 enum: [GENERAL, PAYMENT, CANCELLATION]
 *     responses:
 *       201:
 *         description: Tạo quy định thành công
 */
router.post('/', regulationController.createRegulation);

/**
 * @swagger
 * /api/v1/wedding-service/regulations/{id}:
 *   put:
 *     summary: Cập nhật thông tin quy định
 *     tags: [Regulation Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của quy định
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề quy định
 *               content:
 *                 type: string
 *                 description: Nội dung quy định
 *               type:
 *                 type: string
 *                 description: Loại quy định
 *                 enum: [GENERAL, PAYMENT, CANCELLATION]
 *     responses:
 *       200:
 *         description: Cập nhật quy định thành công
 */
router.put('/:id', regulationController.updateRegulation);

/**
 * @swagger
 * /api/v1/wedding-service/regulations/{id}:
 *   delete:
 *     summary: Xóa quy định
 *     tags: [Regulation Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của quy định
 *     responses:
 *       200:
 *         description: Xóa quy định thành công
 */
router.delete('/:id', regulationController.deleteRegulation);

module.exports = router;