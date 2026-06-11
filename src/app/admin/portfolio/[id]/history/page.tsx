import React from 'react';
import RevisionClient from '@/components/admin/RevisionClient';
import { getRevisions } from '@/lib/dal/revisions';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Project Revision History | Admin',
};

export default async function ProjectHistoryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from('projects')
    .select('title')
    .eq('id', params.id)
    .single();

  if (!project) {
    redirect('/admin/portfolio');
  }

  const revisions = await getRevisions('project', params.id);

  return (
    <RevisionClient 
      revisions={revisions} 
      entityType="project" 
      entityId={params.id} 
      backUrl="/admin/portfolio" 
      title={`Project: ${project.title}`} 
    />
  );
}
