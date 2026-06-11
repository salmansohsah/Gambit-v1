-- Rollback: Fix insight status

ALTER TABLE insights DROP CONSTRAINT IF EXISTS insights_status_check;
