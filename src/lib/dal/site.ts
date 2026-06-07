import { publicSupabase } from '@/lib/supabase/client-public'
import { unstable_cache } from 'next/cache'

export const getSiteSettings = unstable_cache(
  async () => {
    const { data, error } = await publicSupabase
      .from('site_settings')
      .select('*')
      .single()

    if (error) {
      console.error('Failed to fetch site settings:', error)
      return null
    }
    
    return data
  },
  ['site_settings'],
  { tags: ['site_settings'] }
)

export const getPageContent = unstable_cache(
  async (page: string, locale: string = 'en') => {
    const { data, error } = await publicSupabase
      .from('page_content_schema')
      .select(`
        section, key, default_value,
        page_content ( value_text, value_json, locale )
      `)
      .eq('page', page)
      .eq('is_active', true)
      
    if (error) {
      console.error(`Failed to fetch page content for ${page}:`, error)
      return {}
    }

    const contentMap: Record<string, Record<string, any>> = {}
    
    data.forEach((item: any) => {
      if (!contentMap[item.section]) contentMap[item.section] = {}
      
      const override = item.page_content?.find((c: any) => c.locale === locale)
      const val = override?.value_json ?? override?.value_text ?? item.default_value
      contentMap[item.section][item.key] = val
    })
    
    return contentMap
  },
  ['page_content'],
  { tags: ['page_content'] }
)
