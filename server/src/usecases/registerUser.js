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
    // Check if user with this email already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    
    if (existingUser) {
      return {
        success: false,
        message: 'Email already in use'
      };
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Prepare user data for creation
    const newUserData = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: 'user' // Default role for new users
    };
    
    // Create the user
    const user = await this.userRepository.create(newUserData);
    
    // Generate JWT token
    const token = jwtService.generateToken(user);
    
    return {
      success: true,
      token,
      user: user.toPublicJSON()
    };
  }
}

module.exports = RegisterUserUseCase; 