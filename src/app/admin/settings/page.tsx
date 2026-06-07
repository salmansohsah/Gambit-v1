import React from 'react';
import { getAdminSettings } from '@/lib/dal/admin';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsManagerPage() {
  const settings = await getAdminSettings();

  return (
    <SettingsClient initialSettings={settings as any} />
  );
}
