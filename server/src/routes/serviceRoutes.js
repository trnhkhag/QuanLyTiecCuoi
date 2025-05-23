const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const upload = require('../middlewares/uploadMiddleware');

/**
 * @swagger
 * tags:
 *   name: Service Management
 *   description: Quản lý dịch vụ tiệc cưới
 */

/**
 * @swagger
 * /api/v1/wedding-service/services:
 *   get:
 *     summary: Lấy danh sách tất cả dịch vụ
 *     tags: [Service Management]
 *     responses:
 *       200:
 *         description: Danh sách dịch vụ
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
 *                     $ref: '#/components/schemas/Service'
 */
router.get('/', serviceController.getAllServices);

/**
 * @swagger
 * /api/v1/wedding-service/services/{id}:
 *   get:
 *     summary: Lấy thông tin dịch vụ theo ID
 *     tags: [Service Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của dịch vụ
 *     responses:
 *       200:
 *         description: Thông tin chi tiết dịch vụ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 */
router.get('/:id', serviceController.getServiceById);

/**
 * @swagger
 * /api/v1/wedding-service/services:
 *   post:
 *     summary: Tạo dịch vụ mới
 *     tags: [Service Management]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên dịch vụ
 *               description:
 *                 type: string
 *                 description: Mô tả dịch vụ
 *               price:
 *                 type: number
 *                 description: Giá dịch vụ
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Hình ảnh dịch vụ
 *     responses:
 *       201:
 *         description: Tạo dịch vụ thành công
 */
router.post('/', upload.single('image'), serviceController.createService);

/**
 * @swagger
 * /api/v1/wedding-service/services/{id}:
 *   put:
 *     summary: Cập nhật thông tin dịch vụ
 *     tags: [Service Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của dịch vụ
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên dịch vụ
 *               description:
 *                 type: string
 *                 description: Mô tả dịch vụ
 *               price:
 *                 type: number
 *                 description: Giá dịch vụ
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Hình ảnh dịch vụ
 *     responses:
 *       200:
 *         description: Cập nhật dịch vụ thành công
 */
router.put('/:id', upload.single('image'), serviceController.updateService);

/**
 * @swagger
 * /api/v1/wedding-service/services/{id}:
 *   delete:
 *     summary: Xóa dịch vụ
 *     tags: [Service Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của dịch vụ
 *     responses:
 *       200:
 *         description: Xóa dịch vụ thành công
 */
router.delete('/:id', serviceController.deleteService);

module.exports = router;