-- Migration: 004_seo_overrides
-- Description: Create seo_overrides table for page-level SEO management

CREATE TABLE seo_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path VARCHAR(255) NOT NULL UNIQUE, -- e.g., '/', '/about', '/services/strategy'
    
    -- Basic SEO
    title VARCHAR(255),
    description TEXT,
    keywords TEXT,
    
    -- Open Graph (Facebook/LinkedIn)
    og_title VARCHAR(255),
    og_description TEXT,
    og_image VARCHAR(255),
    
    -- Twitter Card
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    twitter_title VARCHAR(255),
    twitter_description TEXT,
    twitter_image VARCHAR(255),
    
    -- Advanced SEO
    canonical_url VARCHAR(255),
    noindex BOOLEAN DEFAULT false,
    nofollow BOOLEAN DEFAULT false,
    structured_data_json JSONB,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast path lookups
CREATE INDEX idx_seo_overrides_page_path ON seo_overrides(page_path);

-- Enable RLS
ALTER TABLE seo_overrides ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function if it doesn't exist (assuming it might already exist from previous tables, but usually we use a standard one. If not, we can create it inline or just let the app handle it. Supabase uses an extension or custom function. Let's create a generic one if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        EXECUTE '
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW.updated_at = timezone(''utc''::text, now());
            RETURN NEW;
        END;
        $func$ language ''plpgsql'';
        ';
    END IF;
END
$$;

-- Add Trigger
CREATE TRIGGER update_seo_overrides_updated_at
    BEFORE UPDATE ON seo_overrides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
