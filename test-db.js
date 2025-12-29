#!/usr/bin/env node

/**
 * Database Connection Test
 * Tests connection to Neon database and creates demo user if needed
 */

// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        process.env[key] = value;
      }
    }
  });
}

const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');

async function testDatabase() {
  console.log('\n🗄️  DATABASE CONNECTION TEST');
  console.log('='.repeat(50));

  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL || DATABASE_URL.includes('REPLACE_WITH')) {
    console.log('❌ DATABASE_URL not properly set in .env.local');
    console.log('\nPlease update .env.local with your Neon connection string');
    return false;
  }

  console.log('✅ DATABASE_URL found');
  console.log('Connection:', DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

  try {
    const sql = neon(DATABASE_URL);

    // Test connection
    console.log('\nTesting connection...');
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log('✅ Database connected successfully!');
    console.log('PostgreSQL:', result[0].pg_version.split(' ')[1]);
    console.log('Server time:', result[0].current_time);

    // Check for users table
    console.log('\nChecking for users table...');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'
    `;

    if (tables.length === 0) {
      console.log('❌ users table does NOT exist!');
      console.log('\n💡 You need to execute database/schema.sql in Neon SQL Editor');
      console.log('   1. Go to https://console.neon.tech');
      console.log('   2. Open SQL Editor');
      console.log('   3. Copy all contents of database/schema.sql');
      console.log('   4. Paste and run in SQL Editor');
      return false;
    }

    console.log('✅ users table exists');

    // Check for demo user
    console.log('\nChecking for demo user...');
    const users = await sql`
      SELECT id, email, full_name, password_hash, created_at
      FROM users
      WHERE email = 'demo@nochill.co.za'
    `;

    if (users.length === 0) {
      console.log('⚠️  Demo user does NOT exist. Creating...');

      // Generate password hash
      const password = 'nochill2024';
      const passwordHash = await bcrypt.hash(password, 10);

      // Insert user
      await sql`
        INSERT INTO users (email, password_hash, full_name)
        VALUES ('demo@nochill.co.za', ${passwordHash}, 'Ndivhuwo Muhanelwa')
      `;

      console.log('✅ Demo user created!');
      console.log('   Email: demo@nochill.co.za');
      console.log('   Password: nochill2024');
    } else {
      console.log('✅ Demo user exists:');
      console.log('   ID:', users[0].id);
      console.log('   Email:', users[0].email);
      console.log('   Name:', users[0].full_name);
      console.log('   Created:', users[0].created_at);

      // Test password
      console.log('\nTesting password verification...');
      const testPassword = 'nochill2024';
      const isValid = await bcrypt.compare(testPassword, users[0].password_hash);

      if (!isValid) {
        console.log('⚠️  Password does NOT match! Updating...');
        const newHash = await bcrypt.hash(testPassword, 10);
        await sql`
          UPDATE users
          SET password_hash = ${newHash}
          WHERE email = 'demo@nochill.co.za'
        `;
        console.log('✅ Password updated!');
      } else {
        console.log('✅ Password verification successful!');
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL CHECKS PASSED!');
    console.log('='.repeat(50));
    console.log('\n🎉 You can now login with:');
    console.log('   Email: demo@nochill.co.za');
    console.log('   Password: nochill2024');
    console.log('\n');

    return true;

  } catch (error) {
    console.log('❌ Database error:', error.message);
    return false;
  }
}

testDatabase().catch(console.error);
