const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and extract user information
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header found');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const secretKey = process.env.JWT_SECRET || 'wedding_management_secret';
    const decoded = jwt.verify(token, secretKey);
    
    // Check if token has expected structure
    if (!decoded.user || !decoded.user.id) {
      console.log('Invalid token structure:', decoded);
      return res.status(401).json({
        success: false,
        message: 'Invalid token structure'
      });
    }
    
    // Attach user info to request
    req.user = {
      accountId: decoded.user.id,
      name: decoded.user.name,
      email: decoded.user.email,
      role: decoded.user.role,
      permissions: decoded.user.permissions || 0
    };
    
    console.log('Auth successful for user:', req.user.email);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
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
      message: 'Authentication error'
    });
  }
};

/**
 * Permission values
 */
const PERMISSIONS = {
  MANAGE_HALLS: 1,
  MANAGE_BOOKINGS: 2,
  SEARCH_WEDDINGS: 4,
  MANAGE_INVOICES: 8,
  VIEW_REPORTS: 16,
  MANAGE_REGULATIONS: 32,
  MANAGE_USERS: 64,
  VIEW_PROFILE: 128
};

/**
 * Middleware to check if user has required permission
 * @param {number} requiredPermission - Permission value to check
 */
const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    // First check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Check permission using bitwise AND
    const userPermissions = req.user.permissions || 0;
    if ((userPermissions & requiredPermission) === requiredPermission) {
      next();
    } else {
      console.log(`Permission denied for user ${req.user.email}. Required: ${requiredPermission}, Has: ${userPermissions}`);
      return res.status(403).json({
        success: false,
        message: 'Permission denied',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
  };
};

module.exports = { authMiddleware, requirePermission, PERMISSIONS }; 