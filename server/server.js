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
const weddingBookingRoutes = require('./DatTiec/weddingBookingRoutes');
const hallRoutes = require('./DatTiec/hallRoutes');
const serviceRoutes = require('./DatTiec/serviceRoutes');
const regulationRoutes = require('./QuyDinh/regulationRoutes');
// Thêm các routes khác khi cần
// const hallRoutes = require('./routes/hallRoutes');
// const foodRoutes = require('./routes/foodRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');

// Register routes
app.use('/api/bookings', weddingBookingRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/regulations', regulationRoutes);
// Thêm các routes khác khi cần
// app.use('/api/halls', hallRoutes);
// app.use('/api/foods', foodRoutes);
// app.use('/api/services', serviceRoutes);

//Lấy cái ca tiệc rẻ rách
app.get('/api/lookups/shifts', async (req, res) => {
  try {
    const [shifts] = await pool.query('SELECT ID_Ca, TenCa FROM CaTiec ORDER BY ID_Ca');
    res.json({ success: true, data: shifts });
  } catch (error) {
    console.error('Error fetching shifts:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách ca tiệc' });
  }
});

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