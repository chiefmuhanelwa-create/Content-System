-- ============================================
-- NOCHILL BUSINESS OS - DATABASE SCHEMA
-- Version 1.0
-- For children's children
-- ============================================

-- ============================================
-- BUSINESS OS TABLES
-- ============================================

-- ============================================
-- TABLE: revenue_entries
-- Tracks all revenue across PAIDS streams
-- ============================================
CREATE TABLE IF NOT EXISTS revenue_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  -- Revenue Details
  date DATE NOT NULL,
  stream VARCHAR(50) NOT NULL CHECK (stream IN ('Products', 'Ads', 'Information', 'Deals', 'Services')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  receipt_url TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_revenue_entries_user_id ON revenue_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_entries_date ON revenue_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_entries_stream ON revenue_entries(stream);

-- ============================================
-- TABLE: sprint_tasks
-- 90-Day Sprint Tracker (12 weeks)
-- ============================================
CREATE TABLE IF NOT EXISTS sprint_tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  -- Task Details
  week INTEGER NOT NULL CHECK (week >= 1 AND week <= 12),
  task_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  notes TEXT,

  -- Metadata
  is_custom BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sprint_tasks_user_id ON sprint_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_week ON sprint_tasks(week);
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_completed ON sprint_tasks(completed);

-- ============================================
-- TABLE: products
-- Product Roadmap & Product Management
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  -- Product Details
  name TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Course', 'Book', 'Micro-Product', 'Membership', 'Coaching', 'Workshop', 'Template', 'Community')),
  price DECIMAL(10,2) NOT NULL,
  description TEXT,

  -- Status & Lifecycle
  status VARCHAR(50) NOT NULL DEFAULT 'idea' CHECK (status IN ('Idea', 'Planning', 'Production', 'Launched', 'Evergreen')),
  launch_date DATE,

  -- Revenue Tracking
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  units_sold INTEGER DEFAULT 0,

  -- Metadata
  sort_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);

-- ============================================
-- TABLE: content_items
-- Content Calendar with 4E Framework
-- ============================================
CREATE TABLE IF NOT EXISTS content_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  -- Content Details
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('Instagram', 'TikTok', 'YouTube', 'Email', 'LinkedIn', 'Twitter', 'Facebook', 'Blog')),
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('Reel', 'Carousel', 'Video', 'Story', 'Email', 'Post', 'Thread', 'Article')),
  four_e_category VARCHAR(50) NOT NULL CHECK (four_e_category IN ('Entertain', 'Educate', 'Encourage', 'Earn')),

  -- Content Info
  title TEXT NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'idea' CHECK (status IN ('Idea', 'Scripted', 'Filmed', 'Edited', 'Scheduled', 'Published')),

  -- Publishing
  publish_date TIMESTAMP,
  published_url TEXT,

  -- Performance
  views INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  performance_notes TEXT,

  -- Repurposing
  parent_content_id INTEGER REFERENCES content_items(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON content_items(user_id);
CREATE INDEX IF NOT EXISTS idx_content_items_publish_date ON content_items(publish_date);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_four_e ON content_items(four_e_category);

-- ============================================
-- TABLE: students
-- Student Pipeline & CRM
-- ============================================
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  -- Student Details
  name TEXT NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),

  -- Pipeline Stage
  stage VARCHAR(50) NOT NULL DEFAULT 'Lead' CHECK (stage IN ('Lead', 'Subscriber', 'Customer', 'Graduate', 'Affiliate', 'Champion')),

  -- Purchase History
  product_purchased TEXT,
  revenue_contributed DECIMAL(10,2) DEFAULT 0,

  -- Tags & Flags
  tags TEXT[],
  is_at_risk BOOLEAN DEFAULT FALSE,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_interaction TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_stage ON students(stage);

-- ============================================
-- TABLE: faith_entries
-- Faith Integration: Tithing, Prayer, Kingdom KPIs
-- ============================================
CREATE TABLE IF NOT EXISTS faith_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  -- Entry Type
  entry_type VARCHAR(50) NOT NULL CHECK (entry_type IN ('Prayer', 'Giving', 'Testimony', 'Scripture', 'Kingdom-KPI')),

  -- Entry Details
  date DATE NOT NULL,
  amount DECIMAL(10,2),
  content TEXT,
  scripture_reference VARCHAR(255),

  -- Prayer Specific
  prayer_status VARCHAR(50) CHECK (prayer_status IN ('Praying', 'Answered', 'Redirected')),

  -- KPI Specific
  kpi_type VARCHAR(100),
  kpi_count INTEGER,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_faith_entries_user_id ON faith_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_faith_entries_type ON faith_entries(entry_type);
CREATE INDEX IF NOT EXISTS idx_faith_entries_date ON faith_entries(date DESC);

-- ============================================
-- TABLE: risks
-- Risk Mitigation Tracker
-- ============================================
CREATE TABLE IF NOT EXISTS risks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  -- Risk Details
  risk_name TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Financial', 'Operational', 'Market', 'Platform', 'Legal', 'Health', 'Reputation')),

  -- Assessment
  likelihood VARCHAR(50) NOT NULL CHECK (likelihood IN ('Low', 'Medium', 'High')),
  impact VARCHAR(50) NOT NULL CHECK (impact IN ('Low', 'Medium', 'High', 'Critical')),

  -- Mitigation
  mitigation_plan TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Monitoring' CHECK (status IN ('Monitoring', 'Active', 'Mitigated', 'Occurred')),

  -- Tracking
  last_reviewed DATE,
  review_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_risks_user_id ON risks(user_id);
CREATE INDEX IF NOT EXISTS idx_risks_status ON risks(status);
CREATE INDEX IF NOT EXISTS idx_risks_category ON risks(category);

-- ============================================
-- TABLE: decision_logs
-- Decision Framework Logs
-- ============================================
CREATE TABLE IF NOT EXISTS decision_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  -- Decision Details
  decision_type VARCHAR(50) NOT NULL CHECK (decision_type IN ('Opportunity', 'Pricing', 'Time-Allocation', 'Strategic')),
  opportunity_name TEXT,

  -- Opportunity Filter
  mission_aligned BOOLEAN,
  time_required INTEGER,
  expected_return DECIMAL(10,2),
  roi_percentage DECIMAL(5,2),
  peace_check BOOLEAN,

  -- Decision
  decision VARCHAR(50) CHECK (decision IN ('Proceed', 'Decline', 'Defer')),
  reasoning TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_decision_logs_user_id ON decision_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_decision_logs_type ON decision_logs(decision_type);

-- ============================================
-- TABLE: business_settings
-- Business configuration and preferences
-- ============================================
CREATE TABLE IF NOT EXISTS business_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  -- Business Info
  business_name VARCHAR(255) DEFAULT 'NOCHILL PTY LTD',
  financial_year_start DATE,
  currency VARCHAR(10) DEFAULT 'ZAR',

  -- Targets
  monthly_revenue_target DECIMAL(10,2),
  quarterly_revenue_target DECIMAL(10,2),
  annual_revenue_target DECIMAL(10,2),

  -- Preferences
  sabbath_mode_enabled BOOLEAN DEFAULT FALSE,
  sabbath_day VARCHAR(20) DEFAULT 'Sunday',
  dark_mode BOOLEAN DEFAULT FALSE,

  -- Sprint Settings
  current_sprint_start_date DATE,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- One setting per user
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_business_settings_user_id ON business_settings(user_id);

-- ============================================
-- SEED DATA: Pre-populate sprint tasks
-- ============================================

-- Note: This will be populated via API on first user creation
-- Week 1-12 tasks based on the NOCHILL blueprint
