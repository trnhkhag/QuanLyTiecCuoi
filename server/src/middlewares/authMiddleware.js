const jwt = require('jsonwebtoken');
const { pool, execute } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'wedding_management_secret';

/**
 * Middleware xác thực JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Optional: Verify user still exists and is active
    const userQuery = `
      SELECT 
        tk.ID_TaiKhoan,
        tk.Username,
        COALESCE(kh.HoTen, nv.HoTen) as HoTen,
        COALESCE(kh.Email, '') as Email,
        vt.TenVaiTro,
        tk.TrangThai
      FROM TaiKhoan tk
      LEFT JOIN KhachHang kh ON kh.ID_TaiKhoan = tk.ID_TaiKhoan
      LEFT JOIN NhanVien nv ON nv.ID_TaiKhoan = tk.ID_TaiKhoan
      LEFT JOIN TaiKhoan_VaiTro tvt ON tvt.ID_TaiKhoan = tk.ID_TaiKhoan
      LEFT JOIN VaiTro vt ON vt.ID_VaiTro = tvt.ID_VaiTro
      WHERE tk.ID_TaiKhoan = ?
    `;

    const userResult = await execute(userQuery, [decoded.user.id]);
    
    if (userResult.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult[0];
    
    // Check if user account is active
    if (user.TrangThai === 'INACTIVE') {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive'
      });
    }

    // Add user info to request object
    req.user = {
      id: user.ID_TaiKhoan,
      name: user.HoTen,
      email: user.Email,
      role: user.TenVaiTro || 'user'
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Middleware kiểm tra quyền hạn dựa trên role
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Middleware kiểm tra quyền hạn cụ thể
 */
const requirePermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get user permissions
      const permissionQuery = `
        SELECT q.Ten_Quyen
        FROM TaiKhoan_VaiTro tvt
        JOIN VaiTro_Quyen vq ON vq.ID_VaiTro = tvt.ID_VaiTro
        JOIN Quyen q ON q.ID_Quyen = vq.ID_Quyen
        WHERE tvt.ID_TaiKhoan = ? AND q.Ten_Quyen = ?
      `;

      const permissionResult = await execute(permissionQuery, [req.user.id, permissionName]);

      if (permissionResult.length === 0) {
        return res.status(403).json({
          success: false,
          message: `Permission ${permissionName} is required`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requirePermission
}; 