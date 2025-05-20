const bcrypt = require('bcryptjs');
const jwtService = require('../services/jwtService');

/**
 * Use case for user registration
 */
class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Execute the registration process
   */
  async execute(userData) {
    try {
      // Create user
      const user = await this.userRepository.create(userData);
      
      // After creating, authenticate to get token
      const authResult = await this.userRepository.authenticate(userData.email, userData.password);
      
      return authResult;
    } catch (error) {
      console.error('Registration error in use case:', error);
      
      // Handle specific errors
      if (error.message && error.message.includes('already exists')) {
        return {
          success: false,
          message: 'Email already in use'
        };
      }
      
      return {
        success: false,
        message: 'An error occurred during registration'
      };
    }
  }
}

module.exports = RegisterUserUseCase; 