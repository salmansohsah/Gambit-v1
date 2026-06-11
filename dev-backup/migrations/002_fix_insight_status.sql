-- Migration: Fix insight status
-- Ensures the status column only accepts: draft, review, published, archived

ALTER TABLE insights DROP CONSTRAINT IF EXISTS insights_status_check;

-- Add the new check constraint
ALTER TABLE insights ADD CONSTRAINT insights_status_check 
  CHECK (status IN ('draft', 'review', 'published', 'archived'));

-- Note: This will fail if there are existing rows with invalid statuses.
