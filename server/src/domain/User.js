/**
 * User domain entity representing a user in the system
 */
class User {
  constructor({ id, name, email, password, role, permissions, created_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.permissions = permissions;
    this.created_at = created_at;
  }

  /**
   * Returns a safe representation of user data without sensitive information
   */
  toPublicJSON() {
    const { password, ...publicData } = this;
    return publicData;
  }
}

module.exports = User; 