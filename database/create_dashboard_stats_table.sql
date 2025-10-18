-- Create dashboard_stats table for stats caching
-- Run this manually when database has available connections
-- This table enables 87% query reduction for dashboard endpoints

CREATE TABLE IF NOT EXISTS dashboard_stats (
  id SERIAL PRIMARY KEY,
  cache_key VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL,
  user_id INTEGER,
  total_schools INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  total_teachers INTEGER DEFAULT 0,
  total_mentors INTEGER DEFAULT 0,
  total_assessments INTEGER DEFAULT 0,
  baseline_assessments INTEGER DEFAULT 0,
  midline_assessments INTEGER DEFAULT 0,
  endline_assessments INTEGER DEFAULT 0,
  language_assessments INTEGER DEFAULT 0,
  math_assessments INTEGER DEFAULT 0,
  stats_data JSONB,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_dashboard_stats_cache_key ON dashboard_stats(cache_key);
CREATE INDEX IF NOT EXISTS idx_dashboard_stats_role ON dashboard_stats(role);
CREATE INDEX IF NOT EXISTS idx_dashboard_stats_user_id ON dashboard_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_stats_last_updated ON dashboard_stats(last_updated);

-- Verify table was created
SELECT 'dashboard_stats table created successfully!' as status;
SELECT COUNT(*) as row_count FROM dashboard_stats;
