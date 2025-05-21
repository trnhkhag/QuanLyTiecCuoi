// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('DB Config:', {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '***' : undefined
});

// Tạo pool connection để tái sử dụng
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_DATABASE || 'TiecCuoiDB',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Admin12345',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kiểm tra kết nối
pool.getConnection()
  .then(connection => {
    console.log('Kết nối MySQL thành công');
    connection.release();
  })
  .catch(err => {
    console.error('Không thể kết nối với MySQL:', err);
  });

module.exports = {
  pool,
  execute: async (sql, params) => {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Lỗi thực thi truy vấn:', error);
      throw error;
    }
  }
};