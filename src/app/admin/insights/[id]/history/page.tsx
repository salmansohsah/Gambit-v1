import React from 'react';
import RevisionClient from '@/components/admin/RevisionClient';
import { getRevisions } from '@/lib/dal/revisions';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Insight Revision History | Admin',
};

export default async function InsightHistoryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: insight } = await supabase
    .from('insights')
    .select('title')
    .eq('id', params.id)
    .single();

  if (!insight) {
    redirect('/admin/insights');
  }

  const revisions = await getRevisions('insight', params.id);

  return (
    <RevisionClient 
      revisions={revisions} 
      entityType="insight" 
      entityId={params.id} 
      backUrl="/admin/insights" 
      title={`Insight: ${insight.title}`} 
    />
  );
}
