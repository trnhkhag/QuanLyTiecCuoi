const sql = require('mssql');

// Connection configuration
const config = {
  server: 'localhost',
  port: 1433,
  database: 'TiecCuoiDB',
  user: 'sa',
  password: '123',
  options: {
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

async function createNguoiDungTable() {
  try {
    console.log('Connecting to SQL Server...');
    await sql.connect(config);
    console.log('Connection successful ✅');
    
    // Check if NguoiDung table already exists
    const checkResult = await sql.query`
      SELECT CASE 
        WHEN EXISTS (
          SELECT 1 FROM INFORMATION_SCHEMA.TABLES 
          WHERE TABLE_NAME = 'NguoiDung'
        ) THEN 1 
        ELSE 0 
      END AS TableExists
    `;
    
    const tableExists = checkResult.recordset[0].TableExists === 1;
    
    if (tableExists) {
      console.log('NguoiDung table already exists! Skipping creation.');
      await sql.close();
      return;
    }
    
    // Create NguoiDung (Users) table
    const createTableQuery = `
    CREATE TABLE NguoiDung (
      ID_NguoiDung INT IDENTITY(1,1) PRIMARY KEY,
      HoTen NVARCHAR(100) NOT NULL,
      Email NVARCHAR(100) UNIQUE NOT NULL,
      Password NVARCHAR(255) NOT NULL,
      ID_Quyen INT NOT NULL,
      CONSTRAINT FK_NguoiDung_Quyen FOREIGN KEY (ID_Quyen) REFERENCES Quyen(ID_Quyen)
    );
    `;
    
    console.log('Creating NguoiDung table...');
    await sql.query(createTableQuery);
    console.log('NguoiDung table created successfully ✅');
    
    // Create an admin user
    console.log('Creating default admin user...');
    
    // Hash the password using the same method as in SqlUserRepository
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Insert admin user with ID_Quyen = 1 (admin)
    const insertAdminQuery = `
    INSERT INTO NguoiDung (HoTen, Email, Password, ID_Quyen)
    VALUES (@name, @email, @password, @roleId);
    `;
    
    await sql.query(insertAdminQuery, {
      name: sql.NVarChar('Administrator'),
      email: sql.NVarChar('admin@example.com'),
      password: sql.NVarChar(hashedPassword),
      roleId: sql.Int(1) // 1 = admin
    });
    
    console.log('Default admin user created ✅');
    console.log('Admin credentials:');
    console.log(' - Email: admin@example.com');
    console.log(' - Password: admin123');
    
    // Close the connection
    await sql.close();
    console.log('Operation completed successfully');
  } catch (err) {
    console.error('Error:', err);
    try {
      await sql.close();
    } catch {}
  }
}

createNguoiDungTable(); 