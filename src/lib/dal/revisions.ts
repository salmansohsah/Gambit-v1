import { createClient } from '@/lib/supabase/server';
import { updateAction } from './mutations';
import { logAuditEvent } from '../utils/auditLogger';

export interface ContentRevision {
  id: string;
  entity_type: string;
  entity_id: string;
  revision_data: any;
  created_by: string | null;
  created_at: string;
  author_email?: string;
}

export async function createRevision(entity_type: string, entity_id: string, payload: any) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('content_revisions')
      .insert({
        entity_type,
        entity_id,
        revision_data: payload,
        created_by: user?.id || null
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Failed to create content revision:', error);
    return { success: false, error };
  }
}

export async function getRevisions(entity_type: string, entity_id: string): Promise<ContentRevision[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('content_revisions')
      .select(`
        *,
        author:created_by (
          email
        )
      `)
      .eq('entity_type', entity_type)
      .eq('entity_id', entity_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map((row: any) => ({
      ...row,
      author_email: row.author?.email || 'System'
    })) as ContentRevision[];
  } catch (error) {
    console.error('Failed to fetch revisions:', error);
    return [];
  }
}

export async function restoreRevision(revision_id: string, entity_type: string, entity_id: string) {
  try {
    const supabase = await createClient();
    
    // 1. Get the revision data
    const { data: revision, error: fetchError } = await supabase
      .from('content_revisions')
      .select('revision_data')
      .eq('id', revision_id)
      .single();
      
    if (fetchError || !revision) throw fetchError || new Error('Revision not found');

    // 2. We use updateAction to restore it so it goes through the proper audit logging
    const targetTable = entity_type === 'project' ? 'projects' 
                      : entity_type === 'insight' ? 'insights' 
                      : entity_type === 'page_content' ? 'page_content' 
                      : entity_type;
                      
    const result = await updateAction(targetTable, entity_id, revision.revision_data, {
      tags: [targetTable]
    });

    if (!result.success) throw new Error(result.error);

    // 3. Log the specific restore action in audit logs (even though updateAction logs an 'update', 
    // we want a specific 'restore' marker pointing to the revision)
    await logAuditEvent({
      action: 'restore',
      entity_type,
      entity_id,
      changes: { restored_from_revision: revision_id }
    });

    return { success: true };
  } catch (error: any) {
    console.error('Failed to restore revision:', error);
    return { success: false, error: error.message };
  }
}
