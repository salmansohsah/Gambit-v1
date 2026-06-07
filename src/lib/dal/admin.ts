import { createClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';

// Fetch Dashboard Metrics
export async function getDashboardMetrics() {
  const supabase = await createClient();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // New Leads (7d)
  const { count: newLeadsCount } = await supabase
    .from('discovery_leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'New')
    .gte('submitted_at', sevenDaysAgo.toISOString());

  // Pending Reviews
  const { count: pendingInsights } = await supabase
    .from('insights')
    .select('*', { count: 'exact', head: true })
    .in('status', ['Review', 'Draft']);

  const { count: pendingProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .in('status', ['Review', 'Draft']);

  const pendingReviewsCount = (pendingInsights || 0) + (pendingProjects || 0);

  // Published Moves
  const { count: publishedMovesCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Published');

  return {
    newLeads: newLeadsCount || 0,
    pendingReviews: pendingReviewsCount,
    publishedMoves: publishedMovesCount || 0,
  };
}

// Fetch Active Pipeline
export async function getActivePipeline() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('discovery_leads')
    .select('id, full_name, organization, status, submitted_at')
    .in('status', ['New', 'Reviewed', 'In Conversation'])
    .order('submitted_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching active pipeline:', error);
    return [];
  }

  return data;
}

// Fetch Pending Drafts
export async function getPendingDrafts() {
  const supabase = await createClient();
  
  const { data: insights } = await supabase
    .from('insights')
    .select('id, title, status, author:team_members(full_name)')
    .in('status', ['Review', 'Draft'])
    .limit(3);

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, status, client_name')
    .in('status', ['Review', 'Draft'])
    .limit(3);

  const drafts = [];

  if (insights) {
    drafts.push(...insights.map(i => ({
      id: `insight-${i.id}`,
      type: 'Insight',
      title: i.title,
      author: (i.author as any)?.full_name || 'System',
    })));
  }

  if (projects) {
    drafts.push(...projects.map(p => ({
      id: `project-${p.id}`,
      type: 'Project',
      title: p.title,
      author: p.client_name || 'Unknown Client',
    })));
  }

  return drafts.slice(0, 5);
}

// Fetch All Leads
export async function getLeads() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('discovery_leads')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return data;
}

// Fetch All Projects for Admin
export async function getAdminProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin projects:', error);
    return [];
  }

  return data;
}

// Fetch All Insights for Admin
export async function getAdminInsights() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('insights')
    .select('*, author:team_members(full_name), category:insight_categories(label)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin insights:', error);
    return [];
  }

  return data;
}

// Fetch Capabilities for Admin
export async function getAdminCapabilities() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('capabilities').select('*').order('display_order', { ascending: true });
  if (error) console.error('Error fetching admin capabilities:', error);
  return data || [];
}

// Fetch Page Content for Admin
export async function getAdminPageContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('page_content').select('*, page_content_schema(*)').order('page');
  if (error) console.error('Error fetching admin page content:', error);
  return data || [];
}

// Fetch Site Settings for Admin
export async function getAdminSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('site_settings').select('*').single();
  if (error && error.code !== 'PGRST116') console.error('Error fetching admin settings:', error);
  return data || null;
}

// Fetch Trash (Soft-deleted entities)
export async function getAdminTrash() {
  const supabase = await createClient();
  
  const { data: insights } = await supabase
    .from('insights')
    .select('id, title, deleted_at')
    .not('deleted_at', 'is', null);

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, deleted_at')
    .not('deleted_at', 'is', null);

  const trash = [];

  if (insights) {
    trash.push(...insights.map(i => ({
      id: i.id,
      table: 'insights',
      title: i.title,
      deleted_at: i.deleted_at,
    })));
  }

  if (projects) {
    trash.push(...projects.map(p => ({
      id: p.id,
      table: 'projects',
      title: p.title,
      deleted_at: p.deleted_at,
    })));
  }

  return trash.sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());
}
