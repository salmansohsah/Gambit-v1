-- Migration: Content Revisions
-- Enables version control for insights, portfolio items, and page content

CREATE TABLE IF NOT EXISTS content_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('insight', 'project', 'page_content')),
  entity_id UUID NOT NULL,
  revision_data JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for quick fetching
CREATE INDEX idx_content_revisions_entity ON content_revisions(entity_type, entity_id);
CREATE INDEX idx_content_revisions_created_at ON content_revisions(created_at DESC);

-- Trigger to cap at 50 revisions per entity
CREATE OR REPLACE FUNCTION cap_content_revisions()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM content_revisions
  WHERE id IN (
    SELECT id
    FROM content_revisions
    WHERE entity_type = NEW.entity_type AND entity_id = NEW.entity_id
    ORDER BY created_at DESC
    OFFSET 50
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cap_content_revisions
AFTER INSERT ON content_revisions
FOR EACH ROW
EXECUTE FUNCTION cap_content_revisions();

-- Enable RLS
ALTER TABLE content_revisions ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage content revisions" ON content_revisions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin', 'super_admin')
    )
  );
