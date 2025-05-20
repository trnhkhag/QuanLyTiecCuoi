const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Invoice Service
 *   description: Invoice and payment management operations
 */

/**
 * @swagger
 * /api/v1/invoice-service:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoice Service]
 *     responses:
 *       200:
 *         description: A list of invoices
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
 *                     $ref: '#/components/schemas/Invoice'
 */
router.get('/', invoiceController.getAllInvoices);

/**
 * @swagger
 * /api/v1/invoice-service/{id}:
 *   get:
 *     summary: Get an invoice by ID
 *     tags: [Invoice Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found
 */
router.get('/:id', invoiceController.getInvoiceById);

/**
 * @swagger
 * /api/v1/invoice-service:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoice Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       201:
 *         description: Invoice created successfully
 */
router.post('/', invoiceController.createInvoice);

/**
 * @swagger
 * /api/v1/invoice-service/{id}:
 *   put:
 *     summary: Update an invoice
 *     tags: [Invoice Service]
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
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *       404:
 *         description: Invoice not found
 */
router.put('/:id', invoiceController.updateInvoice);

/**
 * @swagger
 * /api/v1/invoice-service/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     tags: [Invoice Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 *       404:
 *         description: Invoice not found
 */
router.delete('/:id', invoiceController.deleteInvoice);

/**
 * @swagger
 * /api/v1/invoice-service/health:
 *   get:
 *     summary: Check Invoice Service health
 *     tags: [Invoice Service]
 *     responses:
 *       200:
 *         description: Invoice Service is operational
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
 *                   example: invoice-service
 */
// Health check endpoint is defined in app.js

module.exports = router; 