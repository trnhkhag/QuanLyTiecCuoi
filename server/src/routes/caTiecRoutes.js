const express = require('express');
const caTiecController = require('../controllers/caTiecController');
const router = express.Router();

/**
 * @swagger
 * /api/v1/wedding-service/ca-tiec:
 *   get:
 *     summary: Get all catering shifts
 *     tags: [Wedding Service]
 *     responses:
 *       200:
 *         description: A list of catering shifts
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Trưa"
 */
router.get('/', caTiecController.getAllCaTiec);

/**
 * @swagger
 * /api/v1/wedding-service/ca-tiec/{id}:
 *   get:
 *     summary: Get a catering shift by ID
 *     tags: [Wedding Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Catering shift details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Trưa"
 *       404:
 *         description: Catering shift not found
 */
router.get('/:id', caTiecController.getCaTiecById);

module.exports = router; 