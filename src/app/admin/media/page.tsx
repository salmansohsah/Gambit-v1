import React from 'react';
import { createClient } from '@/lib/supabase/server';
import MediaLibraryClient from './MediaLibraryClient';

export const dynamic = 'force-dynamic';

export default async function MediaManagerPage() {
  const supabase = await createClient();
  const { data: files, error } = await supabase.storage.from('media').list();

  if (error) {
    console.error('Error fetching media list:', error);
  }

  // Get public URLs for each file
  const enrichedFiles = (files || []).map(f => {
    const { data } = supabase.storage.from('media').getPublicUrl(f.name);
    return {
      name: f.name,
      id: f.id,
      created_at: f.created_at,
      metadata: f.metadata,
      publicUrl: data.publicUrl
    };
  }).filter(f => f.name !== '.emptyFolderPlaceholder');

  return (
    <MediaLibraryClient initialFiles={enrichedFiles} />
  );
}
