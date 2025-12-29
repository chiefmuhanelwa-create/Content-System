-- ============================================
-- NOCHILL CONTENT GOVERNANCE SYSTEM
-- DATABASE SCHEMA
-- Version 1.0
-- ============================================

-- ============================================
-- TABLE 1: users
-- Stores authentication and user profile
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL DEFAULT 'Mr NoChill',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast login lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- TABLE 2: content_requests
-- Stores the input form data before generation
-- ============================================
CREATE TABLE IF NOT EXISTS content_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  -- Strategic Intent
  content_intent VARCHAR(50) NOT NULL CHECK (content_intent IN ('Entertain', 'Educate', 'Encourage', 'Earn')),
  paids_stream TEXT[] NOT NULL,
  seeds_stage VARCHAR(50) NOT NULL CHECK (seeds_stage IN ('Signals', 'Engagement', 'Education', 'Decision', 'Success')),

  -- Content Details
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('Short-form', 'Long-form', 'Email', 'Sales Page')),
  platform TEXT[] NOT NULL,
  content_pillar VARCHAR(100) NOT NULL CHECK (content_pillar IN ('Creator Business', 'Personal Story', 'African Excellence', 'Faith & Business')),

  -- Strategic Alignment
  laws_upheld TEXT[] NOT NULL,
  story_bank_reference VARCHAR(100),
  pain_point VARCHAR(100) NOT NULL CHECK (pain_point IN ('Platform Dependency', 'Monetization Confusion', 'Content Burnout', 'No Systems', 'Inconsistent Results')),
  desired_outcome VARCHAR(100) NOT NULL CHECK (desired_outcome IN ('Financial Freedom', 'Time Freedom', 'Creative Freedom', 'Influence', 'Legacy')),

  -- CTA Details
  cta_next_step VARCHAR(100) NOT NULL,
  product_tier VARCHAR(50) NOT NULL CHECK (product_tier IN ('Free', 'Entry', 'Core', 'Premium', 'High-Ticket')),

  -- Content Specifications
  max_length INTEGER,
  signature_phrase VARCHAR(255),
  framework_reference VARCHAR(100) NOT NULL,

  -- Additional Context
  additional_context TEXT,

  -- Status Tracking
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'generated', 'vetted', 'approved', 'rejected', 'published')),

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for filtering and searching
CREATE INDEX IF NOT EXISTS idx_content_requests_user_id ON content_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_content_requests_status ON content_requests(status);
CREATE INDEX IF NOT EXISTS idx_content_requests_content_pillar ON content_requests(content_pillar);
CREATE INDEX IF NOT EXISTS idx_content_requests_created_at ON content_requests(created_at DESC);

