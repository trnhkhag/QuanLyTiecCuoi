const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, sql } = require('../config/db');

/**
 * SQL Server implementation of the user repository that works with
 * the TaiKhoan, VaiTro, Quyen schema structure
 */
class SqlUserRepository {
  /**
   * Find a user by email
   * @param {string} email - The email to search for
   * @returns {Promise<object|null>} The user object or null if not found
   */
  async findByEmail(email) {
    try {
      await pool.connect();
      
      // Query to find a user by email from either KhachHang or NhanVien
      const query = `
        SELECT 
          tk.ID_TaiKhoan,
          tk.Username,
          tk.PasswordHash as Password,
          COALESCE(kh.HoTen, nv.HoTen) as HoTen,
          COALESCE(kh.Email, '') as Email,
          vt.ID_VaiTro,
          vt.TenVaiTro
        FROM TaiKhoan tk
        LEFT JOIN KhachHang kh ON kh.ID_TaiKhoan = tk.ID_TaiKhoan AND kh.Email = @email
        LEFT JOIN NhanVien nv ON nv.ID_TaiKhoan = tk.ID_TaiKhoan
        LEFT JOIN TaiKhoan_VaiTro tvt ON tvt.ID_TaiKhoan = tk.ID_TaiKhoan
        LEFT JOIN VaiTro vt ON vt.ID_VaiTro = tvt.ID_VaiTro
        WHERE kh.Email = @email
      `;
      
      console.log(`Finding user by email: ${email}`);
      
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query(query);
      
      if (result.recordset.length === 0) {
        console.log(`No user found with email: ${email}`);
        return null;
      }
      
      console.log(`User found with email: ${email}, ID: ${result.recordset[0].ID_TaiKhoan}`);
      return result.recordset[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
  
  /**
   * Create a new user
   * @param {object} user - The user data
   * @returns {Promise<object>} The created user
   */
  async create(user) {
    try {
      await pool.connect();
      
      // Start transaction
      const transaction = new sql.Transaction(pool);
      await transaction.begin();
      
      try {
        // Check if user with this email already exists
        const existingUser = await this.findByEmail(user.email);
        if (existingUser) {
          console.error(`Registration failed: User with email ${user.email} already exists`);
          throw new Error('User with this email already exists');
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        // 1. Create TaiKhoan record
        const createTaiKhoanQuery = `
          INSERT INTO TaiKhoan (Username, PasswordHash)
          OUTPUT INSERTED.ID_TaiKhoan
          VALUES (@username, @passwordHash)
        `;
        
        const username = user.email; // Use email as username
        const taiKhoanResult = await new sql.Request(transaction)
          .input('username', sql.NVarChar, username)
          .input('passwordHash', sql.NVarChar, hashedPassword)
          .query(createTaiKhoanQuery);
        
        if (taiKhoanResult.recordset.length === 0) {
          throw new Error('Failed to create account');
        }
        
        const taiKhoanId = taiKhoanResult.recordset[0].ID_TaiKhoan;
        
        // 2. Assign default role (assuming roleId 2 is for regular users)
        const defaultRoleId = 2; // Regular user role
        
        const assignRoleQuery = `
          INSERT INTO TaiKhoan_VaiTro (ID_TaiKhoan, ID_VaiTro)
          VALUES (@taiKhoanId, @roleId)
        `;
        
        await new sql.Request(transaction)
          .input('taiKhoanId', sql.Int, taiKhoanId)
          .input('roleId', sql.Int, defaultRoleId)
          .query(assignRoleQuery);
        
        // 3. Create KhachHang record
        const createKhachHangQuery = `
          INSERT INTO KhachHang (HoTen, SoDienThoai, Email, ID_TaiKhoan)
          OUTPUT INSERTED.*
          VALUES (@name, @phone, @email, @taiKhoanId)
        `;
        
        // Generate a random phone number for now (since it's required)
        const randomPhone = `0${Math.floor(100000000 + Math.random() * 900000000)}`;
        
        const khachHangResult = await new sql.Request(transaction)
          .input('name', sql.NVarChar, user.name)
          .input('phone', sql.VarChar, randomPhone)
          .input('email', sql.NVarChar, user.email)
          .input('taiKhoanId', sql.Int, taiKhoanId)
          .query(createKhachHangQuery);
        
        if (khachHangResult.recordset.length === 0) {
          throw new Error('Failed to create customer record');
        }
        
        // Commit transaction
        await transaction.commit();
        
        // Prepare response
        const newUser = {
          ID_KhachHang: khachHangResult.recordset[0].ID_KhachHang,
          ID_TaiKhoan: taiKhoanId,
          HoTen: user.name,
          Email: user.email,
          TenVaiTro: 'user' // Default role name
        };
        
        console.log(`User registered successfully, Account ID: ${taiKhoanId}, Customer ID: ${newUser.ID_KhachHang}`);
        return newUser;
      } catch (error) {
        // Rollback in case of error
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Check for SQL Server unique constraint violation
      if (error.number === 2627 || error.number === 2601) {
        throw new Error('User with this email or phone number already exists');
      }
      throw error;
    }
  }
  
  /**
   * Authenticate a user and generate a JWT token
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @returns {Promise<object>} Authentication result
   */
  async authenticate(email, password) {
    try {
      console.log(`Authentication attempt for email: ${email}`);
      
      // Find account by email
      const query = `
        SELECT 
          tk.ID_TaiKhoan,
          tk.Username,
          tk.PasswordHash as Password,
          COALESCE(kh.HoTen, nv.HoTen) as HoTen,
          COALESCE(kh.Email, '') as Email,
          COALESCE(kh.ID_KhachHang, 0) as ID_KhachHang,
          COALESCE(nv.ID_NhanVien, 0) as ID_NhanVien,
          vt.ID_VaiTro,
          vt.TenVaiTro
        FROM TaiKhoan tk
        LEFT JOIN KhachHang kh ON kh.ID_TaiKhoan = tk.ID_TaiKhoan
        LEFT JOIN NhanVien nv ON nv.ID_TaiKhoan = tk.ID_TaiKhoan
        LEFT JOIN TaiKhoan_VaiTro tvt ON tvt.ID_TaiKhoan = tk.ID_TaiKhoan
        LEFT JOIN VaiTro vt ON vt.ID_VaiTro = tvt.ID_VaiTro
        WHERE kh.Email = @email OR tk.Username = @email
      `;
      
      await pool.connect();
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query(query);
      
      if (result.recordset.length === 0) {
        console.log(`Authentication failed: No user found with email ${email}`);
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
      
      const user = result.recordset[0];
      
      // Compare passwords
      console.log(`Comparing password for account ID: ${user.ID_TaiKhoan}`);
      const isMatch = await bcrypt.compare(password, user.Password);
      
      if (!isMatch) {
        console.log(`Authentication failed: Invalid password for account ID ${user.ID_TaiKhoan}`);
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
      
      // Get role permissions
      const permissionsQuery = `
        SELECT q.Ten_Quyen, q.GiaTri
        FROM VaiTro_Quyen vq
        JOIN Quyen q ON q.ID_Quyen = vq.ID_Quyen
        WHERE vq.ID_VaiTro = @roleId
      `;
      
      const roleId = user.ID_VaiTro || 2; // Default to regular user if not found
      console.log(`Fetching permissions for account ID: ${user.ID_TaiKhoan}, role ID: ${roleId}`);
      
      const permissionsResult = await pool.request()
        .input('roleId', sql.Int, roleId)
        .query(permissionsQuery);
      
      // Create user profile with permissions
      const userProfile = {
        id: user.ID_TaiKhoan,
        customerId: user.ID_KhachHang > 0 ? user.ID_KhachHang : null,
        employeeId: user.ID_NhanVien > 0 ? user.ID_NhanVien : null,
        name: user.HoTen,
        email: user.Email,
        role: user.TenVaiTro || 'user',
        permissions: permissionsResult.recordset.map(p => ({
          name: p.Ten_Quyen,
          value: p.GiaTri
        }))
      };
      
      // Create JWT token
      const payload = {
        user: {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          role: userProfile.role
        }
      };
      
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'wedding_management_secret',
        { expiresIn: '24h' }
      );
      
      console.log(`Authentication successful for account ID: ${user.ID_TaiKhoan}`);
      
      return {
        success: true,
        message: 'Authentication successful',
        token,
        user: userProfile
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }
}

module.exports = SqlUserRepository; 