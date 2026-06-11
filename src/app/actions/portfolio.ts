'use server';

import { z } from 'zod';
import { createAction, updateAction, softDeleteAction } from '@/lib/dal/mutations';
import { revalidatePath } from 'next/cache';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  client_name: z.string().nullable(),
  summary: z.string().nullable(),
  situation: z.string().nullable(),
  objective: z.string().nullable(),
  strategy: z.string().nullable(),
  outcome_label: z.string().nullable(),
  outcome_metric: z.string().nullable(),
  status: z.enum(['draft', 'review', 'published', 'archived']),
  cover_image_url: z.string().nullable(),
  evidence_image_url: z.string().nullable(),
  is_featured_home: z.boolean(),
  is_featured_portfolio: z.boolean(),
  has_full_case_study: z.boolean(),
  display_order: z.number().nullable(),
  move_code: z.number().nullable(),
});

export async function createProject(formData: any) {
  const parsed = projectSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const result = await createAction('projects', parsed.data, { tags: ['projects'] });
  if (result.success) {
    revalidatePath('/admin/portfolio');
    revalidatePath('/admin/dashboard');
  }
  return result;
}

export async function updateProject(id: string, formData: any) {
  const parsed = projectSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const result = await updateAction('projects', id, parsed.data, { tags: ['projects'] });
  if (result.success) {
    revalidatePath('/admin/portfolio');
    revalidatePath('/admin/dashboard');
  }
  return result;
}

export async function deleteProject(id: string) {
  const result = await softDeleteAction('projects', id, { tags: ['projects'] });
  if (result.success) {
    revalidatePath('/admin/portfolio');
    revalidatePath('/admin/dashboard');
  }
  return result;
}
