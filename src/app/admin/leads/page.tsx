import React from 'react';
import { getLeads } from '@/lib/dal/admin';
import LeadsClient from './LeadsClient';

export const dynamic = 'force-dynamic';

export default async function LeadsManagerPage() {
  const leads = await getLeads();

  return (
    <LeadsClient initialLeads={leads as any} />
  );
}
