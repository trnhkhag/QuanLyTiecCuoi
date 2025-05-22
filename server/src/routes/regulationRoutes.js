const express = require('express');
const router = express.Router();
const regulationController = require('../controllers/regulationController');

/**
 * @swagger
 * tags:
 *   name: Regulation Management
 *   description: Wedding regulation management
 */

/**
 * @swagger
 * /api/v1/wedding-service/regulations:
 *   get:
 *     summary: Get all regulations
 *     tags: [Regulation Management]
 *     responses:
 *       200:
 *         description: List of regulations
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
 *                     $ref: '#/components/schemas/Regulation'
 */
router.get('/', regulationController.getAllRegulations);

/**
 * @swagger
 * /api/v1/wedding-service/regulations/{id}:
 *   get:
 *     summary: Get regulation by ID
 *     tags: [Regulation Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Regulation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Regulation'
 */
router.get('/:id', regulationController.getRegulationById);

/**
 * @swagger
 * /api/v1/wedding-service/regulations:
 *   post:
 *     summary: Create new regulation
 *     tags: [Regulation Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [GENERAL, PAYMENT, CANCELLATION]
 *     responses:
 *       201:
 *         description: Regulation created successfully
 */
router.post('/', regulationController.createRegulation);

/**
 * @swagger
 * /api/v1/wedding-service/regulations/{id}:
 *   put:
 *     summary: Update regulation
 *     tags: [Regulation Management]
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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [GENERAL, PAYMENT, CANCELLATION]
 *     responses:
 *       200:
 *         description: Regulation updated successfully
 */
router.put('/:id', regulationController.updateRegulation);

/**
 * @swagger
 * /api/v1/wedding-service/regulations/{id}:
 *   delete:
 *     summary: Delete regulation
 *     tags: [Regulation Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Regulation deleted successfully
 */
router.delete('/:id', regulationController.deleteRegulation);

module.exports = router;