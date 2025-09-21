import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/googleAuth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?error=${error}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?error=no_code`
      );
    }

    // Exchange code for tokens
    const tokenData = await exchangeCodeForTokens(code);

    // Create HTML response that closes popup and sends message to parent
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Success</title>
        </head>
        <body>
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
            <div style="text-align: center;">
              <div style="width: 50px; height: 50px; border: 4px solid #10b981; border-top: 4px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
              <h2 style="color: #10b981; margin-bottom: 10px;">Successfully Connected!</h2>
              <p style="color: #6b7280;">Closing window...</p>
            </div>
          </div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
          <script>
            // Store tokens in localStorage for client-side access
            localStorage.setItem('google_access_token', '${tokenData.access_token}');
            ${tokenData.refresh_token ? `localStorage.setItem('google_refresh_token', '${tokenData.refresh_token}');` : ''}
            ${tokenData.expires_in ? `localStorage.setItem('google_token_expiry', '${Date.now() + (tokenData.expires_in * 1000)}');` : ''}
            
            // Send success message to parent window
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, window.location.origin);
              setTimeout(() => {
                window.close();
              }, 500);
            } else {
              setTimeout(() => {
                window.location.href = '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?auth=success';
              }, 1000);
            }
          </script>
        </body>
      </html>
    `;

    const response = new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

    // Set cookies with tokens
    response.cookies.set('google_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
    });

    if (tokenData.refresh_token) {
      response.cookies.set('google_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    
    // Create HTML response for error that closes popup
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Error</title>
        </head>
        <body>
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
            <div style="text-align: center;">
              <div style="width: 50px; height: 50px; background-color: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                <span style="color: white; font-size: 24px;">×</span>
              </div>
              <h2 style="color: #ef4444; margin-bottom: 10px;">Authentication Failed</h2>
              <p style="color: #6b7280;">Closing window...</p>
            </div>
          </div>
          <script>
            // Send error message to parent window
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'GOOGLE_AUTH_ERROR', 
                error: 'Authentication failed' 
              }, window.location.origin);
              setTimeout(() => {
                window.close();
              }, 1000);
            } else {
              setTimeout(() => {
                window.location.href = '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?error=auth_failed';
              }, 2000);
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}
