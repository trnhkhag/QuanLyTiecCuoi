const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile Service
 *   description: User profile management operations
 */

/**
 * @swagger
 * /api/v1/profile-service/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Profile Service]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accountId:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                     userType:
 *                       type: string
 *                       enum: [customer, employee]
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     position:
 *                       type: string
 *                     weddingHistory:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get('/profile', authMiddleware, profileController.getProfile);

/**
 * @swagger
 * /api/v1/profile-service/customer:
 *   put:
 *     summary: Update customer profile
 *     tags: [Profile Service]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phoneNumber
 *               - email
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               phoneNumber:
 *                 type: string
 *                 example: "0905123456"
 *               email:
 *                 type: string
 *                 example: "nguyenvana@gmail.com"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Customer not found
 */
router.put('/customer', authMiddleware, profileController.updateCustomerProfile);

/**
 * @swagger
 * /api/v1/profile-service/employee:
 *   put:
 *     summary: Update employee profile
 *     tags: [Profile Service]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Nguyễn Văn B"
 *               position:
 *                 type: string
 *                 example: "Nhân viên kinh doanh"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Employee not found
 */
router.put('/employee', authMiddleware, profileController.updateEmployeeProfile);

/**
 * @swagger
 * /api/v1/profile-service/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Profile Service]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid password data
 *       404:
 *         description: Account not found
 */
router.put('/change-password', authMiddleware, profileController.changePassword);

/**
 * @swagger
 * /api/v1/profile-service/permissions:
 *   get:
 *     summary: Get current user permissions
 *     tags: [Profile Service]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           Ten_Quyen:
 *                             type: string
 *                           MoTa:
 *                             type: string
 *                           GiaTri:
 *                             type: integer
 */
router.get('/permissions', authMiddleware, profileController.getUserPermissions);

/**
 * @swagger
 * /api/v1/profile-service/health:
 *   get:
 *     summary: Check Profile Service health
 *     tags: [Profile Service]
 *     responses:
 *       200:
 *         description: Profile Service is operational
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
 *                   example: profile-service
 */
// Health check endpoint is defined in app.js

module.exports = router; 