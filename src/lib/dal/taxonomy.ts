import { publicSupabase } from '@/lib/supabase/client-public'
import { unstable_cache } from 'next/cache'

export const getCapabilities = unstable_cache(
  async () => {
    const { data, error } = await publicSupabase
      .from('capabilities')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Failed to fetch capabilities:', error)
      return []
    }
    return data
  },
  ['capabilities'],
  { tags: ['capabilities'] }
)

export const getTeam = unstable_cache(
  async () => {
    const { data, error } = await publicSupabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Failed to fetch team members:', error)
      return []
    }
    return data
  },
  ['team_members'],
  { tags: ['team_members'] }
)
