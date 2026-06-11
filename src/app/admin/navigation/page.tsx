import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminNavigation, MenuType } from '@/lib/dal/navigation'
import { NavigationClient } from './NavigationClient'

export const metadata = {
  title: 'Navigation | Admin',
}

export default async function AdminNavigationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const items = await getAdminNavigation()

  // Group by menu_type
  const headerItems = items.filter(i => i.menu_type === 'header')
  const footerItems = items.filter(i => i.menu_type === 'footer')
  const legalItems = items.filter(i => i.menu_type === 'legal')
  const socialItems = items.filter(i => i.menu_type === 'social')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Navigation Settings</h1>
        <p className="text-gray-400 mt-2 text-sm">
          Manage header, footer, legal, and social links across the website.
        </p>
      </div>

      <NavigationClient 
        headerItems={headerItems}
        footerItems={footerItems}
        legalItems={legalItems}
        socialItems={socialItems}
      />
    </div>
  )
}
