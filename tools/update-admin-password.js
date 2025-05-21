const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Connection configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_DATABASE || 'TiecCuoiDB',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Admin12345'
};

async function updateAdminPassword() {
  let connection;
  
  try {
    console.log('Connecting to MySQL database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connection successful');
    
    // Generate hash for 'admin123'
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    console.log('Generated hash for admin123:', hash);
    
    // Update admin password
    const updateQuery = `
      UPDATE TaiKhoan
      SET PasswordHash = ?
      WHERE Username = 'admin@example.com'
    `;
    
    const [result] = await connection.execute(updateQuery, [hash]);
    
    if (result.affectedRows > 0) {
      console.log('✅ Admin password updated successfully');
    } else {
      console.log('❌ Admin user not found');
    }
  } catch (err) {
    console.error('❌ Error updating admin password:', err.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

updateAdminPassword(); 