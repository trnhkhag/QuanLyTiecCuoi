// Server API for Wedding Management System
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Add your database password if needed
  database: 'wedding_management'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Handle database connection errors
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
    console.log('API will return mock data for testing');
  });

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Mock data in case DB connection fails
const mockData = {
  halls: [
    { MA_SANH: 'SC001', TEN_SANH: 'Sảnh Diamond', SUC_CHUA: 500, GIA_TOI_THIEU: 50000000 },
    { MA_SANH: 'SC002', TEN_SANH: 'Sảnh Ruby', SUC_CHUA: 300, GIA_TOI_THIEU: 30000000 },
    { MA_SANH: 'SC003', TEN_SANH: 'Sảnh Emerald', SUC_CHUA: 200, GIA_TOI_THIEU: 20000000 }
  ],
  foods: [
    { MA_MON: 'MA001', TEN_MON: 'Gỏi cuốn tôm thịt', DON_GIA: 120000, GHI_CHU: 'Khai vị' },
    { MA_MON: 'MA002', TEN_MON: 'Súp hải sản', DON_GIA: 150000, GHI_CHU: 'Khai vị' },
    { MA_MON: 'MA003', TEN_MON: 'Cá hồi nướng', DON_GIA: 280000, GHI_CHU: 'Món chính' }
  ],
  services: [
    { MA_DV: 'DV001', TEN_DV: 'Trang trí hoa tươi', DON_GIA: 5000000, GHI_CHU: 'Bao gồm cổng và bàn tiệc' },
    { MA_DV: 'DV002', TEN_DV: 'Ban nhạc sống', DON_GIA: 8000000, GHI_CHU: '4 nhạc công, 2 giờ biểu diễn' },
    { MA_DV: 'DV003', TEN_DV: 'MC chuyên nghiệp', DON_GIA: 3000000, GHI_CHU: 'MC song ngữ Việt - Anh' }
  ]
};

// Get all wedding halls
app.get('/api/wedding-halls', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM SANH_CUOI');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching wedding halls:', error);
    console.log('Returning mock data for wedding halls');
    res.json(mockData.halls);
  }
});

// Get all food items
app.get('/api/foods', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM MON_AN');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(500).json({ error: 'Failed to retrieve food items' });
  }
});

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM DICH_VU');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test API available at http://localhost:${PORT}/api/test`);
});