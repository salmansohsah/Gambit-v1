import React from 'react';
import { getAdminPageContent } from '@/lib/dal/admin';
import PageContentClient from './PageContentClient';

export const dynamic = 'force-dynamic';

export default async function PageContentManagerPage() {
  const content = await getAdminPageContent();

  return (
    <PageContentClient initialContent={content as any} />
  );
}
