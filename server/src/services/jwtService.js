const jwt = require('jsonwebtoken');

// JWT secret would normally be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Service for JWT token generation and verification
 */
class JwtService {
  /**
   * Generate a JWT token for a user
   */
  generateToken(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Verify a JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract token from request authorization header
   */
  extractTokenFromHeader(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
}

module.exports = new JwtService(); 