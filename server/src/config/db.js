// config/db.js
const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_DATABASE || 'TiecCuoiDB',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '123',
  options: {
    encrypt: false, // For local development, disable encryption
    trustServerCertificate: true // Accept self-signed certificates
  }
};

// Create a pool to be reused for all queries
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Handle connection errors
pool.on('error', err => {
  console.error('SQL Server connection error:', err);
});

module.exports = {
  pool,
  poolConnect,
  sql
};