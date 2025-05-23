// filepath: d:\CNPM\QuanLyTiecCuoi\server\TraCuuTiecCuoi\weddingLookupRoute.js
const express = require('express');
const router = express.Router();
const weddingLookupController = require('../controllers/WeddingLookupController');
const foodController = require('../controllers/foodController');

/**
 * @swagger
 * tags:
 *   name: Wedding Lookup
 *   description: Tra cứu và tìm kiếm tiệc cưới
 */

/**
 * @swagger
 * /api/v1/wedding-service/lookup:
 *   get:
 *     summary: Tìm kiếm tiệc cưới
 *     tags: [Wedding Lookup]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày tổ chức tiệc cưới cần tìm
 *       - in: query
 *         name: hallId
 *         schema:
 *           type: integer
 *         description: ID sảnh cần tìm
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 *         description: Trạng thái tiệc cưới để lọc
 *     responses:
 *       200:
 *         description: Danh sách tiệc cưới phù hợp
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
 *                     $ref: '#/components/schemas/Wedding'
 */
router.get('/', weddingLookupController.searchBookings);

/**
 * @swagger
 * /api/v1/wedding-service/lookup/shifts:
 *   get:
 *     summary: Lấy danh sách tất cả ca tiệc
 *     tags: [Wedding Lookup]
 *     responses:
 *       200:
 *         description: Danh sách ca tiệc có sẵn
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID ca tiệc
 *                       name:
 *                         type: string
 *                         description: Tên ca tiệc
 *                       startTime:
 *                         type: string
 *                         description: Thời gian bắt đầu
 *                       endTime:
 *                         type: string
 *                         description: Thời gian kết thúc
 */
router.get('/shifts', weddingLookupController.getShifts);

/**
 * @swagger
 * /api/v1/wedding-service/lookup/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết tiệc cưới
 *     tags: [Wedding Lookup]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID tiệc cưới
 *     responses:
 *       200:
 *         description: Thông tin chi tiết tiệc cưới
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Wedding'
 */
router.get('/:id', weddingLookupController.getBookingDetail);

/**
 * @swagger
 * /api/v1/wedding-service/lookup/foods:
 *   get:
 *     summary: Lấy danh sách món ăn
 *     tags: [Wedding Lookup]
 *     responses:
 *       200:
 *         description: Danh sách món ăn
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
 *                     $ref: '#/components/schemas/Food'
 */
router.get('/foods', foodController.getAllFoods.bind(foodController));

module.exports = router;