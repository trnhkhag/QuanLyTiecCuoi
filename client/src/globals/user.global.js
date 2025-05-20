// Permission levels using bitwise operations for efficient permission checking
export const PERMISSIONS = {
  NONE: 0,
  VIEW: 1,
  CREATE: (1 << 1) | 1, // 3
  EDIT: (1 << 2) | 1, // 5
  DELETE: (1 << 3) | 1, // 9
  ADMIN: (1 << 4) | (1 << 3) | (1 << 2) | (1 << 1) | 1, // 31 - All permissions
};

// User roles
export const USER_ROLES = {
  GUEST: 'guest',
  CUSTOMER: 'customer',
  STAFF: 'staff',
  MANAGER: 'manager',
  ADMIN: 'admin',
};

// Role-permission mapping
export const ROLE_PERMISSIONS = {
  [USER_ROLES.GUEST]: PERMISSIONS.NONE,
  [USER_ROLES.CUSTOMER]: PERMISSIONS.VIEW,
  [USER_ROLES.STAFF]: PERMISSIONS.VIEW | PERMISSIONS.CREATE,
  [USER_ROLES.MANAGER]: PERMISSIONS.VIEW | PERMISSIONS.CREATE | PERMISSIONS.EDIT,
  [USER_ROLES.ADMIN]: PERMISSIONS.ADMIN,
};

// Permission checking helper functions
export const hasPermission = (userPermission, requiredPermission) => {
  return (userPermission & requiredPermission) === requiredPermission;
};

export const canView = (userPermission) => hasPermission(userPermission, PERMISSIONS.VIEW);
export const canCreate = (userPermission) => hasPermission(userPermission, PERMISSIONS.CREATE);
export const canEdit = (userPermission) => hasPermission(userPermission, PERMISSIONS.EDIT);
export const canDelete = (userPermission) => hasPermission(userPermission, PERMISSIONS.DELETE);
export const isAdmin = (userPermission) => hasPermission(userPermission, PERMISSIONS.ADMIN); 