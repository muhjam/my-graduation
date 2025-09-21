import { NextResponse } from 'next/server';

// GET /api/google-sheets-status - Check Google Sheets connection status
export async function GET() {
  try {
    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    
    if (!googleScriptUrl) {
      return NextResponse.json({
        success: false,
        status: 'not_configured',
        message: 'Google Script URL not configured',
        error: 'NEXT_PUBLIC_GOOGLE_SCRIPT_URL environment variable is missing'
      });
    }

    // Test Google Script URL
    const testUrl = `${googleScriptUrl}?sheet=messages`;
    
    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();
      
      // Check if response is HTML (login page)
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<HTML>')) {
        return NextResponse.json({
          success: false,
          status: 'login_required',
          message: 'Google Script requires authentication',
          error: 'Google Script URL redirects to login page',
          responsePreview: responseText.substring(0, 200) + '...',
          solution: 'Google Script needs to be deployed with "Anyone" access'
        });
      }

      // Try to parse as JSON
      try {
        const jsonData = JSON.parse(responseText);
        return NextResponse.json({
          success: true,
          status: 'connected',
          message: 'Google Sheets connection successful',
          data: jsonData
        });
      } catch (jsonError) {
        return NextResponse.json({
          success: false,
          status: 'invalid_response',
          message: 'Google Script returned invalid JSON',
          error: jsonError instanceof Error ? jsonError.message : 'Unknown JSON parsing error',
          responsePreview: responseText.substring(0, 200) + '...'
        });
      }

    } catch (fetchError) {
      return NextResponse.json({
        success: false,
        status: 'connection_failed',
        message: 'Failed to connect to Google Script',
        error: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
      });
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
