import React from 'react';
import { getAdminSeoOverrides } from '@/lib/dal/seo';
import SeoClient from './SeoClient';

export const metadata = {
  title: 'SEO Manager | GAMBIT Admin',
};

export default async function AdminSeoPage() {
  const overrides = await getAdminSeoOverrides();

  return <SeoClient initialOverrides={overrides} />;
}
