const mysql = require('mysql2/promise');

async function checkTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'TiecCuoiDB',
    user: 'root',
    password: 'Admin12345'
  });
  
  try {
    const [rows] = await connection.query('DESCRIBE KhachHang');
    console.log('KhachHang table structure:');
    rows.forEach(row => {
      console.log(`${row.Field}: ${row.Type} ${row.Null} ${row.Key} ${row.Default}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkTable(); 