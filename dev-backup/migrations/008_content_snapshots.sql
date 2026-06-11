-- Migration: Content Snapshots
-- Enables global system snapshots of dynamic content (page_content, settings, nav, seo)

CREATE TABLE IF NOT EXISTS content_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  snapshot_type TEXT NOT NULL CHECK (snapshot_type IN ('manual', 'auto_pre_restore', 'auto_pre_publish')),
  snapshot_data JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for chronological fetching
CREATE INDEX idx_content_snapshots_created_at ON content_snapshots(created_at DESC);

-- Enable RLS
ALTER TABLE content_snapshots ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage snapshots" ON content_snapshots
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin', 'super_admin')
    )
  );
