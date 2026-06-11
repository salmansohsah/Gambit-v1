-- Migration: Create audit_logs table
-- Adds a comprehensive audit log for all CMS actions

CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for efficient querying by entity and date
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- RLS Policies
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (Admin) can view the logs
CREATE POLICY "Authenticated users can read audit logs" ON audit_logs
    FOR SELECT TO authenticated USING (true);

-- Only authenticated users can insert logs
CREATE POLICY "Authenticated users can insert audit logs" ON audit_logs
    FOR INSERT TO authenticated WITH CHECK (true);

-- No update/delete policies because audit logs are immutable!
