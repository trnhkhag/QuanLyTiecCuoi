const express = require('express');
const reportController = require('../controllers/reportController');
const router = express.Router();
const { authMiddleware, requirePermission, PERMISSIONS } = require('../middleware/authMiddleware');

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
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.get('/monthly', 
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_REPORTS),
  reportController.getMonthlyReport
);

/**
 * @swagger
 * /api/v1/report-service/yearly:
 *   get:
 *     summary: Get yearly report data
 *     tags: [Report Service]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.get('/yearly', 
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_REPORTS),
  reportController.getYearlyReport
);

/**
 * @swagger
 * /api/v1/report-service/revenue-trend:
 *   get:
 *     summary: Get revenue trend data
 *     tags: [Report Service]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.get('/revenue-trend', 
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_REPORTS),
  reportController.getRevenueTrend
);

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

module.exports = router; 