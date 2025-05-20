const express = require('express');
const tiecCuoiController = require('../controllers/tiecCuoiController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wedding Service
 *   description: Wedding management and planning operations
 */

/**
 * @swagger
 * /api/v1/wedding-service/tiec-cuoi:
 *   get:
 *     summary: Get all wedding parties
 *     tags: [Wedding Service]
 *     responses:
 *       200:
 *         description: A list of wedding parties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wedding'
 */
router.get('/', tiecCuoiController.getAllTiecCuoi);

/**
 * @swagger
 * /api/v1/wedding-service/tiec-cuoi/{id}:
 *   get:
 *     summary: Get a wedding party by ID
 *     tags: [Wedding Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Wedding party details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Wedding'
 *       404:
 *         description: Wedding party not found
 */
router.get('/:id', tiecCuoiController.getTiecCuoiById);

/**
 * @swagger
 * /api/v1/wedding-service/tiec-cuoi:
 *   post:
 *     summary: Create a new wedding party
 *     tags: [Wedding Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wedding'
 *     responses:
 *       201:
 *         description: Wedding party created successfully
 */
router.post('/', tiecCuoiController.createTiecCuoi);

/**
 * @swagger
 * /api/v1/wedding-service/tiec-cuoi/{id}:
 *   put:
 *     summary: Update a wedding party
 *     tags: [Wedding Service]
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
 *             $ref: '#/components/schemas/Wedding'
 *     responses:
 *       200:
 *         description: Wedding party updated successfully
 *       404:
 *         description: Wedding party not found
 */
router.put('/:id', tiecCuoiController.updateTiecCuoi);

/**
 * @swagger
 * /api/v1/wedding-service/tiec-cuoi/{id}:
 *   delete:
 *     summary: Delete a wedding party
 *     tags: [Wedding Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Wedding party deleted successfully
 *       404:
 *         description: Wedding party not found
 */
router.delete('/:id', tiecCuoiController.deleteTiecCuoi);

module.exports = router; 