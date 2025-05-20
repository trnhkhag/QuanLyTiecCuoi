/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  // RFC 5322 compliant regex
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

/**
 * Validate a phone number (Vietnamese format)
 * @param {string} phone - The phone number to validate
 * @returns {boolean} Whether the phone number is valid
 */
export const isValidPhoneNumber = (phone) => {
  // Match Vietnamese phone numbers
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone);
};

/**
 * Validate a password - must be at least 8 characters and contain 
 * at least one uppercase letter, one lowercase letter, one number, and one special character
 * @param {string} password - The password to validate
 * @returns {boolean} Whether the password is valid
 */
export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Check if a value is empty (null, undefined, empty string, or whitespace only)
 * @param {*} value - The value to check
 * @returns {boolean} Whether the value is empty
 */
export const isEmpty = (value) => {
  return value === null || value === undefined || 
    (typeof value === 'string' && value.trim() === '');
};

/**
 * Check if a value is a positive number
 * @param {*} value - The value to check
 * @returns {boolean} Whether the value is a positive number
 */
export const isPositiveNumber = (value) => {
  return typeof value === 'number' && !isNaN(value) && value > 0;
};

/**
 * Check if a date is valid and in the future
 * @param {Date|string} date - The date to check
 * @returns {boolean} Whether the date is valid and in the future
 */
export const isFutureDate = (date) => {
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    return parsedDate instanceof Date && !isNaN(parsedDate) && parsedDate > now;
  } catch (error) {
    return false;
  }
};

/**
 * Get validation error message for a field based on its type and value
 * @param {string} fieldName - The name of the field
 * @param {*} value - The value of the field
 * @param {string} fieldType - The type of the field
 * @returns {string|null} The error message, or null if the field is valid
 */
export const getValidationErrorMessage = (fieldName, value, fieldType) => {
  switch (fieldType) {
    case 'email':
      if (isEmpty(value)) return `${fieldName} là bắt buộc`;
      if (!isValidEmail(value)) return `${fieldName} không hợp lệ`;
      return null;
      
    case 'phone':
      if (isEmpty(value)) return `${fieldName} là bắt buộc`;
      if (!isValidPhoneNumber(value)) return `${fieldName} không hợp lệ`;
      return null;
      
    case 'password':
      if (isEmpty(value)) return `${fieldName} là bắt buộc`;
      if (!isValidPassword(value)) {
        return `${fieldName} phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt`;
      }
      return null;
      
    case 'number':
      if (isEmpty(value)) return `${fieldName} là bắt buộc`;
      if (!isPositiveNumber(value)) return `${fieldName} phải là số dương`;
      return null;
      
    case 'date':
      if (isEmpty(value)) return `${fieldName} là bắt buộc`;
      if (!isFutureDate(value)) return `${fieldName} phải là ngày trong tương lai`;
      return null;
      
    default:
      if (isEmpty(value)) return `${fieldName} là bắt buộc`;
      return null;
  }
}; 