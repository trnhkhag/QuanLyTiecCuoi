const express = require('express');
const cors = require('cors');
const app = require('./app');
const path = require('path');

// Load environment variables with error handling
try {
  require('dotenv').config();
} catch (error) {
  console.warn('Warning: dotenv config failed:', error.message);
}

// Set port
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

// Cấu hình phục vụ tập tin tĩnh - Đảm bảo đường dẫn đúng trong Docker
const uploadsPath = path.join(__dirname, '../uploads');
console.log('Serving static files from: ', uploadsPath);

// Phục vụ các file tĩnh từ thư mục uploads
app.use('/uploads', express.static(uploadsPath));

// Thêm route debug đặc biệt để kiểm tra khả năng truy cập file
app.get('/debug-file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsPath, 'halls', filename);
  
  console.log('Debug file access:', filePath);
  
  const fs = require('fs');
  try {
    if (fs.existsSync(filePath)) {
      console.log('File exists, sending file');
      return res.sendFile(filePath);
    } else {
      console.log('File does not exist');
      return res.status(404).json({ error: 'File not found', path: filePath });
    }
  } catch (error) {
    console.error('Error checking file:', error);
    return res.status(500).json({ error: 'Server error checking file' });
  }
});

// Setup uploads directory with error handling
const fs = require('fs');
try {
  if (!fs.existsSync(uploadsPath)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  
  const hallsPath = path.join(uploadsPath, 'halls');
  if (!fs.existsSync(hallsPath)) {
    console.log('Creating halls directory...');
    fs.mkdirSync(hallsPath, { recursive: true });
  }
  
  console.log('Upload directories ready');
} catch (error) {
  console.error('Warning: Could not setup upload directories:', error.message);
  console.log('Server will continue without file upload capability');
}

// Import thêm các routes từ project phụ
const weddingBookingRoutes = require('./routes/weddingBookingRoutes');
const hallRoutes = require('./routes/hallRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const regulationRoutes = require('./routes/regulationRoutes');
const weddingLookupRoutes = require('./routes/weddingLookupRoutes'); // Sửa từ WeddingLookupRoutes thành weddingLookupRoutes
const hallManagementRoutes = require('./routes/hallManagementRoutes');
const tiecCuoiRoutes = require('./routes/tiecCuoiRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const foodRoutes = require('./routes/foodRoutes');

// Register thêm các routes
app.use('/api/v1/wedding-service/bookings', weddingBookingRoutes);
app.use('/api/v1/wedding-service/halls', hallRoutes);
app.use('/api/v1/wedding-service/services', serviceRoutes);
app.use('/api/v1/wedding-service/regulations', regulationRoutes);
app.use('/api/v1/wedding-service/lookup', weddingLookupRoutes);
app.use('/api/v1/wedding-service/lobby', hallManagementRoutes);
app.use('/api/v1/wedding-service/tiec-cuoi', tiecCuoiRoutes);
app.use('/api/v1/wedding-service/ca-tiec', shiftRoutes);
app.use('/api/v1/wedding-service/mon-an', foodRoutes);

// Legacy routes cho backward compatibility
app.use('/api/bookings', weddingBookingRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/regulations', regulationRoutes);
app.use('/api/lookup', weddingLookupRoutes);
app.use('/api/lobby', hallManagementRoutes);

// Thêm route mới cho /api/weddings để client có thể truy cập
app.use('/api/weddings', weddingLookupRoutes);

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

module.exports = app;