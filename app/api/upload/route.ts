import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// POST /api/upload - Upload file to Google Drive
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    const accessToken = formData.get('accessToken') as string;

    if (!file || !caption || !accessToken) {
      return NextResponse.json(
        { error: 'File, caption, and access token are required' },
        { status: 400 }
      );
    }

    // Initialize Google Drive API
    const drive = google.drive({ version: 'v3' });
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a readable stream from buffer
    const { Readable } = require('stream');
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    // Upload to Google Drive
    const response = await drive.files.create({
      auth: new google.auth.OAuth2().setCredentials({ access_token: accessToken }),
      requestBody: {
        name: `${Date.now()}_${file.name}`,
        description: caption,
        parents: ['root']
      },
      media: {
        mimeType: file.type,
        body: stream
      },
      fields: 'id,name,webViewLink,thumbnailLink'
    });

    if (!response.data.id) {
      throw new Error('Failed to upload file');
    }

    // Make file public
    await drive.permissions.create({
      auth: new google.auth.OAuth2().setCredentials({ access_token: accessToken }),
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    // Get public URL
    const publicUrl = `https://drive.google.com/uc?id=${response.data.id}`;

    return NextResponse.json({
      success: true,
      data: {
        id: response.data.id,
        name: response.data.name,
        url: publicUrl,
        webViewLink: response.data.webViewLink,
        thumbnailLink: response.data.thumbnailLink
      }
    });
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
