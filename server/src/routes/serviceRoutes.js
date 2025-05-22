const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const upload = require('../middlewares/uploadMiddleware');

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
router.get('/', serviceController.getAllServices);

/**
 * @swagger
 * /api/v1/wedding-service/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Service Management]
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
router.get('/:id', serviceController.getServiceById);

/**
 * @swagger
 * /api/v1/wedding-service/services:
 *   post:
 *     summary: Create new service
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
router.post('/', upload.single('image'), serviceController.createService);

/**
 * @swagger
 * /api/v1/wedding-service/services/{id}:
 *   put:
 *     summary: Update service
 *     tags: [Service Management]
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
router.put('/:id', upload.single('image'), serviceController.updateService);

/**
 * @swagger
 * /api/v1/wedding-service/services/{id}:
 *   delete:
 *     summary: Delete service
 *     tags: [Service Management]
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
router.delete('/:id', serviceController.deleteService);

module.exports = router;