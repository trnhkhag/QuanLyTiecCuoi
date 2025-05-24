const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const tiecCuoiRoutes = require('./routes/tiecCuoiRoutes');
const caTiecRoutes = require('./routes/caTiecRoutes');
const reportRoutes = require('./routes/reportRoutes');
const profileRoutes = require('./routes/profileRoutes');
const hallManagementRoutes = require('./routes/hallManagementRoutes');
const regulationRoutes = require('./routes/regulationRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const weddingLookupRoutes = require('./routes/weddingLookupRoutes'); // Sửa đúng chữ hoa/thường
const weddingBookingRoutes = require('./routes/weddingBookingRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoints for each service
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API Gateway is operational' });
});

app.get('/api/v1/auth-service/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'auth-service' });
});

app.get('/api/v1/invoice-service/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'invoice-service' });
});

app.get('/api/v1/wedding-service/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'wedding-service' });
});

app.get('/api/v1/report-service/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'report-service' });
});

app.get('/api/v1/profile-service/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'profile-service' });
});

// Health check endpoint for api root
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Swagger UI setup
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Wedding Management System - API Documentation',
  // Group endpoints by tags
  swaggerOptions: {
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
    docExpansion: 'none', // Collapse all endpoints by default
    persistAuthorization: true,
  }
}));

// Microservice-style API routes - each with its own prefix
app.use('/api/v1/auth-service', authRoutes);
app.use('/api/v1/invoice-service', invoiceRoutes);
app.use('/api/v1/wedding-service/bookings', weddingBookingRoutes);
app.use('/api/v1/wedding-service/tiec-cuoi', tiecCuoiRoutes);
app.use('/api/v1/wedding-service/ca-tiec', caTiecRoutes);
app.use('/api/v1/wedding-service/lobby', hallManagementRoutes);
app.use('/api/v1/wedding-service/regulations', regulationRoutes);
app.use('/api/v1/wedding-service/services', serviceRoutes);
app.use('/api/v1/wedding-service/lookup', weddingLookupRoutes);
app.use('/api/v1/report-service', reportRoutes);
app.use('/api/v1/profile-service', profileRoutes);

// Legacy routes for backward compatibility - TO BE REMOVED IN FUTURE
app.use('/api/auth', authRoutes);  
app.use('/api/invoices', invoiceRoutes);
app.use('/api/bookings', weddingBookingRoutes);

// Thêm mới: Routes cho giao diện người dùng phía client
app.use('/api/weddings', weddingLookupRoutes);

// Not found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;
