const express = require('express');
const router = express.Router();
const hallManagementController = require('../controllers/hallManagementController');
const upload = require('../middlewares/uploadMiddleware');

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
router.get('/halls', hallManagementController.getAllHalls);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls/{id}:
 *   get:
 *     summary: Get wedding hall by ID
 *     tags: [Hall Management]
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
router.get('/halls/:id', hallManagementController.getHallById);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls:
 *   post:
 *     summary: Create new wedding hall
 *     tags: [Hall Management]
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
router.post('/halls', upload.single('image'), hallManagementController.createHall);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls/{id}:
 *   put:
 *     summary: Update wedding hall
 *     tags: [Hall Management]
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
router.put('/halls/:id', upload.single('image'), hallManagementController.updateHall);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/halls/{id}:
 *   delete:
 *     summary: Delete wedding hall
 *     tags: [Hall Management]
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
router.delete('/halls/:id', hallManagementController.deleteHall);

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
router.post('/hall-types', hallManagementController.createHallType);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/hall-types/{id}:
 *   put:
 *     summary: Update hall type
 *     tags: [Hall Management]
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
router.put('/hall-types/:id', hallManagementController.updateHallType);

/**
 * @swagger
 * /api/v1/wedding-service/lobby/hall-types/{id}:
 *   delete:
 *     summary: Delete hall type
 *     tags: [Hall Management]
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
router.delete('/hall-types/:id', hallManagementController.deleteHallType);

module.exports = router;