const LoginUserUseCase = require('../usecases/loginUser');
const RegisterUserUseCase = require('../usecases/registerUser');
const JsonUserRepository = require('../infrastructure/jsonUserRepo');

// Initialize repositories and use cases
const userRepository = new JsonUserRepository();
const loginUserUseCase = new LoginUserUseCase(userRepository);
const registerUserUseCase = new RegisterUserUseCase(userRepository);

/**
 * Controller for authentication-related endpoints
 */
class AuthController {
  /**
   * Login a user
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await loginUserUseCase.execute(email, password);
      
      if (!result.success) {
        return res.status(401).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Register a new user
   */
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await registerUserUseCase.execute({ name, email, password });
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      res.status(201).json(result);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new AuthController(); 