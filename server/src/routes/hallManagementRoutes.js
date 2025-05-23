const express = require('express');
const router = express.Router();
const hallManagementController = require('../controllers/hallManagementController');
const upload = require('../middlewares/uploadMiddleware');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Hall Management
 *   description: Wedding hall and hall type management
 */

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls:
 *   get:
 *     summary: Get all wedding halls
 *     tags: [Hall Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wedding halls
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
router.get('/halls', authenticateToken, hallManagementController.getAllHalls);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls/{id}:
 *   get:
 *     summary: Get wedding hall by ID
 *     tags: [Hall Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Wedding hall details
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
router.get('/halls/:id', authenticateToken, hallManagementController.getHallById);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls:
 *   post:
 *     summary: Create new wedding hall
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
 *               type:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Wedding hall created successfully
 */
router.post('/halls', authenticateToken, requireRole(['admin', 'manager']), upload.single('image'), hallManagementController.createHall);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls/{id}:
 *   put:
 *     summary: Update wedding hall
 *     tags: [Hall Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Wedding hall updated successfully
 */
router.put('/halls/:id', authenticateToken, requireRole(['admin', 'manager']), upload.single('image'), hallManagementController.updateHall);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls/{id}:
 *   delete:
 *     summary: Delete wedding hall
 *     tags: [Hall Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Wedding hall deleted successfully
 */
router.delete('/halls/:id', authenticateToken, requireRole(['admin', 'manager']), hallManagementController.deleteHall);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/hall-types:
 *   get:
 *     summary: Get all hall types
 *     tags: [Hall Management]
 *     responses:
 *       200:
 *         description: List of hall types
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
router.get('/hall-types', hallManagementController.getAllHallTypes);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/hall-types:
 *   post:
 *     summary: Create new hall type
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
 *         description: Hall type created successfully
 */
router.post('/hall-types', authenticateToken, requireRole(['admin', 'manager']), hallManagementController.createHallType);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/hall-types/{id}:
 *   put:
 *     summary: Update hall type
 *     tags: [Hall Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HallType'
 *     responses:
 *       200:
 *         description: Hall type updated successfully
 */
router.put('/hall-types/:id', authenticateToken, requireRole(['admin', 'manager']), hallManagementController.updateHallType);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/hall-types/{id}:
 *   delete:
 *     summary: Delete hall type
 *     tags: [Hall Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Hall type deleted successfully
 */
router.delete('/hall-types/:id', authenticateToken, requireRole(['admin', 'manager']), hallManagementController.deleteHallType);

module.exports = router;