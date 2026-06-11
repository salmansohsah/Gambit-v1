import { createClient } from '@/lib/supabase/server';

export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor: string;
  changes: any;
  created_at: string;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data as AuditLog[];
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
}
