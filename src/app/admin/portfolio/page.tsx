import React from 'react';
import { getAdminProjects } from '@/lib/dal/admin';
import PortfolioClient from './PortfolioClient';

export const dynamic = 'force-dynamic';

export default async function PortfolioManagerPage() {
  const projects = await getAdminProjects();

  return (
    <PortfolioClient initialProjects={projects as any} />
  );
}
