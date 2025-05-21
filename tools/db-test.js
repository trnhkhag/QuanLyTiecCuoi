const mysql = require('mysql2/promise');

// Connection configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_DATABASE || 'TiecCuoiDB',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Admin12345'
};

async function testDatabase() {
  let connection;
  
  try {
    console.log('Connecting to MySQL database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connection successful');
    
    // Get list of tables
    console.log('\nFetching table list:');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('❌ No tables found in database');
    } else {
      console.log(`✅ Found ${tables.length} tables:`);
      
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        console.log(`  - ${tableName}`);
        
        // Get row count for each table
        const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const rowCount = countResult[0].count;
        console.log(`    Rows: ${rowCount}`);
        
        // If there are rows and table is important, show a sample
        if (rowCount > 0 && ['TaiKhoan', 'CaTiec', 'LoaiSanh'].includes(tableName)) {
          const [sampleRows] = await connection.query(`SELECT * FROM ${tableName} LIMIT 3`);
          console.log(`    Sample data:`, JSON.stringify(sampleRows, null, 2));
        }
      }
    }
  } catch (err) {
    console.error('❌ Database test failed:', err.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed');
    }
  }
}

// Run the test
testDatabase(); 