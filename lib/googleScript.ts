const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzt1OQbXYVlQfmqPX3Mn0FI9d_xFbu6grrtb0gzqpIlrp5rkAg94PImaaHbBufAaQTkvA/exec';

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function fetchFromGoogleScript<T>(
  sheetName: string,
  method: 'GET' | 'POST' = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  try {
    const url = `${GOOGLE_SCRIPT_URL}?sheet=${sheetName}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      redirect: 'follow', // Follow redirects
    };

    if (method === 'POST' && data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.error('Google Script response not ok:', response.status, response.statusText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
    
    const text = await response.text();
    console.log('Google Script raw response:', text);
    
    try {
      const result = JSON.parse(text);
      
      // Google Script returns data directly, wrap it in success response
      if (result.data) {
        return {
          success: true,
          data: result.data
        };
      }
      
      return result;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return {
        success: false,
        error: 'Invalid JSON response from Google Script'
      };
    }
  } catch (error) {
    console.error('Error fetching from Google Script:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function createRecord(sheetName: string, data: any) {
  return fetchFromGoogleScript(sheetName, 'POST', {
    action: 'create',
    data
  });
}

export async function updateRecord(sheetName: string, id: string, data: any) {
  return fetchFromGoogleScript(sheetName, 'POST', {
    action: 'update',
    id,
    data
  });
}

export async function deleteRecord(sheetName: string, id: string) {
  return fetchFromGoogleScript(sheetName, 'POST', {
    action: 'delete',
    id
  });
}

export async function submitRSVP(data: any) {
  return fetchFromGoogleScript('messages', 'POST', {
    action: 'rsvp',
    data
  });
}

export async function uploadPhoto(data: any) {
  return fetchFromGoogleScript('post', 'POST', {
    action: 'upload_photo',
    data
  });
}
