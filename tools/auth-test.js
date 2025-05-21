const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simulate database users
const users = [
  {
    id: 1,
    username: 'admin@example.com',
    password: '$2a$10$gYfELbVDT3m3AbP3R2RQSODTjCFhzBn9i7n3jnGHJm.tFcXfPAU8u', // 'admin123' hashed
    name: 'Administrator',
    email: 'admin@example.com',
    role: 'administrator'
  },
  {
    id: 2,
    username: 'trinhhoang@gmail.com',
    password: '$2a$10$Z..kHQ/9renYhfzEwxUps.t0g23z7lZMrRdY8PASbV4HXpigL83e.', // 'password123' hashed
    name: 'Trịnh Văn Hoàng',
    email: 'trinhhoang@gmail.com',
    role: 'administrator'
  },
  {
    id: 3,
    username: 'trinhhoang2525@gmail.com',
    password: '$2a$10$k4TTTEAQt140CP/P56SY7.nlGBJZtpwlSt/OAyzhiBWvJvivAP6VC', // 'password123' hashed
    name: 'Nguyễn Thị Mai',
    email: 'trinhhoang2525@gmail.com',
    role: 'user'
  }
];

// Authenticate user function
async function authenticateUser(email, password) {
  try {
    console.log(`Authentication attempt for email: ${email}`);
    
    // Find user by email
    const user = users.find(u => u.username === email || u.email === email);
    
    if (!user) {
      console.log(`Authentication failed: No user found with email ${email}`);
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
    
    // Compare passwords
    console.log(`Comparing password for account ID: ${user.id}`);
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log(`Authentication failed: Invalid password for account ID ${user.id}`);
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
    
    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
    
    const token = jwt.sign(
      payload,
      'wedding_management_secret',
      { expiresIn: '24h' }
    );
    
    console.log(`Authentication successful for account ID: ${user.id}`);
    
    return {
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Test register function
async function registerUser(userData) {
  try {
    console.log(`Registration attempt for email: ${userData.email}`);
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email || u.username === userData.email);
    
    if (existingUser) {
      console.log(`Registration failed: Email ${userData.email} already exists`);
      return {
        success: false,
        message: 'User with this email already exists'
      };
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      username: userData.email,
      password: hashedPassword,
      name: userData.name,
      email: userData.email,
      role: 'user'
    };
    
    // In a real system, we would add this to the database
    // For the test, we'll just push to our array
    users.push(newUser);
    
    console.log(`Registration successful for user: ${newUser.email}`);
    
    return {
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Test functions
async function runTests() {
  console.log('=== Starting Authentication Tests ===\n');
  
  // Test login with correct credentials
  console.log('Test 1: Login with admin credentials');
  const loginResult = await authenticateUser('admin@example.com', 'admin123');
  console.log(`Result: ${loginResult.success ? 'Success ✅' : 'Failed ❌'}`);
  console.log('Token:', loginResult.token ? loginResult.token.substring(0, 20) + '...' : 'None');
  console.log();
  
  // Test login with incorrect password
  console.log('Test 2: Login with incorrect password');
  const failedLogin = await authenticateUser('admin@example.com', 'wrongpassword');
  console.log(`Result: ${failedLogin.success ? 'Success ❌' : 'Failed as expected ✅'}`);
  console.log();
  
  // Test login with non-existent user
  console.log('Test 3: Login with non-existent user');
  const nonExistentLogin = await authenticateUser('nonexistent@example.com', 'password123');
  console.log(`Result: ${nonExistentLogin.success ? 'Success ❌' : 'Failed as expected ✅'}`);
  console.log();
  
  // Test regular user login
  console.log('Test 4: Login with regular user credentials');
  const userLogin = await authenticateUser('trinhhoang2525@gmail.com', 'password123');
  console.log(`Result: ${userLogin.success ? 'Success ✅' : 'Failed ❌'}`);
  console.log('User role:', userLogin.user ? userLogin.user.role : 'None');
  console.log();
  
  // Test registration with new user
  console.log('Test 5: Register new user');
  const registrationResult = await registerUser({
    name: 'New Test User',
    email: 'newtestuser@example.com',
    password: 'newpassword123'
  });
  console.log(`Result: ${registrationResult.success ? 'Success ✅' : 'Failed ❌'}`);
  console.log();
  
  // Test login with newly registered user
  console.log('Test 6: Login with newly registered user');
  const newUserLogin = await authenticateUser('newtestuser@example.com', 'newpassword123');
  console.log(`Result: ${newUserLogin.success ? 'Success ✅' : 'Failed ❌'}`);
  console.log();
  
  // Test duplicate registration
  console.log('Test 7: Register duplicate user');
  const duplicateRegistration = await registerUser({
    name: 'Duplicate User',
    email: 'newtestuser@example.com',
    password: 'anotherpassword'
  });
  console.log(`Result: ${duplicateRegistration.success ? 'Success ❌' : 'Failed as expected ✅'}`);
  
  console.log('\n=== Authentication Tests Completed ===');
}

// Run the tests
runTests(); 