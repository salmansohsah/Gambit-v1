-- Rollback: Fix project status

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
