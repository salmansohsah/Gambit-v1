-- Rollback: Content Revisions

DROP TRIGGER IF EXISTS trg_cap_content_revisions ON content_revisions;
DROP FUNCTION IF EXISTS cap_content_revisions();
DROP TABLE IF EXISTS content_revisions;
