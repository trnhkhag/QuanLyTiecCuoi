// filepath: d:\CNPM\QuanLyTiecCuoi\server\TraCuuTiecCuoi\weddingLookupRoute.js
const express = require('express');
const router = express.Router();
const weddingLookupController = require('../controllers/WeddingLookupController');

/**
 * @swagger
 * tags:
 *   name: Wedding Lookup
 *   description: Wedding search and lookup functionality
 */

/**
 * @swagger
 * /api/v1/wedding-service/lookup:
 *   get:
 *     summary: Search weddings
 *     tags: [Wedding Lookup]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Wedding date to search for
 *       - in: query
 *         name: hallId
 *         schema:
 *           type: integer
 *         description: Hall ID to search for
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 *         description: Wedding status to filter by
 *     responses:
 *       200:
 *         description: List of matching weddings
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
 *                     $ref: '#/components/schemas/Wedding'
 */
router.get('/', weddingLookupController.searchWeddings);

/**
 * @swagger
 * /api/v1/wedding-service/lookup/{id}:
 *   get:
 *     summary: Get wedding details
 *     tags: [Wedding Lookup]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Wedding details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Wedding'
 */
router.get('/:id', weddingLookupController.getWeddingDetails);

module.exports = router;