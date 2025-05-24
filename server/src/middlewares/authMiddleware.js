const jwt = require('jsonwebtoken');
const { execute } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'wedding_management_secret';

/**
 * Authentication middleware to verify JWT token and populate req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Không có token xác thực'
      });
    }

    // Extract token from "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token xác thực không hợp lệ'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded JWT:', { user: decoded.user }); // Debug log
    
    // Check if decoded token has the expected structure
    if (!decoded.user || !decoded.user.id) {
      console.log('Invalid token structure:', decoded); // Debug log
      return res.status(401).json({
        success: false,
        message: 'Token không có thông tin người dùng hợp lệ'
      });
    }
    
    const accountId = decoded.user.id;
    console.log('Authenticating user with account ID:', accountId); // Debug log
    
    // Get user info from database to ensure user still exists
    const userQuery = `
      SELECT 
        tk.ID_TaiKhoan,
        tk.Username,
        vt.TenVaiTro,
        vt.ID_VaiTro
      FROM TaiKhoan tk
      LEFT JOIN TaiKhoan_VaiTro tv ON tk.ID_TaiKhoan = tv.ID_TaiKhoan
      LEFT JOIN VaiTro vt ON tv.ID_VaiTro = vt.ID_VaiTro
      WHERE tk.ID_TaiKhoan = ?
    `;
    
    const userResult = await execute(userQuery, [accountId]);
    
    if (!userResult || userResult.length === 0) {
      console.log('User not found in database for account ID:', accountId); // Debug log
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    const user = userResult[0];
    console.log('User found:', { accountId: user.ID_TaiKhoan, username: user.Username, role: user.TenVaiTro }); // Debug log
    
    // Populate req.user with user information
    req.user = {
      accountId: user.ID_TaiKhoan,
      username: user.Username,
      role: user.TenVaiTro,
      roleId: user.ID_VaiTro
    };
    
    // Continue to next middleware/controller
    next();
    
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực người dùng'
    });
  }
};

module.exports = authMiddleware; 