const express = require('express');
const router = express.Router();
const hallManagementController = require('../controllers/hallManagementController');
const upload = require('../middlewares/uploadMiddleware');
const { authMiddleware, requirePermission, PERMISSIONS } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Hall Management
 *   description: Quản lý sảnh tiệc và loại sảnh
 */

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls:
 *   get:
 *     summary: Lấy danh sách tất cả sảnh tiệc
 *     tags: [Hall Management]
 *     responses:
 *       200:
 *         description: Danh sách sảnh tiệc
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
 *                     $ref: '#/components/schemas/Hall'
 */
// Public route - anyone can view halls
router.get('/halls', hallManagementController.getAllHalls);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls/{id}:
 *   get:
 *     summary: Lấy thông tin sảnh tiệc theo ID
 *     tags: [Hall Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sảnh tiệc
 *     responses:
 *       200:
 *         description: Thông tin chi tiết sảnh tiệc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Hall'
 */
// Public route - anyone can view hall details
router.get('/halls/:id', hallManagementController.getHallById);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls:
 *   post:
 *     summary: Tạo sảnh tiệc mới
 *     tags: [Hall Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên sảnh tiệc
 *               type:
 *                 type: string
 *                 description: Loại sảnh
 *               capacity:
 *                 type: integer
 *                 description: Sức chứa
 *               price:
 *                 type: number
 *                 description: Giá thuê
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Hình ảnh sảnh
 *     responses:
 *       201:
 *         description: Tạo sảnh tiệc thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
// Protected route - require authentication and permission
router.post('/halls', 
  authMiddleware, 
  requirePermission(PERMISSIONS.MANAGE_HALLS),
  upload.single('image'), 
  hallManagementController.createHall
);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls/{id}:
 *   put:
 *     summary: Cập nhật thông tin sảnh tiệc
 *     tags: [Hall Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sảnh tiệc
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên sảnh tiệc
 *               type:
 *                 type: string
 *                 description: Loại sảnh
 *               capacity:
 *                 type: integer
 *                 description: Sức chứa
 *               price:
 *                 type: number
 *                 description: Giá thuê
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Hình ảnh sảnh
 *     responses:
 *       200:
 *         description: Cập nhật sảnh tiệc thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.put('/halls/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_HALLS),
  upload.single('image'), 
  hallManagementController.updateHall
);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls/{id}:
 *   delete:
 *     summary: Xóa sảnh tiệc
 *     tags: [Hall Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sảnh tiệc
 *     responses:
 *       200:
 *         description: Xóa sảnh tiệc thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.delete('/halls/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_HALLS),
  hallManagementController.deleteHall
);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/hall-types:
 *   get:
 *     summary: Lấy danh sách tất cả loại sảnh
 *     tags: [Hall Management]
 *     responses:
 *       200:
 *         description: Danh sách loại sảnh
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
 *                     $ref: '#/components/schemas/HallType'
 */
// Public route - anyone can view hall types
router.get('/hall-types', hallManagementController.getAllHallTypes);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/hall-types:
 *   post:
 *     summary: Tạo loại sảnh mới
 *     tags: [Hall Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HallType'
 *     responses:
 *       201:
 *         description: Tạo loại sảnh thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post('/hall-types', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_HALLS),
  hallManagementController.createHallType
);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/hall-types/{id}:
 *   put:
 *     summary: Cập nhật thông tin loại sảnh
 *     tags: [Hall Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID loại sảnh
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HallType'
 *     responses:
 *       200:
 *         description: Cập nhật loại sảnh thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.put('/hall-types/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_HALLS),
  hallManagementController.updateHallType
);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/hall-types/{id}:
 *   delete:
 *     summary: Xóa loại sảnh
 *     tags: [Hall Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID loại sảnh
 *     responses:
 *       200:
 *         description: Xóa loại sảnh thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.delete('/hall-types/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_HALLS),
  hallManagementController.deleteHallType
);

module.exports = router;