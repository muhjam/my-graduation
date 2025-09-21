import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// POST /api/test-token - Test if access token is valid
export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

    // Test with Google Drive API
    const drive = google.drive({ version: 'v3' });
    
    try {
      const response = await drive.files.list({
        auth: new google.auth.OAuth2().setCredentials({ access_token: accessToken }),
        pageSize: 1,
        fields: 'files(id,name)'
      });

      return NextResponse.json({
        success: true,
        message: 'Token is valid',
        filesCount: response.data.files?.length || 0
      });
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: error.message || 'Token validation failed'
      });
    }
  } catch (error) {
    console.error('Error testing token:', error);
    return NextResponse.json(
      { error: 'Failed to test token' },
      { status: 500 }
    );
  }
}
