import React from 'react';
import AuditClient from './AuditClient';
import { getAuditLogs } from '@/lib/dal/audit';
import { Typography } from '@/components/ui/Typography';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Audit Logs | Admin',
};

export default async function AuditPage() {
  const initialLogs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h2" className="mb-2">Audit Logs</Typography>
        <Typography variant="body-sm" className="text-text-secondary">
          Track all changes, updates, and content lifecycles across the platform.
        </Typography>
      </div>

      <AuditClient initialLogs={initialLogs} />
    </div>
  );
}
