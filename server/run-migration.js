const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_DATABASE || 'TiecCuoiDB',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Admin12345'
  });
  
  try {
    // Add BOOK_WEDDING permission
    try {
      await connection.query(`
        INSERT INTO Quyen (ID_Quyen, Ten_Quyen, MoTa, GiaTri)
        VALUES (9, 'book_wedding', 'Đặt tiệc cưới cho khách hàng', 256)
      `);
      console.log('✅ Added BOOK_WEDDING permission');
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('⚠️ BOOK_WEDDING permission already exists, skipping...');
      } else {
        throw error;
      }
    }
    
    // Assign permission to customer role
    try {
      await connection.query(`
        INSERT INTO VaiTro_Quyen (ID_VaiTro, ID_Quyen)
        VALUES (7, 9)
      `);
      console.log('✅ Assigned BOOK_WEDDING permission to customer role');
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('⚠️ Permission assignment already exists, skipping...');
      } else {
        throw error;
      }
    }
    
    // Add DiaChi column to KhachHang table
    try {
      await connection.query(`
        ALTER TABLE KhachHang 
        ADD COLUMN DiaChi VARCHAR(255) NULL AFTER Email
      `);
      console.log('✅ Added DiaChi column to KhachHang table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️ DiaChi column already exists, skipping...');
      } else {
        throw error;
      }
    }
    
    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

runMigration(); 