import React from 'react';
import { getAdminCapabilities } from '@/lib/dal/admin';
import CapabilitiesClient from './CapabilitiesClient';

export const dynamic = 'force-dynamic';

export default async function CapabilitiesManagerPage() {
  const capabilities = await getAdminCapabilities();

  return (
    <CapabilitiesClient initialCapabilities={capabilities as any} />
  );
}
