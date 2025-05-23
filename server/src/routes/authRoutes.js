const express = require('express');
const authController = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middlewares/validateInput');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth Service
 *   description: Xác thực và quản lý người dùng
 */

/**
 * @swagger
 * /api/v1/auth-service/login:
 *   post:
 *     summary: Đăng nhập vào ứng dụng
 *     tags: [Auth Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Thông tin đăng nhập không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Lỗi xác thực dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', validateLogin, authController.login);

/**
 * @swagger
 * /api/v1/auth-service/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Auth Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Lỗi xác thực hoặc email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', validateRegister, authController.register);

/**
 * @swagger
 * /api/v1/auth-service/health:
 *   get:
 *     summary: Kiểm tra tình trạng dịch vụ xác thực
 *     tags: [Auth Service]
 *     responses:
 *       200:
 *         description: Dịch vụ xác thực đang hoạt động
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 service:
 *                   type: string
 *                   example: auth-service
 */
// Health check endpoint is defined in app.js

module.exports = router; 