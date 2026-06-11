import React from 'react';
import SyncClient from './SyncClient';
import { getSnapshots } from '@/lib/dal/snapshots';
import { getLatestCommit } from '@/lib/utils/githubApi';
import { getLatestDeployment } from '@/lib/utils/vercelApi';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sync Center | Admin',
};

export default async function SyncPage() {
  const [snapshots, github, vercel] = await Promise.all([
    getSnapshots(),
    getLatestCommit(),
    getLatestDeployment()
  ]);

  return (
    <SyncClient 
      snapshots={snapshots} 
      github={github} 
      vercel={vercel} 
    />
  );
}
