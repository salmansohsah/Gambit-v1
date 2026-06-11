-- Migration: Create navigation_items table
-- Allows dynamic CMS control over header, footer, legal, and social menus.

CREATE TABLE navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_type TEXT NOT NULL CHECK (menu_type IN ('header', 'footer', 'legal', 'social')),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_external BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  icon_name TEXT,                    -- for social links (e.g., 'instagram', 'x', 'linkedin')
  target TEXT DEFAULT '_self',       -- '_blank' for external
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access for active items
CREATE POLICY "Public can view active navigation items" 
  ON navigation_items FOR SELECT 
  USING (is_active = true);

-- Policy: Authenticated users (Admins) have full access
CREATE POLICY "Authenticated users can manage navigation items" 
  ON navigation_items FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');
