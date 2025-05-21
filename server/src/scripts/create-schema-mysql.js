const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Connection configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_DATABASE || 'TiecCuoiDB',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Admin12345',
  multipleStatements: true // Important for running multi-statement SQL scripts
};

// MySQL initialization script path
const schemaFilePath = path.join(__dirname, '../../../Database/init/01-schema.sql');

async function createDatabaseSchema() {
  let connection;
  
  try {
    console.log('Reading schema file...');
    const schemaScript = fs.readFileSync(schemaFilePath, 'utf8');
    
    console.log('Connecting to MySQL...');
    connection = await mysql.createConnection(config);
    console.log('Connection successful ✅');
    
    console.log('Creating database schema...');
    await connection.query(schemaScript);
    console.log('Database schema created successfully ✅');
    
    console.log('Database setup completed');
  } catch (err) {
    console.error('Error creating database schema:', err);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Execute the function if this script is run directly
if (require.main === module) {
  createDatabaseSchema();
}

// Export for potential use in other scripts
module.exports = { createDatabaseSchema }; 