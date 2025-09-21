import { NextRequest, NextResponse } from 'next/server';
import { fetchFromGoogleScript, submitRSVP } from '@/lib/googleScript';

// GET /api/messages - Fetch all messages
export async function GET() {
  try {
    // Fetch messages from Google Sheets
    const response = await fetchFromGoogleScript('messages');
    
    if (!response.success) {
      return NextResponse.json(
        { error: 'Failed to fetch messages', details: response.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: response.data || []
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Create new message/RSVP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.fullname) {
      return NextResponse.json(
        { error: 'Fullname is required' },
        { status: 400 }
      );
    }

    // Prepare data for Google Sheets
    const messageData = {
      id: Date.now().toString(),
      fullname: body.fullname,
      is_present: body.is_present !== undefined ? body.is_present : true,
      message: body.message || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save directly to Google Sheets
    const response = await submitRSVP(messageData);
    
    if (!response.success) {
      return NextResponse.json(
        { 
          error: 'Failed to save message to Google Sheets', 
          details: response.error 
        },
        { status: 500 }
      );
    }

    console.log('✅ Message saved to Google Sheets successfully');
    return NextResponse.json({
      success: true,
      data: messageData,
      message: 'Message saved successfully to Google Sheets'
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
