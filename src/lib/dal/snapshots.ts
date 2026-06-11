import { createClient } from '@/lib/supabase/server';
import { logAuditEvent } from '../utils/auditLogger';
import { revalidateTag } from 'next/cache';

export interface ContentSnapshot {
  id: string;
  label: string;
  snapshot_type: 'manual' | 'auto_pre_restore' | 'auto_pre_publish';
  snapshot_data: {
    page_content: any[];
    site_settings: any[];
    navigation_items: any[];
    seo_overrides: any[];
  };
  created_by: string | null;
  created_at: string;
  author_email?: string;
}

export async function createSnapshot(label: string, snapshot_type: 'manual' | 'auto_pre_restore' | 'auto_pre_publish') {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch the 4 core global configuration tables
    const [pageContent, siteSettings, navigationItems, seoOverrides] = await Promise.all([
      supabase.from('page_content').select('*'),
      supabase.from('site_settings').select('*'),
      supabase.from('navigation_items').select('*'),
      supabase.from('seo_overrides').select('*')
    ]);

    const snapshotData = {
      page_content: pageContent.data || [],
      site_settings: siteSettings.data || [],
      navigation_items: navigationItems.data || [],
      seo_overrides: seoOverrides.data || []
    };

    const { data, error } = await supabase
      .from('content_snapshots')
      .insert({
        label,
        snapshot_type,
        snapshot_data: snapshotData,
        created_by: user?.id || null
      })
      .select()
      .single();

    if (error) throw error;

    await logAuditEvent({
      action: 'create',
      entity_type: 'snapshot',
      entity_id: data.id,
      changes: { label, snapshot_type }
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to create snapshot:', error);
    return { success: false, error: error.message };
  }
}

export async function getSnapshots(): Promise<ContentSnapshot[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('content_snapshots')
      .select(`
        *,
        author:created_by (
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map((row: any) => ({
      ...row,
      author_email: row.author?.email || 'System'
    })) as ContentSnapshot[];
  } catch (error) {
    console.error('Failed to fetch snapshots:', error);
    return [];
  }
}

export async function restoreSnapshot(snapshot_id: string) {
  try {
    const supabase = await createClient();
    
    // 1. Get the snapshot data
    const { data: snapshot, error: fetchError } = await supabase
      .from('content_snapshots')
      .select('*')
      .eq('id', snapshot_id)
      .single();
      
    if (fetchError || !snapshot) throw fetchError || new Error('Snapshot not found');

    const data = snapshot.snapshot_data;

    // 2. Auto-create a pre-restore snapshot as a safety net
    await createSnapshot(`Auto-backup before restoring snapshot ${snapshot.label || snapshot_id}`, 'auto_pre_restore');

    // 3. Perform the restores
    // For navigation_items and seo_overrides, we delete all and re-insert to handle removed items cleanly
    await supabase.from('navigation_items').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
    if (data.navigation_items?.length) {
      await supabase.from('navigation_items').insert(data.navigation_items);
    }

    await supabase.from('seo_overrides').delete().neq('page_identifier', 'nothing'); // delete all
    if (data.seo_overrides?.length) {
      await supabase.from('seo_overrides').insert(data.seo_overrides);
    }

    // For site_settings and page_content, we upsert based on ID
    if (data.site_settings?.length) {
      await supabase.from('site_settings').upsert(data.site_settings);
    }
    
    if (data.page_content?.length) {
      await supabase.from('page_content').upsert(data.page_content);
    }

    // 4. Invalidate caches
    revalidateTag('site_settings');
    revalidateTag('navigation');
    revalidateTag('seo_overrides');
    revalidateTag('page_content');

    // 5. Log the restore action
    await logAuditEvent({
      action: 'restore',
      entity_type: 'snapshot',
      entity_id: snapshot_id,
      changes: { snapshot_label: snapshot.label }
    });

    return { success: true };
  } catch (error: any) {
    console.error('Failed to restore snapshot:', error);
    return { success: false, error: error.message };
  }
}
