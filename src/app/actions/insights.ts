'use server';

import { z } from 'zod';
import { createAction, updateAction, softDeleteAction } from '@/lib/dal/mutations';
import { revalidatePath } from 'next/cache';

const insightSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  summary: z.string().nullable(),
  body_content: z.string().nullable(),
  cover_image_url: z.string().nullable(),
  author_id: z.string().nullable(),
  category_id: z.string().nullable(),
  status: z.enum(['draft', 'review', 'published', 'archived']),
  is_featured: z.boolean(),
  read_time_minutes: z.number().nullable(),
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
  locale: z.string().default('en'),
});

export async function createInsight(formData: any) {
  const parsed = insightSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const result = await createAction('insights', parsed.data, { tags: ['insights'] });
  if (result.success) {
    revalidatePath('/admin/insights');
    revalidatePath('/admin/dashboard');
  }
  return result;
}

export async function updateInsight(id: string, formData: any) {
  const parsed = insightSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const result = await updateAction('insights', id, parsed.data, { tags: ['insights'] });
  if (result.success) {
    revalidatePath('/admin/insights');
    revalidatePath('/admin/dashboard');
  }
  return result;
}

export async function deleteInsight(id: string) {
  const result = await softDeleteAction('insights', id, { tags: ['insights'] });
  if (result.success) {
    revalidatePath('/admin/insights');
    revalidatePath('/admin/dashboard');
  }
  return result;
}
