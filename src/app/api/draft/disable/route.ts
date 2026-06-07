import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Parse the query parameters for a redirect path
  const { searchParams } = new URL(request.url);
  const redirectPath = searchParams.get('redirect') || '/';

  // Disable Draft Mode
  const draft = await draftMode();
  draft.disable();

  // Redirect to the provided path or home
  return NextResponse.redirect(new URL(redirectPath, request.url));
}
