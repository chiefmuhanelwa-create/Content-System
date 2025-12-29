#!/usr/bin/env node

/**
 * NOCHILL Login Debugging Script
 * Run this to diagnose login issues
 */

const bcrypt = require('bcrypt');

async function testPasswordHash() {
  console.log('\n🔐 PASSWORD HASH TEST');
  console.log('='.repeat(50));

  const password = 'nochill2024';
  console.log('Password to hash:', password);

  const hash = await bcrypt.hash(password, 10);
  console.log('Generated hash:', hash);

  const isMatch = await bcrypt.compare(password, hash);
  console.log('Hash verification:', isMatch ? '✅ PASS' : '❌ FAIL');

  console.log('\n📋 SQL INSERT STATEMENT:');
  console.log('-'.repeat(50));
  console.log(`INSERT INTO users (email, password_hash, full_name)`);
  console.log(`VALUES (`);
  console.log(`  'demo@nochill.co.za',`);
  console.log(`  '${hash}',`);
  console.log(`  'Ndivhuwo Muhanelwa'`);
  console.log(`);`);
  console.log('-'.repeat(50));
}

async function testDatabaseConnection() {
  console.log('\n🗄️  DATABASE CONNECTION TEST');
  console.log('='.repeat(50));

  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.log('❌ DATABASE_URL not set!');
    console.log('\n💡 Create .env.local file with:');
    console.log('DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname');
    return false;
  }

  console.log('✅ DATABASE_URL is set');
  console.log('Connection string (masked):', DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

  try {
    const { neon } = require('@neondatabase/serverless');
    const sql = neon(DATABASE_URL);

    console.log('\nTesting connection...');
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log('✅ Database connection successful!');
    console.log('PostgreSQL version:', result[0].pg_version.split(' ')[1]);
    console.log('Current time:', result[0].current_time);

    // Check if users table exists
    console.log('\nChecking for users table...');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'
    `;

    if (tables.length === 0) {
      console.log('❌ users table does NOT exist!');
      console.log('\n💡 You need to execute database/schema.sql in Neon Console');
      return false;
    }

    console.log('✅ users table exists');

    // Check if demo user exists
    console.log('\nChecking for demo user...');
    const users = await sql`
      SELECT id, email, full_name, created_at
      FROM users
      WHERE email = 'demo@nochill.co.za'
    `;

    if (users.length === 0) {
      console.log('❌ demo@nochill.co.za user does NOT exist!');
      console.log('\n💡 Create the user with the SQL statement above');
      return false;
    }

    console.log('✅ Demo user exists:');
    console.log('   ID:', users[0].id);
    console.log('   Email:', users[0].email);
    console.log('   Name:', users[0].full_name);
    console.log('   Created:', users[0].created_at);

    // Test password hash
    console.log('\nTesting password verification...');
    const testPassword = 'nochill2024';
    const isValid = await bcrypt.compare(testPassword, users[0].password_hash);

    if (!isValid) {
      console.log('❌ Password does NOT match!');
      console.log('\n💡 The password hash in database is incorrect');
      console.log('   Run this script and copy the new hash to update the user');
      return false;
    }

    console.log('✅ Password verification successful!');

    return true;

  } catch (error) {
    console.log('❌ Database connection failed!');
    console.log('Error:', error.message);
    return false;
  }
}

async function testJWT() {
  console.log('\n🔑 JWT TOKEN TEST');
  console.log('='.repeat(50));

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.log('❌ JWT_SECRET not set!');
    console.log('\n💡 Add to .env.local:');
    console.log('JWT_SECRET=your-secret-key-here');
    console.log('\nGenerate one with:');
    console.log('openssl rand -base64 64');
    return;
  }

  console.log('✅ JWT_SECRET is set (length:', JWT_SECRET.length, 'chars)');

  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { userId: 1, email: 'demo@nochill.co.za' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log('Generated token:', token.substring(0, 50) + '...');

  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ Token verification successful!');
  console.log('Decoded payload:', decoded);
}

async function testLoginAPI() {
  console.log('\n🌐 LOGIN API TEST');
  console.log('='.repeat(50));

  const axios = require('axios');

  console.log('Testing POST /api/auth/login...');

  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'demo@nochill.co.za',
      password: 'nochill2024'
    }, {
      timeout: 5000
    });

    console.log('✅ Login API successful!');
    console.log('Response status:', response.status);
    console.log('User data:', response.data.user);
    console.log('Token received:', response.data.token ? 'Yes' : 'No');

  } catch (error) {
    if (error.response) {
      console.log('❌ Login failed with status:', error.response.status);
      console.log('Error message:', error.response.data.message);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Cannot connect to dev server!');
      console.log('\n💡 Start the dev server with: npm run dev');
    } else {
      console.log('❌ Request failed:', error.message);
    }
  }
}

async function runAllTests() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   NOCHILL LOGIN DIAGNOSTIC TOOL               ║');
  console.log('║   Checking all components...                  ║');
  console.log('╚════════════════════════════════════════════════╝');

  await testPasswordHash();
  const dbOk = await testDatabaseConnection();
  await testJWT();

  if (dbOk) {
    console.log('\nWaiting for dev server to be ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await testLoginAPI();
  }

  console.log('\n' + '='.repeat(50));
  console.log('DIAGNOSTIC COMPLETE');
  console.log('='.repeat(50));

  if (!process.env.DATABASE_URL) {
    console.log('\n⚠️  CRITICAL: Create .env.local with DATABASE_URL');
  } else if (!dbOk) {
    console.log('\n⚠️  CRITICAL: Fix database setup issues above');
  } else {
    console.log('\n✅ All checks passed! Login should work.');
  }

  console.log('\n');
}

runAllTests().catch(console.error);
