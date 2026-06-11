-- Migration: Content Type Registry
-- Defines available component schemas for dynamic page building

CREATE TABLE IF NOT EXISTS content_type_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id TEXT UNIQUE NOT NULL, -- e.g. 'hero_section', 'rich_text'
  name TEXT NOT NULL,
  description TEXT,
  schema_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed initial types
INSERT INTO content_type_registry (type_id, name, description, schema_json) VALUES
('hero_section', 'Hero Section', 'Standard hero banner with heading, subheading, and CTA', '{"fields": [{"name": "heading", "type": "string"}, {"name": "subheading", "type": "text"}, {"name": "cta_text", "type": "string"}, {"name": "cta_link", "type": "string"}]}'),
('rich_text', 'Rich Text', 'Standard rich text content area', '{"fields": [{"name": "content_html", "type": "richtext"}]}'),
('two_column', 'Two Column Layout', 'Two equal columns of text or mixed media', '{"fields": [{"name": "left_column", "type": "richtext"}, {"name": "right_column", "type": "richtext"}]}'),
('image_gallery', 'Image Gallery', 'Grid of images', '{"fields": [{"name": "images", "type": "array", "items": "image"}]}'),
('cta_banner', 'Call to Action Banner', 'Full width CTA banner', '{"fields": [{"name": "heading", "type": "string"}, {"name": "button_text", "type": "string"}, {"name": "button_link", "type": "string"}]}'),
('faq_accordion', 'FAQ Accordion', 'List of frequently asked questions', '{"fields": [{"name": "faqs", "type": "array", "items": {"question": "string", "answer": "text"}}]}'),
('testimonial_slider', 'Testimonial Slider', 'Carousel of customer quotes', '{"fields": [{"name": "testimonials", "type": "array", "items": "reference"}]}'),
('feature_grid', 'Feature Grid', 'Grid of features with icons', '{"fields": [{"name": "features", "type": "array", "items": {"title": "string", "description": "text", "icon": "string"}}]}'),
('video_embed', 'Video Embed', 'Embedded video player', '{"fields": [{"name": "video_url", "type": "string"}, {"name": "caption", "type": "string"}]}');

ALTER TABLE content_type_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for active types" ON content_type_registry FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access" ON content_type_registry FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
