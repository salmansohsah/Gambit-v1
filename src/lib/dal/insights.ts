import { publicSupabase } from '@/lib/supabase/client-public'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

// ------------------------------------------------------------------
// CACHED QUERIES (Production)
// ------------------------------------------------------------------

export const getPublishedInsights = unstable_cache(
  async () => {
    const { data, error } = await publicSupabase
      .from('insights')
      .select(`*, insight_categories(*), team_members(*)`)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    if (error) throw error
    return data
  },
  ['insights_published'],
  { tags: ['insights'] }
)

const getFeaturedInsightCached = unstable_cache(
  async () => {
    const { data, error } = await publicSupabase
      .from('insights')
      .select(`*, insight_categories(*), team_members(*)`)
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .single()
    if (error && error.code !== 'PGRST116') throw error // Ignore no rows returned
    return data || null
  },
  ['featured_insight_published'],
  { tags: ['insights'] }
)

const getInsightBySlugCached = unstable_cache(
  async (slug: string) => {
    const { data, error } = await publicSupabase
      .from('insights')
      .select(`*, insight_categories(*), team_members(*)`)
      .eq('status', 'published')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data
  },
  ['insight_by_slug_published'],
  { tags: ['insights'] }
)

const getCategoriesCached = unstable_cache(
  async () => {
    const { data, error } = await publicSupabase
      .from('insight_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data
  },
  ['insight_categories'],
  { tags: ['insight_categories'] }
)

// ------------------------------------------------------------------
// DRAFT QUERIES (Bypasses 'status' check and Next.js Cache)
// ------------------------------------------------------------------

async function getInsightsDraft() {
  const { data, error } = await publicSupabase
    .from('insights')
    .select(`*, insight_categories(*), team_members(*)`)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

async function getFeaturedInsightDraft() {
  const { data, error } = await publicSupabase
    .from('insights')
    .select(`*, insight_categories(*), team_members(*)`)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

async function getInsightBySlugDraft(slug: string) {
  const { data, error } = await publicSupabase
    .from('insights')
    .select(`*, insight_categories(*), team_members(*)`)
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

// ------------------------------------------------------------------
// EXPORTED API
// ------------------------------------------------------------------

export async function getInsights() {
  let isEnabled = false;
  try {
    const draft = await draftMode();
    isEnabled = draft.isEnabled;
  } catch (e) {}

  try {
    return isEnabled ? await getInsightsDraft() : await getPublishedInsights()
  } catch (error) {
    console.error('Failed to fetch insights:', error)
    return []
  }
}

export async function getFeaturedInsight() {
  let isEnabled = false;
  try {
    const draft = await draftMode();
    isEnabled = draft.isEnabled;
  } catch (e) {}

  try {
    return isEnabled ? await getFeaturedInsightDraft() : await getFeaturedInsightCached()
  } catch (error) {
    console.error('Failed to fetch featured insight:', error)
    return null
  }
}

export async function getInsightBySlug(slug: string) {
  let isEnabled = false;
  try {
    const draft = await draftMode();
    isEnabled = draft.isEnabled;
  } catch (e) {}

  try {
    return isEnabled ? await getInsightBySlugDraft(slug) : await getInsightBySlugCached(slug)
  } catch (error) {
    console.error(`Failed to fetch insight by slug ${slug}:`, error)
    return null
  }
}

export async function getCategories() {
  // Categories are generally static and don't need draft mode bypass
  try {
    return await getCategoriesCached()
  } catch (error) {
    console.error('Failed to fetch insight categories:', error)
    return []
  }
}
