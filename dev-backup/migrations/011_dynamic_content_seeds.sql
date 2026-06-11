-- Migration: Dynamic Content Architecture Seeds
-- Adds schemas for missing sections across all pages

INSERT INTO page_content_schema (id, page, section, key, label, input_type, default_value, is_active) 
SELECT gen_random_uuid(), page, section, key, label, input_type, default_value, is_active
FROM (VALUES 
  ('home', 'what_we_do', 'headline', 'What We Do Headline', 'text', 'Our Capabilities', true),
  ('home', 'recent_moves', 'headline', 'Recent Moves Headline', 'text', 'Recent Moves', true),
  ('home', 'process', 'headline', 'Process Headline', 'text', 'Our Process', true),
  ('home', 'process', 'body', 'Process Body', 'richtext', 'How we execute.', true),
  ('home', 'initiative', 'headline', 'Initiative Headline', 'text', 'Take the Initiative', true),
  ('home', 'initiative', 'body', 'Initiative Body', 'textarea', 'Partner with us.', true),
  ('home', 'initiative', 'cta_text', 'Initiative CTA Text', 'text', 'Start Project', true),
  
  ('about', 'mission', 'headline', 'Mission Headline', 'text', 'Our Mission', true),
  ('about', 'mission', 'body', 'Mission Body', 'richtext', 'Why we exist.', true),
  ('about', 'team', 'headline', 'Team Headline', 'text', 'Our Team', true),
  
  ('services', 'offerings', 'headline', 'Offerings Headline', 'text', 'What we offer', true),
  ('services', 'faq', 'headline', 'FAQ Headline', 'text', 'Frequently Asked Questions', true),
  
  ('portfolio', 'gallery', 'headline', 'Gallery Headline', 'text', 'Selected Works', true),
  
  ('contact', 'info', 'headline', 'Contact Info Headline', 'text', 'Get in Touch', true),
  ('contact', 'info', 'body', 'Contact Info Body', 'richtext', 'Reach out to our team.', true)
) AS t(page, section, key, label, input_type, default_value, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM page_content_schema s 
  WHERE s.page = t.page AND s.section = t.section AND s.key = t.key
);

-- Seed corresponding page_content rows so they show up in the Admin UI immediately
INSERT INTO page_content (id, page_content_schema_id, page, section, key, value_text, status)
SELECT 
  gen_random_uuid(),
  s.id,
  s.page,
  s.section,
  s.key,
  s.default_value,
  'published'
FROM page_content_schema s
WHERE NOT EXISTS (
  SELECT 1 FROM page_content p
  WHERE p.page_content_schema_id = s.id
);
