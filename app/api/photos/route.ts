import { NextRequest, NextResponse } from 'next/server';
import { fetchFromGoogleScript, uploadPhoto } from '@/lib/googleScript';

// GET /api/photos - Fetch all photos
export async function GET() {
  try {
    // Fetch photos from Google Sheets (sheet "post")
    const response = await fetchFromGoogleScript('post');
    
    if (!response.success) {
      return NextResponse.json(
        { error: 'Failed to fetch photos', details: response.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: response.data || []
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/photos - Upload new photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.image || !body.caption || !body.from) {
      return NextResponse.json(
        { error: 'Image URL, caption, and from (uploader name) are required' },
        { status: 400 }
      );
    }

    // Prepare data for Google Sheets (sheet "post" with fields: id, from, image, caption, createdAt)
    const photoData = {
      id: Date.now().toString(),
      from: body.from,
      image: body.image,
      caption: body.caption,
      createdAt: new Date().toISOString()
    };

    // Use uploadPhoto function which calls Google Script with sheet "post"
    const response = await uploadPhoto(photoData);
    
    if (!response.success) {
      return NextResponse.json(
        { error: 'Failed to save photo to Google Sheets', details: response.error },
        { status: 500 }
      );
    }

    console.log('✅ Photo saved to Google Sheets successfully');
    return NextResponse.json({
      success: true,
      data: photoData,
      message: 'Photo saved successfully to Google Sheets'
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
