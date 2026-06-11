-- Migration: Add lifecycle columns to page_content
-- Enables drafting and review workflows for static page content

ALTER TABLE page_content 
  ADD COLUMN draft_value_text TEXT,
  ADD COLUMN draft_value_json JSONB,
  ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  ADD COLUMN reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
