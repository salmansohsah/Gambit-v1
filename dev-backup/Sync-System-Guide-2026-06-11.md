# Sync System & Snapshots Guide
**Date:** 2026-06-11

## What is a Snapshot?
A Snapshot is a complete point-in-time backup of your site's global configuration. It bundles:
- `site_settings`
- `navigation_items`
- `seo_overrides`
- `page_content`

It does NOT bundle individual dynamic entities like Projects, Insights, or Leads.

## When to use Snapshots
1. **Before major site changes**: If you are completely rewriting the homepage or restructuring navigation, take a Manual Snapshot.
2. **Transferring configuration**: You can click "Export" to download a JSON file of your site's configuration. This is incredibly useful for transferring settings between a Staging and Production database.

## Restoring a Snapshot
Restoring a snapshot overwrites the live database. 
**Safety mechanism**: Whenever you click "Restore", the system automatically creates a hidden `auto_pre_restore` snapshot containing your exact current state. If the restore breaks your site, you can immediately restore the auto-snapshot to undo the damage.

## Connecting Vercel & GitHub APIs
To make the `/admin/sync` dashboard light up with live deployment data:
1. Generate a GitHub Personal Access Token (classic) with `repo` read access.
2. Add to `.env.local`: `GITHUB_TOKEN=your_token` and `GITHUB_REPO=your_org/your_repo`.
3. Generate a Vercel Token from Account Settings.
4. Add to `.env.local`: `VERCEL_TOKEN=your_token` and `VERCEL_PROJECT_ID=your_project_id`.
