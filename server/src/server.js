const express = require('express');
const app = require('./app');
const path = require('path');
require('dotenv').config();

// Set port
const PORT = process.env.PORT || 3001;

// Phục vụ static files từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Import thêm các routes từ project phụ
const weddingBookingRoutes = require('./routes/weddingBookingRoutes');
const hallRoutes = require('./routes/hallRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const regulationRoutes = require('./routes/regulationRoutes');
const weddingLookupRoutes = require('./routes/WeddingLookupRoutes');
const hallManagementRoutes = require('./routes/hallManagementRoutes');

// Register thêm các routes
app.use('/api/v1/wedding-service/bookings', weddingBookingRoutes);
app.use('/api/v1/wedding-service/halls', hallRoutes);
app.use('/api/v1/wedding-service/services', serviceRoutes);
app.use('/api/v1/wedding-service/regulations', regulationRoutes);
app.use('/api/v1/wedding-service/lookup', weddingLookupRoutes);
app.use('/api/v1/wedding-service/lobby', hallManagementRoutes);

// Legacy routes cho backward compatibility
app.use('/api/bookings', weddingBookingRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/regulations', regulationRoutes);
app.use('/api/lookup', weddingLookupRoutes);
app.use('/api/lobby', hallManagementRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🔐 Auth service running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`🔹 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔹 API endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/v1/auth-service/login`);
  console.log(`   POST http://localhost:${PORT}/api/v1/auth-service/register`);
  console.log(`   GET http://localhost:${PORT}/api/v1/wedding-service/bookings`);
  console.log(`   GET http://localhost:${PORT}/api/v1/wedding-service/halls`);
  console.log(`   GET http://localhost:${PORT}/api/v1/wedding-service/services`);
  console.log(`   GET http://localhost:${PORT}/api/v1/wedding-service/regulations`);
  console.log(`   GET http://localhost:${PORT}/api/v1/wedding-service/lookup`);
  console.log(`   GET http://localhost:${PORT}/api/v1/wedding-service/lobby`);
}); 