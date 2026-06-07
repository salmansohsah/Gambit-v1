import React from 'react';
import { getAdminTrash } from '@/lib/dal/admin';
import TrashClient from './TrashClient';

export const dynamic = 'force-dynamic';

export default async function TrashManagerPage() {
  const trashItems = await getAdminTrash();

  return (
    <TrashClient initialItems={trashItems as any} />
  );
}