-- ============================================
-- TABLE 3: generated_content
-- Stores AI-generated content text
-- ============================================
CREATE TABLE IF NOT EXISTS generated_content (
  id SERIAL PRIMARY KEY,
  content_request_id INTEGER REFERENCES content_requests(id) ON DELETE CASCADE,

  -- Generated Content
  content_text TEXT NOT NULL,

  -- Structured Content (JSON)
  content_structure JSONB,

  -- Metadata
  word_count INTEGER,
  estimated_duration INTEGER,

  -- Timestamps
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_generated_content_request_id ON generated_content(content_request_id);

-- ============================================
-- TABLE 4: vetting_results
-- Stores vetting scores and decisions
-- ============================================
CREATE TABLE IF NOT EXISTS vetting_results (
  id SERIAL PRIMARY KEY,
  generated_content_id INTEGER REFERENCES generated_content(id) ON DELETE CASCADE,

  -- Tier 1: Automatic Disqualification
  instant_fail_triggered BOOLEAN DEFAULT FALSE,
  instant_fail_reason TEXT,

  -- Tier 2: Constitutional Compliance (10 Laws, each 0-10)
  law_1_score INTEGER CHECK (law_1_score >= 0 AND law_1_score <= 10),
  law_2_score INTEGER CHECK (law_2_score >= 0 AND law_2_score <= 10),
  law_3_score INTEGER CHECK (law_3_score >= 0 AND law_3_score <= 10),
  law_4_score INTEGER CHECK (law_4_score >= 0 AND law_4_score <= 10),
  law_5_score INTEGER CHECK (law_5_score >= 0 AND law_5_score <= 10),
  law_6_score INTEGER CHECK (law_6_score >= 0 AND law_6_score <= 10),
  law_7_score INTEGER CHECK (law_7_score >= 0 AND law_7_score <= 10),
  law_8_score INTEGER CHECK (law_8_score >= 0 AND law_8_score <= 10),
  law_9_score INTEGER CHECK (law_9_score >= 0 AND law_9_score <= 10),
  law_10_score INTEGER CHECK (law_10_score >= 0 AND law_10_score <= 10),
  constitutional_score INTEGER CHECK (constitutional_score >= 0 AND constitutional_score <= 100),

  -- Tier 3: Framework Alignment
  paids_score INTEGER CHECK (paids_score >= 0 AND paids_score <= 10),
  seeds_score INTEGER CHECK (seeds_score >= 0 AND seeds_score <= 10),
  four_e_score INTEGER CHECK (four_e_score >= 0 AND four_e_score <= 10),
  framework_integration_score INTEGER CHECK (framework_integration_score >= 0 AND framework_integration_score <= 40),

  -- Tier 4: Brand Voice
  voice_score INTEGER CHECK (voice_score >= 0 AND voice_score <= 20),

  -- Tier 5: Story Integration
  story_score INTEGER CHECK (story_score >= 0 AND story_score <= 10),

  -- Tier 6: Quality Standards
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 20),

  -- Tier 7: Sales Alignment
  sales_score INTEGER CHECK (sales_score >= 0 AND sales_score <= 15),

  -- Overall Score
  total_score INTEGER CHECK (total_score >= 0 AND total_score <= 205),

  -- Decision
  decision VARCHAR(50) NOT NULL CHECK (decision IN ('APPROVED', 'CONDITIONAL', 'REJECTED')),
  approval_level VARCHAR(50) CHECK (approval_level IN ('Exemplary', 'Strong', 'Needs Work', 'Rejected')),

  -- Feedback (JSON for structured data)
  strengths TEXT,
  required_changes TEXT,
  rejection_reasoning TEXT,
  suggestions TEXT,

  -- Timestamps
  vetted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_vetting_results_content_id ON vetting_results(generated_content_id);
CREATE INDEX IF NOT EXISTS idx_vetting_results_decision ON vetting_results(decision);
CREATE INDEX IF NOT EXISTS idx_vetting_results_total_score ON vetting_results(total_score DESC);

-- ============================================
-- TABLE 5: published_content
-- Tracks published content and performance
-- ============================================
CREATE TABLE IF NOT EXISTS published_content (
  id SERIAL PRIMARY KEY,
  generated_content_id INTEGER REFERENCES generated_content(id) ON DELETE CASCADE,
  vetting_result_id INTEGER REFERENCES vetting_results(id) ON DELETE CASCADE,

  -- Publication Details
  published_platform VARCHAR(100),
  published_url TEXT,
  published_at TIMESTAMP,

  -- Performance Tracking
  signals_generated INTEGER DEFAULT 0,
  engagement_count INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue_attributed DECIMAL(10,2) DEFAULT 0,

  -- Review Status
  performance_reviewed BOOLEAN DEFAULT FALSE,
  performance_review_date TIMESTAMP,
  performance_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_published_content_generated_id ON published_content(generated_content_id);
CREATE INDEX IF NOT EXISTS idx_published_content_published_at ON published_content(published_at DESC);

-- ============================================
-- TABLE 6: mastery_tracking
-- Tracks weekly progress and mastery metrics
-- ============================================
CREATE TABLE IF NOT EXISTS mastery_tracking (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,

  -- Weekly Statistics
  total_requests INTEGER DEFAULT 0,
  approved_count INTEGER DEFAULT 0,
  rejected_count INTEGER DEFAULT 0,
  conditional_count INTEGER DEFAULT 0,

  -- Average Scores
  avg_constitutional_score DECIMAL(5,2),
  avg_framework_score DECIMAL(5,2),
  avg_voice_score DECIMAL(5,2),
  avg_total_score DECIMAL(5,2),

  -- Key Metric
  first_pass_approval_rate DECIMAL(5,2),

  -- Week Dates
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Unique constraint: one record per user per week
  UNIQUE(user_id, week_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mastery_tracking_user_id ON mastery_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_mastery_tracking_week_number ON mastery_tracking(week_number DESC);

-- ============================================
-- TABLE 7: constitutional_law
-- Stores all Constitutional Law data
-- ============================================
CREATE TABLE IF NOT EXISTS constitutional_law (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_constitutional_law_category ON constitutional_law(category);
CREATE INDEX IF NOT EXISTS idx_constitutional_law_is_active ON constitutional_law(is_active);

-- ============================================
-- TABLE 8: four_e_balance
-- Tracks 4E content distribution over 30 days
-- ============================================
CREATE TABLE IF NOT EXISTS four_e_balance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  -- Rolling 30-day counts
  entertain_count INTEGER DEFAULT 0,
  educate_count INTEGER DEFAULT 0,
  encourage_count INTEGER DEFAULT 0,
  earn_count INTEGER DEFAULT 0,

  -- Percentages (calculated)
  entertain_percentage DECIMAL(5,2),
  educate_percentage DECIMAL(5,2),
  encourage_percentage DECIMAL(5,2),
  earn_percentage DECIMAL(5,2),

  -- Status
  is_balanced BOOLEAN DEFAULT TRUE,

  -- Date Range
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Unique constraint
  UNIQUE(user_id, start_date, end_date)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_four_e_balance_user_id ON four_e_balance(user_id);
