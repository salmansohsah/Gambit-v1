'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadMedia(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get('file') as File;
  
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload Error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/media');
  return { success: true, data };
}

export async function deleteMedia(path: string) {
  const supabase = await createClient();
  const { error } = await supabase.storage.from('media').remove([path]);
  
  if (error) {
    console.error('Delete Error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/media');
  return { success: true };
}
