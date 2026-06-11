-- Rollback: Remove lifecycle columns from page_content

ALTER TABLE page_content 
  DROP COLUMN IF EXISTS draft_value_text,
  DROP COLUMN IF EXISTS draft_value_json,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS reviewed_by,
  DROP COLUMN IF EXISTS reviewed_at,
  DROP COLUMN IF EXISTS published_by,
  DROP COLUMN IF EXISTS published_at;
