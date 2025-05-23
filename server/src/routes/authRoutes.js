const express = require('express');
const authController = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middlewares/validateInput');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth Service
 *   description: Authentication and user management operations
 */

/**
 * @swagger
 * /api/v1/auth-service/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Auth Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Validation error
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
 *     summary: Register a new user
 *     tags: [Auth Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or email already exists
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
 *     summary: Check Auth Service health
 *     tags: [Auth Service]
 *     responses:
 *       200:
 *         description: Auth Service is operational
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

/**
 * @swagger
 * /api/v1/auth-service/profile:
 *   get:
 *     summary: Lấy thông tin profile người dùng hiện tại
 *     tags: [Auth Service]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin profile người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 */
router.get('/profile', authenticateToken, authController.getProfile);

/**
 * @swagger
 * /api/v1/auth-service/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags: [Auth Service]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/logout', authenticateToken, authController.logout);

module.exports = router; 