'use server';

import { restoreAction } from '@/lib/dal/mutations';
import { revalidatePath } from 'next/cache';

export async function restoreEntity(table: string, id: string) {
  const result = await restoreAction(table, id, { tags: [table] });
  if (result.success) {
    revalidatePath('/admin/trash');
    revalidatePath(`/admin/${table === 'projects' ? 'portfolio' : table}`);
    revalidatePath('/admin/dashboard');
  }
  return result;
}
