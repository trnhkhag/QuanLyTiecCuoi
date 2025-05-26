const { body, validationResult } = require('express-validator');

/**
 * Middleware for validation error handling
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  
  next();
};

/**
 * Validation rules for login
 */
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

/**
 * Validation rules for registration
 */
const validateRegister = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('phoneNumber')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Phone number must be 10-11 digits'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateRegister
}; 