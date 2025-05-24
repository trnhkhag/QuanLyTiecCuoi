// filepath: d:\CNPM\QuanLyTiecCuoi\server\TraCuuTiecCuoi\weddingLookupRoute.js
const express = require('express');
const router = express.Router();
const weddingLookupController = require('../controllers/WeddingLookupController');
const { authMiddleware, requirePermission, PERMISSIONS } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Wedding Lookup
 *   description: Tra cứu thông tin tiệc cưới
 */

/**
 * @swagger
 * /api/v1/wedding-service/lookup:
 *   get:
 *     summary: Tìm kiếm tiệc cưới
 *     tags: [Wedding Lookup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày tổ chức
 *       - in: query
 *         name: hallName
 *         schema:
 *           type: string
 *         description: Tên sảnh
 *       - in: query
 *         name: customerName
 *         schema:
 *           type: string
 *         description: Tên khách hàng
 *     responses:
 *       200:
 *         description: Danh sách tiệc cưới tìm được
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.get('/', 
  authMiddleware,
  requirePermission(PERMISSIONS.SEARCH_WEDDINGS),
  weddingLookupController.searchBookings
);

/**
 * @swagger
 * /api/v1/wedding-service/lookup/shifts:
 *   get:
 *     summary: Lấy danh sách ca tiệc
 *     tags: [Wedding Lookup]
 *     responses:
 *       200:
 *         description: Danh sách ca tiệc
 */
// Public route - anyone can view shifts
router.get('/shifts', weddingLookupController.getShifts);

/**
 * @swagger
 * /api/v1/wedding-service/lookup/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết tiệc cưới
 *     tags: [Wedding Lookup]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.get('/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.SEARCH_WEDDINGS),
  weddingLookupController.getBookingDetail
);

module.exports = router;