import { publicSupabase } from '@/lib/supabase/client-public'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

export type MenuType = 'header' | 'footer' | 'legal' | 'social';

export interface NavigationItem {
  id: string;
  menu_type: MenuType;
  label: string;
  href: string;
  display_order: number;
  is_external: boolean;
  is_active: boolean;
  icon_name: string | null;
  target: string | null;
  created_at: string;
  updated_at: string;
}

// ------------------------------------------------------------------
// CACHED QUERIES (Production)
// ------------------------------------------------------------------

const getNavigationCached = unstable_cache(
  async (menuType: MenuType) => {
    const { data, error } = await publicSupabase
      .from('navigation_items')
      .select('*')
      .eq('menu_type', menuType)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data as NavigationItem[]
  },
  ['navigation_items'],
  { tags: ['navigation'] }
)

// ------------------------------------------------------------------
// DRAFT QUERIES (Bypasses Cache)
// ------------------------------------------------------------------

async function getNavigationDraft(menuType: MenuType) {
  const { data, error } = await publicSupabase
    .from('navigation_items')
    .select('*')
    .eq('menu_type', menuType)
    .order('display_order', { ascending: true })
  if (error) throw error
  return data as NavigationItem[]
}

// ------------------------------------------------------------------
// EXPORTED API
// ------------------------------------------------------------------

export async function getNavigation(menuType: MenuType): Promise<NavigationItem[]> {
  let isEnabled = false;
  try {
    const draft = await draftMode();
    isEnabled = draft.isEnabled;
  } catch (e) {
    // Fails in generateStaticParams during build
  }
  
  try {
    return isEnabled ? await getNavigationDraft(menuType) : await getNavigationCached(menuType)
  } catch (error) {
    console.error(`Failed to fetch ${menuType} navigation:`, error)
    return []
  }
}

// ------------------------------------------------------------------
// ADMIN QUERIES (Bypasses RLS)
// ------------------------------------------------------------------

import { createAdminClient } from '@/lib/supabase/server'

export async function getAdminNavigation(menuType?: MenuType) {
  const adminSupabase = createAdminClient()
  let query = adminSupabase.from('navigation_items').select('*').order('menu_type').order('display_order');
  if (menuType) {
    query = query.eq('menu_type', menuType);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as NavigationItem[];
}

export async function upsertNavItem(item: Partial<NavigationItem>) {
  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('navigation_items')
    .upsert(item)
    .select()
    .single();
  if (error) throw error;
  return data as NavigationItem;
}

export async function deleteNavItem(id: string) {
  const adminSupabase = createAdminClient()
  const { error } = await adminSupabase
    .from('navigation_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
