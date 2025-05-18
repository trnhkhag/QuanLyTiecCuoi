const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();

const mockData = require('./data/mockData');
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());
app.locals.mockData = mockData;

// Kiểm tra kết nối database
pool.getConnection()
  .then(conn => {
    console.log('✅ Kết nối database thành công!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Kết nối database thất bại:', err.message);
    console.log('🔄 API sẽ sử dụng mock data để test');
  });

// Import routes
const weddingBookingRoutes = require('./routes/weddingBookingRoutes');
// Thêm các routes khác khi cần
// const hallRoutes = require('./routes/hallRoutes');
// const foodRoutes = require('./routes/foodRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');

// Register routes
app.use('/api/bookings', weddingBookingRoutes);
// Thêm các routes khác khi cần
// app.use('/api/halls', hallRoutes);
// app.use('/api/foods', foodRoutes);
// app.use('/api/services', serviceRoutes);

// Sample route test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API hoạt động bình thường!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Server đang chạy tại http://localhost:${PORT}`);
});

// Export pool cho các service sử dụng
module.exports = { pool };