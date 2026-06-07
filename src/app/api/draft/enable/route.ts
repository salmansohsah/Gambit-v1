import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADMIN_ROLES = ['admin', 'super_admin'];

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Validate authenticated session
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Validate admin role — editors and anonymous users cannot enable draft preview
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    return new NextResponse('Forbidden: Insufficient role', { status: 403 });
  }

  // Parse the query parameters for a redirect path
  const { searchParams } = new URL(request.url);
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(redirectPath, request.url));
}
