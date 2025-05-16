#!/usr/bin/env node

/**
 * Script pour tester les fonctionnalités d'authentification
 */

const http = require('http');

// Configuration
const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || 3001;

// Données de test
const TEST_USER = {
  fullName: 'Test User',
  email: 'test' + Date.now() + '@example.com',
  password: 'Password123!',
};

// Fonction pour faire une requête HTTP
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
  console.log("🧪 Démarrage des tests d'authentification");
  console.log('----------------------------------------');

  try {
    // Test 1: Inscription
    console.log(`👤 Test d'inscription avec email: ${TEST_USER.email}`);
    const registerResponse = await request('POST', '/auth/register', TEST_USER);

    if (
      registerResponse.statusCode === 201 ||
      registerResponse.statusCode === 200
    ) {
      console.log('✅ Inscription réussie');
      console.log('Token JWT reçu:', registerResponse.body.access_token);
    } else {
      console.log("❌ Échec de l'inscription:", registerResponse.statusCode);
      console.log(registerResponse.body);
    }

    console.log('----------------------------------------');

    // Test 2: Connexion
    console.log('🔐 Test de connexion');
    const loginResponse = await request('POST', '/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    let authToken;
    if (loginResponse.statusCode === 200 || loginResponse.statusCode === 201) {
      console.log('✅ Connexion réussie');
      authToken = loginResponse.body.access_token;
      console.log('Token JWT reçu:', authToken);
    } else {
      console.log('❌ Échec de la connexion:', loginResponse.statusCode);
      console.log(loginResponse.body);
    }

    console.log('----------------------------------------');

    // Test 3: Récupération du profil (requête authentifiée)
    if (authToken) {
      console.log('👤 Test de récupération du profil');
      const profileResponse = await request('GET', '/auth/me', null, authToken);

      if (profileResponse.statusCode === 200) {
        console.log('✅ Récupération du profil réussie');
        console.log(profileResponse.body);
      } else {
        console.log(
          '❌ Échec de la récupération du profil:',
          profileResponse.statusCode,
        );
        console.log(profileResponse.body);
      }
    }

    console.log('----------------------------------------');
    console.log('🏁 Tests terminés');
  } catch (error) {
    console.error('❌ Erreur durant les tests:', error.message);
  }
}

// Exécuter les tests
runTests();
