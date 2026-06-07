import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || '/'
  const disable = searchParams.get('disable') === 'true'

  // If disable is passed, turn off draft mode and redirect to the slug
  if (disable) {
    const draft = await draftMode()
    draft.disable()
    return redirect(slug)
  }

  // To enable draft mode, verify the user's admin session via Supabase
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized to enter draft mode. Please log in as an admin first.' }, { status: 401 })
  }

  // Session verified, enable Draft Mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the provided slug to preview the page
  return redirect(slug)
}
