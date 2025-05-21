#!/usr/bin/env node

/**
 * Script to test authentication features
 */

const http = require('http');

// Configuration
const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || 3001;

// Test data
const TEST_USER = {
  fullName: 'Test User',
  email: 'test' + Date.now() + '@example.com',
  password: 'Password123!',
};

// Function to make HTTP request
function request(method, path, data, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        try {
          const jsonResponse = responseBody ? JSON.parse(responseBody) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: jsonResponse,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: responseBody,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Tests
async function runTests() {
  console.log("🧪 Starting authentication tests");
  console.log('----------------------------------------');

  try {
    // Test 1: Registration
    console.log(`👤 Testing registration with email: ${TEST_USER.email}`);
    const registerResponse = await request('POST', '/auth/register', TEST_USER);

    if (
      registerResponse.statusCode === 201 ||
      registerResponse.statusCode === 200
    ) {
      console.log('✅ Registration successful');
      console.log('JWT Token received:', registerResponse.body.access_token);
    } else {
      console.log("❌ Registration failed:", registerResponse.statusCode);
      console.log(registerResponse.body);
    }

    console.log('----------------------------------------');

    // Test 2: Login
    console.log('🔐 Testing login');
    const loginResponse = await request('POST', '/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    let authToken;
    if (loginResponse.statusCode === 200 || loginResponse.statusCode === 201) {
      console.log('✅ Login successful');
      authToken = loginResponse.body.access_token;
      console.log('JWT Token received:', authToken);
    } else {
      console.log('❌ Login failed:', loginResponse.statusCode);
      console.log(loginResponse.body);
    }

    console.log('----------------------------------------');

    // Test 3: Profile retrieval (authenticated request)
    if (authToken) {
      console.log('👤 Testing profile retrieval');
      const profileResponse = await request('GET', '/auth/me', null, authToken);

      if (profileResponse.statusCode === 200) {
        console.log('✅ Profile retrieval successful');
        console.log(profileResponse.body);
      } else {
        console.log(
          '❌ Profile retrieval failed:',
          profileResponse.statusCode,
        );
        console.log(profileResponse.body);
      }
    }

    console.log('----------------------------------------');
    console.log('🏁 Tests completed');
  } catch (error) {
    console.error('❌ Error during tests:', error.message);
  }
}

// Run tests
runTests();
