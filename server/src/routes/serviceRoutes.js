const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const upload = require('../middlewares/uploadMiddleware');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Service Management
 *   description: Wedding service management
 */

/**
 * @swagger
 * /api/v1/wedding-service/services:
 *   get:
 *     summary: Get all services
 *     tags: [Service Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services
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
router.get('/', authenticateToken, serviceController.getAllServices);

/**
 * @swagger
 * /api/v1/wedding-service/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Service Management]
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
 *         description: Service details
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
router.get('/:id', authenticateToken, serviceController.getServiceById);

/**
 * @swagger
 * /api/v1/wedding-service/services:
 *   post:
 *     summary: Create new service
 *     tags: [Service Management]
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Service created successfully
 */
router.post('/', authenticateToken, requireRole(['admin', 'manager']), upload.single('image'), serviceController.createService);

/**
 * @swagger
 * /api/v1/wedding-service/services/{id}:
 *   put:
 *     summary: Update service
 *     tags: [Service Management]
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Service updated successfully
 */
router.put('/:id', authenticateToken, requireRole(['admin', 'manager']), upload.single('image'), serviceController.updateService);

/**
 * @swagger
 * /api/v1/wedding-service/services/{id}:
 *   delete:
 *     summary: Delete service
 *     tags: [Service Management]
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
 *         description: Service deleted successfully
 */
router.delete('/:id', authenticateToken, requireRole(['admin', 'manager']), serviceController.deleteService);

module.exports = router;