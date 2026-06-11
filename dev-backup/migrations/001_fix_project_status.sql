-- Migration: Fix project status
-- Ensures the status column only accepts: draft, review, published, archived

-- Attempt to drop any existing constraint (to make this idempotent, though postgres syntax requires IF EXISTS for constraints only in newer versions, or dropping by name)
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Add the new check constraint
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
  CHECK (status IN ('draft', 'review', 'published', 'archived'));

-- Note: This will fail if there are existing rows with invalid statuses.
-- If so, run an UPDATE statement first to map old statuses to these 4 before applying.
