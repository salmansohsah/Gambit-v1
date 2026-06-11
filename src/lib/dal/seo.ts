import { createAdminClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'

export interface SeoOverride {
  id: string
  page_path: string
  title: string | null
  description: string | null
  keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  twitter_card: string | null
  twitter_title: string | null
  twitter_description: string | null
  twitter_image: string | null
  canonical_url: string | null
  noindex: boolean
  nofollow: boolean
  structured_data_json: any | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export const getSeoOverride = unstable_cache(
  async (pagePath: string) => {
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('seo_overrides')
      .select('*')
      .eq('page_path', pagePath)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error(`Failed to fetch SEO override for path ${pagePath}:`, error)
      }
      return null
    }

    return data as SeoOverride
  },
  ['seo_overrides'],
  { tags: ['seo'] }
)

export async function getAdminSeoOverrides() {
  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('seo_overrides')
    .select('*')
    .order('page_path', { ascending: true })

  if (error) throw error
  return data as SeoOverride[]
}

export async function upsertSeoOverride(item: Partial<SeoOverride>) {
  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('seo_overrides')
    .upsert(item)
    .select()
    .single()

  if (error) throw error
  return data as SeoOverride
}

export async function deleteSeoOverride(id: string) {
  const adminSupabase = createAdminClient()
  const { error } = await adminSupabase
    .from('seo_overrides')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
