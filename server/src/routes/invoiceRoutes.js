const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const router = express.Router();
const { authMiddleware, requirePermission, PERMISSIONS } = require('../middleware/authMiddleware');

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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.get('/', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_INVOICES),
  invoiceController.getAllInvoices
);

/**
 * @swagger
 * /api/v1/invoice-service/{id}:
 *   get:
 *     summary: Get an invoice by ID
 *     tags: [Invoice Service]
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
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.get('/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_INVOICES),
  invoiceController.getInvoiceById
);

/**
 * @swagger
 * /api/v1/invoice-service:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoice Service]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post('/', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_INVOICES),
  invoiceController.createInvoice
);

/**
 * @swagger
 * /api/v1/invoice-service/{id}:
 *   put:
 *     summary: Update an invoice
 *     tags: [Invoice Service]
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
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.put('/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_INVOICES),
  invoiceController.updateInvoice
);

/**
 * @swagger
 * /api/v1/invoice-service/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     tags: [Invoice Service]
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
 *         description: Invoice deleted successfully
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.delete('/:id', 
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_INVOICES),
  invoiceController.deleteInvoice
);

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