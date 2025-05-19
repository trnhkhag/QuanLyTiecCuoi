const bcrypt = require('bcryptjs');
const jwtService = require('../services/jwtService');
const { getPermissionsByRole } = require('../config/permissions');

/**
 * Use case for user login
 */
class LoginUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Execute the login process
   */
  async execute(email, password) {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    
    // Check if user exists
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
    
    // Get permissions based on role
    const permissions = user.permissions || getPermissionsByRole(user.role);
    
    // Generate JWT token
    const token = jwtService.generateToken({
      ...user,
      permissions
    });
    
    // Add permissions to user public data
    const userData = user.toPublicJSON();
    userData.permissions = permissions;
    
    return {
      success: true,
      token,
      user: userData
    };
  }
}

module.exports = LoginUserUseCase; 