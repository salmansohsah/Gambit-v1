import { createClient } from '@/lib/supabase/server';

export interface AuditLogEvent {
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'archive' | 'restore';
  changes?: Record<string, any>;
}

/**
 * Fire-and-forget utility to log an audit event to the database.
 * Does not throw errors to prevent interrupting the main transaction.
 */
export async function logAuditEvent(event: AuditLogEvent) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fallback to 'System' if no user is found (e.g., cron jobs, webhooks)
    const actor = user?.user_metadata?.full_name || user?.email || user?.id || 'System';

    // We can insert using the regular client because we have an INSERT policy for authenticated users
    const { error } = await supabase.from('audit_logs').insert({
      entity_type: event.entityType,
      entity_id: event.entityId,
      action: event.action,
      actor: actor,
      changes: event.changes || null,
    });

    if (error) {
      console.error('Failed to insert audit log:', error);
    }
  } catch (error) {
    console.error('Exception while logging audit event:', error);
  }
}
