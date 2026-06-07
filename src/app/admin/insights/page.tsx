import React from 'react';
import { getAdminInsights } from '@/lib/dal/admin';
import { createClient } from '@/lib/supabase/server';
import InsightsClient from './InsightsClient';

export const dynamic = 'force-dynamic';

export default async function InsightsManagerPage() {
  const insights = await getAdminInsights();
  
  const supabase = await createClient();
  const { data: teamMembers } = await supabase.from('team_members').select('id, full_name').order('full_name');
  const { data: categories } = await supabase.from('insight_categories').select('id, label').order('label');

  return (
    <InsightsClient 
      initialInsights={insights as any} 
      teamMembers={teamMembers || []}
      categories={categories || []}
    />
  );
}
