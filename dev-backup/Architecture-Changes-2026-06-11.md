# Architecture Changes
**Date:** 2026-06-11

## 1. Database Schema Additions

During the upgrade phase, several critical tables were introduced into the Supabase schema to support advanced governance and CMS capabilities.

### New Tables
1. **`navigation_items`**: Manages dynamic menus (`header`, `footer`, `legal`, `social`).
2. **`seo_overrides`**: Centralizes metadata for all core pages (Title, Desc, OG Image, Twitter, JSON-LD).
3. **`audit_logs`**: Tracks every CREATE, UPDATE, DELETE, PUBLISH, ARCHIVE action executed in the admin UI.
4. **`content_revisions`**: Stores complete row backups for `projects`, `insights`, and `page_content` prior to any mutation. Enforced with a 50-row cap per entity via DB triggers.
5. **`content_snapshots`**: Stores a serialized JSONB tree of all global configuration (settings, nav, seo, core page content) for point-in-time recovery.
6. **`content_type_registry`**: Registers available dynamic content sections.
7. **`testimonials`**: Stores client quotes for dynamic injection.

### Modified Tables
- **`page_content`**: Added `draft_value_text`, `draft_value_json`, `status`, `reviewed_by`, `published_by`.
- **`projects` / `insights`**: Solidified `status` constraints (`draft`, `review`, `published`, `archived`).

## 2. Server Architecture

### Data Access Layer (DAL) Philosophy
We instituted a strict separation of concerns:
- **`lib/dal/admin.ts`**: Skips Row Level Security (RLS) via the Service Role key to allow administrators unrestricted access to deleted or draft items.
- **`lib/dal/public.ts`**: Strictly uses the standard Supabase client, restricted by RLS to only fetch `status = published` and `is_active = true`.
- **`app/actions/*.ts`**: All server actions now automatically trigger `logAuditEvent()` to trace changes. 

## 3. Sync Limitations
- **GitHub / Vercel API**: The Sync Center uses REST fetching via Vercel and GitHub APIs. If `VERCEL_TOKEN` or `GITHUB_TOKEN` is missing or expires, the UI will degrade gracefully and show an alert. It will not crash the page.
- **Snapshot Size Limits**: Because `content_snapshots` stores a JSON payload of 4 tables, massive global content bloat could theoretically hit Supabase payload limits, though for a standard corporate website, it's highly unlikely.
- **Rollback Safety**: `restoreSnapshot()` will overwrite live configuration. To prevent catastrophic data loss, a hardcoded `auto_pre_restore` snapshot is always triggered immediately before the overwrite executes.
