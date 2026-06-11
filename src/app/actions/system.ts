'use server';

import { z } from 'zod';
import { createAction, updateAction, deleteAction } from '@/lib/dal/mutations';
import { revalidatePath, revalidateTag } from 'next/cache';

// ==========================================
// CAPABILITIES
// ==========================================
const capabilitySchema = z.object({
  label: z.string().min(1, 'Label is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().nullable(),
  bullet_points: z.any().nullable(),
  display_order: z.number().nullable(),
  is_active: z.boolean(),
  is_standalone_page: z.boolean(),
});

export async function createCapability(formData: any) {
  const parsed = capabilitySchema.safeParse(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const result = await createAction('capabilities', parsed.data, { tags: ['capabilities'] });
  if (result.success) revalidatePath('/admin/capabilities');
  return result;
}

export async function updateCapability(id: string, formData: any) {
  const parsed = capabilitySchema.safeParse(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const result = await updateAction('capabilities', id, parsed.data, { tags: ['capabilities'] });
  if (result.success) revalidatePath('/admin/capabilities');
  return result;
}

export async function deleteCapability(id: string) {
  const result = await deleteAction('capabilities', id, { tags: ['capabilities'] });
  if (result.success) revalidatePath('/admin/capabilities');
  return result;
}


// ==========================================
// PAGE CONTENT
// ==========================================
const pageContentSchema = z.object({
  value_text: z.string().nullable().optional(),
  value_json: z.any().nullable().optional(),
  draft_value_text: z.string().nullable().optional(),
  draft_value_json: z.any().nullable().optional(),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional(),
});

export async function updatePageContent(id: string, formData: any) {
  const parsed = pageContentSchema.safeParse(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const result = await updateAction('page_content', id, parsed.data, { tags: ['page_content'] });
  if (result.success) {
    revalidatePath('/admin/page-content');
    // Global revalidation of website since content is everywhere
    revalidatePath('/', 'layout');
  }
  return result;
}


// ==========================================
// SITE SETTINGS
// ==========================================
const siteSettingsSchema = z.object({
  site_name: z.string().min(1, 'Site Name is required'),
  tagline: z.string().nullable(),
  contact_email: z.string().email().nullable().or(z.literal('')),
  scheduling_url: z.string().url().nullable().or(z.literal('')),
  nav_cta_label: z.string().nullable(),
  nav_cta_url: z.string().nullable(),
  seo_default_title: z.string().nullable(),
  seo_default_description: z.string().nullable(),
  facebook_url: z.string().url().nullable().or(z.literal('')),
  twitter_url: z.string().url().nullable().or(z.literal('')),
  linkedin_url: z.string().url().nullable().or(z.literal('')),
  instagram_url: z.string().url().nullable().or(z.literal('')),
});

export async function updateSiteSettings(id: number, formData: any) {
  // If id is 0 or null, we assume we're creating the singleton. But usually id=1.
  const parsed = siteSettingsSchema.safeParse(formData);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  
  const result = await updateAction('site_settings', id, parsed.data, { tags: ['site_settings'] });
  if (result.success) {
    revalidatePath('/admin/settings');
    revalidatePath('/', 'layout');
  }
  return result;
}

// ==========================================
// REVISIONS
// ==========================================
export async function restoreRevisionAction(revision_id: string, entity_type: string, entity_id: string) {
  const { restoreRevision } = await import('@/lib/dal/revisions');
  const result = await restoreRevision(revision_id, entity_type, entity_id);
  if (result.success) {
    if (entity_type === 'project') revalidatePath('/admin/portfolio');
    if (entity_type === 'insight') revalidatePath('/admin/insights');
    if (entity_type === 'page_content') revalidatePath('/admin/page-content');
  }
  return result;
}

// ==========================================
// SNAPSHOTS
// ==========================================
export async function createSnapshotAction(label: string) {
  const { createSnapshot } = await import('@/lib/dal/snapshots');
  const result = await createSnapshot(label, 'manual');
  if (result.success) {
    revalidatePath('/admin/sync');
  }
  return result;
}

export async function restoreSnapshotAction(snapshot_id: string) {
  const { restoreSnapshot } = await import('@/lib/dal/snapshots');
  const result = await restoreSnapshot(snapshot_id);
  if (result.success) {
    // The restore triggers global revalidation inside the DAL
    revalidatePath('/admin/sync');
    revalidatePath('/', 'layout');
  }
  return result;
}
