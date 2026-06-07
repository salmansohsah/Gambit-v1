import React from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const ADMIN_ROLES = ['admin', 'super_admin'];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Second-layer role check — defense-in-depth beyond the proxy
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    redirect('/admin/login?error=insufficient_permissions');
  }

  return (
    <div className="flex h-screen bg-surface-base">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto bg-surface-base">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
