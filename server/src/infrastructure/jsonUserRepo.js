const fs = require('fs').promises;
const path = require('path');
const User = require('../domain/User');
const UserRepository = require('../repositories/userRepository');

/**
 * Implementation of UserRepository that uses a JSON file as storage
 */
class JsonUserRepository extends UserRepository {
  constructor(filePath) {
    super();
    this.filePath = filePath || path.join(__dirname, '../data/users.json');
  }

  /**
   * Read all users from the JSON file
   */
  async _readUsers() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading users file:', error);
      return [];
    }
  }

  /**
   * Write users data to the JSON file
   */
  async _writeUsers(users) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(users, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Error writing users file:', error);
      return false;
    }
  }

  /**
   * Find a user by ID
   */
  async findById(id) {
    const users = await this._readUsers();
    const userData = users.find(user => user.id === id);
    return userData ? new User(userData) : null;
  }

  /**
   * Find a user by email
   */
  async findByEmail(email) {
    const users = await this._readUsers();
    const userData = users.find(user => user.email === email);
    return userData ? new User(userData) : null;
  }

  /**
   * Create a new user
   */
  async create(userData) {
    const users = await this._readUsers();
    
    // Auto-increment ID
    const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
    const newUser = { 
      ...userData,
      id: maxId + 1,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    
    await this._writeUsers(users);
    return new User(newUser);
  }

  /**
   * Update an existing user
   */
  async update(id, userData) {
    const users = await this._readUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedUser = { ...users[index], ...userData };
    users[index] = updatedUser;
    
    await this._writeUsers(users);
    return new User(updatedUser);
  }

  /**
   * Delete a user
   */
  async delete(id) {
    const users = await this._readUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) {
      return false;
    }
    
    await this._writeUsers(filteredUsers);
    return true;
  }
}

module.exports = JsonUserRepository; 