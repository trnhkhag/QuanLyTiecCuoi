const fetch = require('node-fetch');

// Base URL for API calls
const BASE_URL = 'http://localhost:3001';

// Function to make API requests
async function callAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    console.log(`Testing: ${url}`);
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { 'Authorization': `Bearer ${options.token}` } : {}),
        ...options.headers
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {})
    });
    
    const statusText = response.ok ? '✅' : '❌';
    console.log(`${statusText} Status: ${response.status}`);
    
    const data = await response.json();
    return { status: response.status, ok: response.ok, data };
  } catch (error) {
    console.error(`❌ Error calling ${url}:`, error.message);
    return { status: 0, ok: false, error: error.message };
  }
}

// Test all microservice health endpoints
async function testHealthEndpoints() {
  console.log('\n=== Testing Health Endpoints ===');
  
  await callAPI('/health');
  await callAPI('/api/v1/auth-service/health');
  await callAPI('/api/v1/invoice-service/health');
  await callAPI('/api/v1/wedding-service/health');
  await callAPI('/api/v1/report-service/health');
}

//admin: {email: 'trinhhoang@gmail.com', password: 'password123'}
//user: {email: 'trinhhoang2525@gmail.com', password: 'password123'}

// Test authentication endpoints
async function testAuthService() {
  console.log('\n=== Testing Auth Service ===');
  
  // Test login with admin credentials
  const loginResult = await callAPI("/api/v1/auth-service/login", {
    method: "POST",
    body: {
      email: "trinhhoang2525@gmail.com",
      password: "password123",
    },
  });
  
  // Return the token for further authenticated requests
  return loginResult.ok ? loginResult.data.token : null;
}

// Test invoice-related endpoints
async function testInvoiceService(token) {
  console.log('\n=== Testing Invoice Service ===');
  
  // Get all invoices (authenticated request)
  await callAPI('/api/v1/invoice-service', {
    token
  });
}

// Test wedding-related endpoints
async function testWeddingService(token) {
  console.log('\n=== Testing Wedding Service ===');
  
  // Get all ca tiec (time slots)
  await callAPI('/api/v1/wedding-service/ca-tiec');
  
  // Get all tiec cuoi (weddings)
  await callAPI('/api/v1/wedding-service/tiec-cuoi', {
    token
  });
}

// Test report-related endpoints
async function testReportService(token) {
  console.log('\n=== Testing Report Service ===');
  
  // Get monthly report
  await callAPI('/api/v1/report-service/monthly', {
    method: 'GET',
    token,
    headers: {
      'year': new Date().getFullYear(),
      'month': new Date().getMonth() + 1
    }
  });
}

// Main function to run all tests
async function runTests() {
  console.log('Starting API tests...');
  
  // Test health endpoints
  await testHealthEndpoints();
  
  // Test auth service and get token
  const token = await testAuthService();
  
  if (token) {
    console.log('✅ Authentication successful, received token');
    
    // Run authenticated tests
    await testInvoiceService(token);
    await testWeddingService(token);
    await testReportService(token);
  } else {
    console.log('❌ Authentication failed, skipping authenticated tests');
  }
  
  console.log('\nAPI tests completed');
}

// Run the tests
runTests(); 