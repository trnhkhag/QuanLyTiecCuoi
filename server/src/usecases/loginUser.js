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
    try {
      // Authenticate user with repository
      const result = await this.userRepository.authenticate(email, password);
      return result;
    } catch (error) {
      console.error('Login error in use case:', error);
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  }
}

module.exports = LoginUserUseCase; 