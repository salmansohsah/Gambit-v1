import { publicSupabase } from '@/lib/supabase/client-public'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

// ------------------------------------------------------------------
// CACHED QUERIES (Production)
// ------------------------------------------------------------------

export const getPublishedProjects = unstable_cache(
  async () => {
    const { data, error } = await publicSupabase
      .from('projects')
      .select(`*, project_capabilities(capabilities(*))`)
      .eq('status', 'published')
      .order('display_order', { ascending: true })
    if (error) throw error
    return data
  },
  ['projects_published'],
  { tags: ['projects'] }
)

const getFeaturedProjectsCached = unstable_cache(
  async (location: 'home' | 'portfolio') => {
    const featureColumn = location === 'home' ? 'is_featured_home' : 'is_featured_portfolio'
    const { data, error } = await publicSupabase
      .from('projects')
      .select(`*, project_capabilities(capabilities(*))`)
      .eq('status', 'published')
      .eq(featureColumn, true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data
  },
  ['featured_projects_published'],
  { tags: ['projects'] }
)

const getProjectBySlugCached = unstable_cache(
  async (slug: string) => {
    const { data, error } = await publicSupabase
      .from('projects')
      .select(`*, project_capabilities(capabilities(*))`)
      .eq('status', 'published')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data
  },
  ['project_by_slug_published'],
  { tags: ['projects'] }
)

// ------------------------------------------------------------------
// DRAFT QUERIES (Bypasses 'status' check and Next.js Cache)
// ------------------------------------------------------------------

async function getProjectsDraft() {
  const { data, error } = await publicSupabase
    .from('projects')
    .select(`*, project_capabilities(capabilities(*))`)
    .order('display_order', { ascending: true })
  if (error) throw error
  return data
}

async function getFeaturedProjectsDraft(location: 'home' | 'portfolio') {
  const featureColumn = location === 'home' ? 'is_featured_home' : 'is_featured_portfolio'
  const { data, error } = await publicSupabase
    .from('projects')
    .select(`*, project_capabilities(capabilities(*))`)
    .eq(featureColumn, true)
    .order('display_order', { ascending: true })
  if (error) throw error
  return data
}

async function getProjectBySlugDraft(slug: string) {
  const { data, error } = await publicSupabase
    .from('projects')
    .select(`*, project_capabilities(capabilities(*))`)
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

// ------------------------------------------------------------------
// EXPORTED API
// ------------------------------------------------------------------

export async function getProjects() {
  let isEnabled = false;
  try {
    const draft = await draftMode();
    isEnabled = draft.isEnabled;
  } catch (e) {
    // Fails in generateStaticParams during build
  }
  
  try {
    return isEnabled ? await getProjectsDraft() : await getPublishedProjects()
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }
}

export async function getFeaturedProjects(location: 'home' | 'portfolio') {
  let isEnabled = false;
  try {
    const draft = await draftMode();
    isEnabled = draft.isEnabled;
  } catch (e) {}

  try {
    return isEnabled ? await getFeaturedProjectsDraft(location) : await getFeaturedProjectsCached(location)
  } catch (error) {
    console.error(`Failed to fetch featured projects for ${location}:`, error)
    return []
  }
}

export async function getProjectBySlug(slug: string) {
  let isEnabled = false;
  try {
    const draft = await draftMode();
    isEnabled = draft.isEnabled;
  } catch (e) {}

  try {
    return isEnabled ? await getProjectBySlugDraft(slug) : await getProjectBySlugCached(slug)
  } catch (error) {
    console.error(`Failed to fetch project by slug ${slug}:`, error)
    return null
  }
}
