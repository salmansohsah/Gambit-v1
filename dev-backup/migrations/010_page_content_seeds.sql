-- Migration: Content Seeds
-- Seeds the page_content_schema and ensures page_content records exist

-- Clear existing schemas
DELETE FROM page_content_schema;

-- Insert core pages
INSERT INTO page_content_schema (page_identifier, section_id, section_name, content_type_id, display_order) VALUES
('home', 'hero', 'Hero Section', 'hero_section', 10),
('home', 'what_we_do', 'What We Do', 'feature_grid', 20),
('home', 'reality', 'Reality Section', 'two_column', 30),
('home', 'recent_moves', 'Recent Moves', 'rich_text', 40),
('home', 'process', 'Our Process', 'rich_text', 50),
('home', 'initiative', 'The Initiative', 'cta_banner', 60),

('about', 'hero', 'Hero Section', 'hero_section', 10),
('about', 'mission', 'Our Mission', 'rich_text', 20),
('about', 'team', 'Team Roster', 'image_gallery', 30),

('services', 'hero', 'Hero Section', 'hero_section', 10),
('services', 'offerings', 'Service Offerings', 'feature_grid', 20),
('services', 'faq', 'Frequently Asked Questions', 'faq_accordion', 30),

('portfolio', 'hero', 'Hero Section', 'hero_section', 10),
('portfolio', 'gallery', 'Project Gallery', 'image_gallery', 20),

('insights', 'hero', 'Hero Section', 'hero_section', 10),

('contact', 'hero', 'Hero Section', 'hero_section', 10),
('contact', 'info', 'Contact Info', 'two_column', 20);

-- Make sure page_content rows exist for these identifiers
INSERT INTO page_content (page_identifier, value_json, draft_value_json, status)
VALUES
('home', '{}'::jsonb, '{}'::jsonb, 'published'),
('about', '{}'::jsonb, '{}'::jsonb, 'published'),
('services', '{}'::jsonb, '{}'::jsonb, 'published'),
('portfolio', '{}'::jsonb, '{}'::jsonb, 'published'),
('insights', '{}'::jsonb, '{}'::jsonb, 'published'),
('contact', '{}'::jsonb, '{}'::jsonb, 'published')
ON CONFLICT (page_identifier) DO NOTHING;
