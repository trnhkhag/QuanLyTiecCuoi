const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, execute } = require('../config/db');

/**
 * Implementation of UserRepository for MySQL database
 */
class SqlUserRepository {
  /**
   * Find a user by email
   * @param {string} email - The email address to search for
   * @returns {Promise<Object|null>} User object if found, null otherwise
   */
  async findByEmail(email) {
    try {
      console.log(`Finding user by email: ${email}`);
      
      const query = `
        SELECT 
          tk.ID_TaiKhoan,
          tk.Username,
          tk.PasswordHash,
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
        WHERE kh.Email = ? OR tk.Username = ?
      `;
      
      const result = await execute(query, [email, email]);
      
      if (result.length === 0) {
        return null;
      }
      
      return {
        id: result[0].ID_TaiKhoan,
        username: result[0].Username,
        password: result[0].PasswordHash,
        name: result[0].HoTen,
        email: result[0].Email,
        role: result[0].TenVaiTro || 'user'
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
  
  /**
   * Create a new user
   * @param {Object} user - User object with name, email, and password
   * @returns {Promise<Object>} Newly created user
   */
  async create(user) {
    try {
      console.log(`Creating new user: ${user.email}`);
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      // Start transaction
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        
        // 1. Create TaiKhoan record
        const createTaiKhoanQuery = `
          INSERT INTO TaiKhoan (Username, PasswordHash)
          VALUES (?, ?)
        `;
        
        const username = user.email; // Use email as username
        const [taiKhoanResult] = await connection.execute(createTaiKhoanQuery, [username, hashedPassword]);
        
        if (!taiKhoanResult.insertId) {
          throw new Error('Failed to create account');
        }
        
        const taiKhoanId = taiKhoanResult.insertId;
        
        // 2. Assign default role (assuming roleId 2 is for regular users)
        const defaultRoleId = 2; // Regular user role
        
        const assignRoleQuery = `
          INSERT INTO TaiKhoan_VaiTro (ID_TaiKhoan, ID_VaiTro)
          VALUES (?, ?)
        `;
        
        await connection.execute(assignRoleQuery, [taiKhoanId, defaultRoleId]);
        
        // 3. Create KhachHang record
        const createKhachHangQuery = `
          INSERT INTO KhachHang (HoTen, SoDienThoai, Email, ID_TaiKhoan)
          VALUES (?, ?, ?, ?)
        `;
        
        // Generate a random phone number for now (since it's required)
        const randomPhone = `0${Math.floor(100000000 + Math.random() * 900000000)}`;
        
        const [khachHangResult] = await connection.execute(
          createKhachHangQuery, 
          [user.name, randomPhone, user.email, taiKhoanId]
        );
        
        if (!khachHangResult.insertId) {
          throw new Error('Failed to create customer record');
        }
        
        // Commit transaction
        await connection.commit();
        
        // Prepare response
        const newUser = {
          ID_KhachHang: khachHangResult.insertId,
          ID_TaiKhoan: taiKhoanId,
          HoTen: user.name,
          Email: user.email,
          TenVaiTro: 'user' // Default role name
        };
        
        console.log(`User registered successfully, Account ID: ${taiKhoanId}, Customer ID: ${newUser.ID_KhachHang}`);
        return newUser;
      } catch (error) {
        // Rollback in case of error
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Check for MySQL duplicate entry error
      if (error.code === 'ER_DUP_ENTRY') {
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
        WHERE kh.Email = ? OR tk.Username = ?
      `;
      
      const result = await execute(query, [email, email]);
      
      if (result.length === 0) {
        console.log(`Authentication failed: No user found with email ${email}`);
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
      
      const user = result[0];
      
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
        WHERE vq.ID_VaiTro = ?
      `;
      
      const roleId = user.ID_VaiTro || 2; // Default to regular user if not found
      console.log(`Fetching permissions for account ID: ${user.ID_TaiKhoan}, role ID: ${roleId}`);
      
      const permissionsResult = await execute(permissionsQuery, [roleId]);
      
      // Create user profile with permissions
      const userProfile = {
        id: user.ID_TaiKhoan,
        customerId: user.ID_KhachHang > 0 ? user.ID_KhachHang : null,
        employeeId: user.ID_NhanVien > 0 ? user.ID_NhanVien : null,
        name: user.HoTen,
        email: user.Email,
        role: user.TenVaiTro || 'user',
        permissions: permissionsResult.map(p => ({
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