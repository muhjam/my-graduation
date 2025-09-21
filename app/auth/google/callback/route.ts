import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Redirect to the API callback route
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  // Build the redirect URL to the API route
  const apiUrl = new URL('/api/auth/google/callback', request.url);
  if (code) apiUrl.searchParams.set('code', code);
  if (error) apiUrl.searchParams.set('error', error);
  
  return NextResponse.redirect(apiUrl.toString());
}
