-- ============================================
-- CREATE DEMO USER FOR NOCHILL LOGIN
-- ============================================
-- Run this in Neon SQL Editor after executing schema.sql

-- Check if user already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'demo@nochill.co.za') THEN
    -- Password: nochill2024
    -- This hash is generated with bcrypt (10 rounds)
    INSERT INTO users (email, password_hash, full_name)
    VALUES (
      'demo@nochill.co.za',
      '$2b$10$8PMkZm5soxsmiAnFL28CbecUq4/CIyGktF49iA7/2Fq433RXXGUIO',
      'Ndivhuwo Muhanelwa'
    );
    RAISE NOTICE 'Demo user created successfully!';
  ELSE
    RAISE NOTICE 'Demo user already exists';
  END IF;
END $$;

-- Verify user was created
SELECT id, email, full_name, created_at
FROM users
WHERE email = 'demo@nochill.co.za';
