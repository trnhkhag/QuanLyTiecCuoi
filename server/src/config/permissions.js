/**
 * Permission constants using bitwise flags
 */
const PERMISSIONS = {
  // Basic user permissions
  VIEW_DASHBOARD: 1,          // 2^0 = 1
  MANAGE_PROFILE: 2,          // 2^1 = 2
  
  // Wedding management permissions
  VIEW_WEDDINGS: 4,           // 2^2 = 4
  CREATE_WEDDING: 8,          // 2^3 = 8  
  EDIT_WEDDING: 16,           // 2^4 = 16
  DELETE_WEDDING: 32,         // 2^5 = 32
  
  // Payment and billing permissions
  VIEW_PAYMENTS: 64,          // 2^6 = 64
  MANAGE_PAYMENTS: 128,       // 2^7 = 128
  
  // Admin permissions
  MANAGE_USERS: 256,          // 2^8 = 256
  SYSTEM_SETTINGS: 512,       // 2^9 = 512
};

/**
 * Role-based permission presets 
 */
const ROLE_PERMISSIONS = {
  admin: 1023, // All permissions (2^10 - 1)
  manager: 255, // All except admin permissions (2^8 - 1)
  user: 7,  // Basic permissions only (VIEW_DASHBOARD, MANAGE_PROFILE)
};

/**
 * Get permissions bitwise value based on user role
 */
function getPermissionsByRole(role) {
  return ROLE_PERMISSIONS[role.toLowerCase()] || ROLE_PERMISSIONS.user;
}

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getPermissionsByRole
}; 