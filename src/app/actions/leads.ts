'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateLeadStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('discovery_leads')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating lead status:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/leads');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function updateLeadNotes(id: string, notes: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('discovery_leads')
    .update({ notes })
    .eq('id', id);

  if (error) {
    console.error('Error updating lead notes:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/leads');
  revalidatePath('/admin/dashboard');
  return { success: true };
}
