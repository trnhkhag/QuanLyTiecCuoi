const express = require('express');
const router = express.Router();
const weddingBookingController = require('../controllers/weddingBookingController');
const { authMiddleware, requirePermission, PERMISSIONS } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Wedding Bookings
 *   description: Quản lý đặt tiệc cưới
 */

/**
 * @swagger
 * /api/v1/wedding-service/bookings:
 *   get:
 *     summary: Lấy danh sách tất cả đặt tiệc
 *     tags: [Wedding Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đặt tiệc
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_BOOKINGS),
  weddingBookingController.getAllBookings
);

/**
 * @swagger
 * /api/v1/wedding-service/bookings/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết đặt tiệc
 *     tags: [Wedding Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID đặt tiệc
 *     responses:
 *       200:
 *         description: Thông tin chi tiết đặt tiệc
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.get('/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_BOOKINGS),
  weddingBookingController.getBookingById
);

/**
 * @swagger
 * /api/v1/wedding-service/bookings:
 *   post:
 *     summary: Tạo đặt tiệc mới
 *     tags: [Wedding Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       201:
 *         description: Tạo đặt tiệc thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post('/', 
  authMiddleware,
  // Đã loại bỏ yêu cầu quyền MANAGE_BOOKINGS để cho phép tất cả người dùng đã đăng nhập đều có thể đặt tiệc
  weddingBookingController.createBooking
);

/**
 * @swagger
 * /api/v1/wedding-service/bookings/{id}:
 *   put:
 *     summary: Cập nhật thông tin đặt tiệc
 *     tags: [Wedding Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID đặt tiệc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       200:
 *         description: Cập nhật đặt tiệc thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.put('/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_BOOKINGS),
  weddingBookingController.updateBooking
);

/**
 * @swagger
 * /api/v1/wedding-service/bookings/{id}:
 *   delete:
 *     summary: Xóa đặt tiệc
 *     tags: [Wedding Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID đặt tiệc
 *     responses:
 *       200:
 *         description: Xóa đặt tiệc thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.delete('/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_BOOKINGS),
  weddingBookingController.deleteBooking
);

module.exports = router;