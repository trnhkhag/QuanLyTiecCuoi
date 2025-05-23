const express = require('express');
const reportController = require('../controllers/reportController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Report Service
 *   description: Reporting and analytics operations
 */

/**
 * @swagger
 * /api/v1/report-service/monthly:
 *   get:
 *     summary: Get monthly report data
 *     tags: [Report Service]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year for the report
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Month for the report (1-12)
 *     responses:
 *       200:
 *         description: Monthly report data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MonthlyReport'
 */
router.get('/monthly', authenticateToken, requireRole(['admin', 'manager']), reportController.getMonthlyReport);

/**
 * @swagger
 * /api/v1/report-service/yearly:
 *   get:
 *     summary: Get yearly report data
 *     tags: [Report Service]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year for the report (defaults to current year)
 *     responses:
 *       200:
 *         description: Yearly report data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 year:
 *                   type: integer
 *                   example: 2023
 *                 totalRevenue:
 *                   type: number
 *                   example: 500000000
 *                 totalWeddings:
 *                   type: integer
 *                   example: 120
 *                 averageRevenue:
 *                   type: number
 *                   example: 4166666.67
 *                 monthlyBreakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: integer
 *                         example: 1
 *                       weddingCount:
 *                         type: integer
 *                         example: 10
 *                       revenue:
 *                         type: number
 *                         example: 45000000
 */
router.get('/yearly', reportController.getYearlyReport);

/**
 * @swagger
 * /api/v1/report-service/revenue-trend:
 *   get:
 *     summary: Get revenue trend data
 *     tags: [Report Service]
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *         description: Number of months to include (defaults to 6)
 *     responses:
 *       200:
 *         description: Revenue trend data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 numberOfMonths:
 *                   type: integer
 *                   example: 6
 *                 startDate:
 *                   type: string
 *                   example: "2023-01-01"
 *                 endDate:
 *                   type: string
 *                   example: "2023-06-30"
 *                 totalRevenue:
 *                   type: number
 *                   example: 350000000
 *                 totalWeddings:
 *                   type: integer
 *                   example: 85
 *                 averageMonthlyRevenue:
 *                   type: number
 *                   example: 58333333.33
 *                 trend:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: integer
 *                         example: 2023
 *                       month:
 *                         type: integer
 *                         example: 1
 *                       label:
 *                         type: string
 *                         example: "01/2023"
 *                       weddingCount:
 *                         type: integer
 *                         example: 15
 *                       revenue:
 *                         type: number
 *                         example: 65000000
 */
router.get('/revenue-trend', reportController.getRevenueTrend);

/**
 * @swagger
 * /api/v1/report-service/health:
 *   get:
 *     summary: Check Report Service health
 *     tags: [Report Service]
 *     responses:
 *       200:
 *         description: Report Service is operational
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
 *                   example: report-service
 */
// Health check endpoint is defined in app.js

/**
 * @swagger
 * /api/v1/report-service/revenue:
 *   get:
 *     summary: Get revenue statistics
 *     tags: [Report Service]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue statistics data
 */
router.get('/revenue', authenticateToken, requireRole(['admin', 'manager']), reportController.getRevenueReport);

/**
 * @swagger
 * /api/v1/report-service/trending:
 *   get:
 *     summary: Get trending revenue report for multiple months
 *     tags: [Report Service]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of months to include in trending report
 *     responses:
 *       200:
 *         description: Trending revenue data
 */
router.get('/trending', authenticateToken, requireRole(['admin', 'manager']), reportController.getRevenueTrending);

module.exports = router; 