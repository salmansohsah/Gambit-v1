# Admin CMS Guide
**Date:** 2026-06-11

This guide covers the day-to-day operations of the GAMBIT Platform Command Center.

## 1. Page Content
**Path:** `/admin/page-content`
- Used for editing static copy blocks across the site (e.g., Homepage Hero Headline, About Mission statement).
- **Drafts vs Published**: You can save changes as a Draft. Drafts will NOT appear on the public site until you explicitly click "Publish Changes".

## 2. Navigation
**Path:** `/admin/navigation`
- Controls Header, Footer, Legal, and Social menus.
- Supports drag-and-drop ordering.
- Toggle links Active/Inactive to temporarily hide them without deleting.
- **Fallback**: If all items are deleted, the public site falls back to hardcoded defaults to prevent a broken user experience.

## 3. SEO Manager
**Path:** `/admin/seo`
- Manage Metadata, Open Graph, and Structured JSON-LD per page.
- Note: This only applies to core pages (`/`, `/about`, `/services`, etc). Dynamic content like `/insights/[slug]` generate their own SEO dynamically based on the insight's specific DB row.

## 4. Testimonials
**Path:** `/admin/testimonials`
- Manage client quotes.
- Note: Testimonials are currently stored in the DB but deferred from rendering on the public site until the design team approves the UI block. 

## 5. Insights & Portfolio
- **Lifecycle**: Items begin as `draft`. They can be sent to `review`, and then `published`.
- **History**: Clicking the "History" button on an entity will show you up to 50 previous versions of that document. You can instantly restore an old version.

## 6. Audit Log
**Path:** `/admin/audit`
- See a reverse-chronological list of every action taken by every Admin.
- If content mysteriously changes, check the Audit Log to see who changed it and when.
