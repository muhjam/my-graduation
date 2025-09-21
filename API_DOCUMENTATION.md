# API Documentation - Website Undangan Wisuda

## Overview

Website undangan wisuda menggunakan Next.js API Routes untuk menghandle semua request ke Google Sheets dan Google Drive. Arsitektur ini memisahkan frontend dari backend logic dan membuat kode lebih maintainable.

## API Endpoints

### 1. Messages API

#### GET `/api/messages`
Mengambil semua pesan/RSVP dari Google Sheets.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "fullname": "Ahmad Rizki",
      "phone": "081234567890",
      "qty": 2,
      "is_present": true,
      "message": "Selamat atas kelulusannya!",
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### POST `/api/messages`
Menyimpan pesan/RSVP baru ke Google Sheets.

**Request Body:**
```json
{
  "fullname": "John Doe",
  "phone": "081234567890",
  "qty": 2,
  "is_present": true,
  "message": "Selamat atas kelulusannya!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "3",
    "fullname": "John Doe",
    "phone": "081234567890",
    "qty": 2,
    "is_present": true,
    "message": "Selamat atas kelulusannya!",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  },
  "message": "Message saved successfully"
}
```

### 2. Photos API

#### GET `/api/photos`
Mengambil semua foto dari Google Sheets.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "image": "https://drive.google.com/uc?id=1XM-4qjMZBCpt8xPisNGC4BYKwVDsubwQ",
      "caption": "Momen kebahagiaan bersama keluarga",
      "uploadedBy": "Sarah Johnson",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### POST `/api/photos`
Menyimpan informasi foto baru ke Google Sheets.

**Request Body:**
```json
{
  "image": "https://drive.google.com/uc?id=1XM-4qjMZBCpt8xPisNGC4BYKwVDsubwQ",
  "caption": "Foto wisuda",
  "uploadedBy": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "4",
    "image": "https://drive.google.com/uc?id=1XM-4qjMZBCpt8xPisNGC4BYKwVDsubwQ",
    "caption": "Foto wisuda",
    "uploadedBy": "John Doe",
    "createdAt": "2025-01-15T10:00:00Z"
  },
  "message": "Photo saved successfully"
}
```

### 3. Upload API

#### POST `/api/upload`
Upload file ke Google Drive.

**Request Body (FormData):**
```
file: [File object]
caption: "Caption foto"
accessToken: "Google OAuth access token"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1XM-4qjMZBCpt8xPisNGC4BYKwVDsubwQ",
    "name": "photo.jpg",
    "url": "https://drive.google.com/uc?id=1XM-4qjMZBCpt8xPisNGC4BYKwVDsubwQ",
    "webViewLink": "https://drive.google.com/file/d/1XM-4qjMZBCpt8xPisNGC4BYKwVDsubwQ/view",
    "thumbnailLink": "https://drive.google.com/thumbnail?id=1XM-4qjMZBCpt8xPisNGC4BYKwVDsubwQ&sz=w400"
  }
}
```

### 4. Google Auth API

#### GET `/api/auth/google`
Mendapatkan Google OAuth URL untuk login.

**Response:**
```json
{
  "success": true,
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

#### POST `/api/auth/google`
Exchange authorization code untuk access token.

**Request Body:**
```json
{
  "code": "authorization_code_from_google"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "123456789",
    "email": "user@gmail.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/..."
  },
  "tokens": {
    "access_token": "ya29.a0AfH6SMC...",
    "refresh_token": "1//04...",
    "scope": "https://www.googleapis.com/auth/drive.file...",
    "token_type": "Bearer",
    "expiry_date": 1640995200000
  }
}
```

## Error Handling

Semua API endpoints mengembalikan error dalam format yang konsisten:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing required fields)
- `500` - Internal Server Error

## Data Flow

### 1. Load Data
```
Frontend → API Route → Google Script → Google Sheets
```

### 2. Submit RSVP
```
Frontend → POST /api/messages → Google Script → Google Sheets
```

### 3. Upload Photo
```
Frontend → POST /api/upload → Google Drive API
Frontend → POST /api/photos → Google Script → Google Sheets
```

### 4. Google OAuth
```
Frontend → GET /api/auth/google → Google OAuth URL
Frontend → POST /api/auth/google → Google OAuth API
```

## Environment Variables

```env
NEXT_PUBLIC_OAUTH_REDIRECT_URL=http://localhost:3000/auth/google/callback
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/your_script_id/exec
```

## Testing API

### Using curl

```bash
# Get messages
curl http://localhost:3000/api/messages

# Get photos
curl http://localhost:3000/api/photos

# Submit RSVP
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"fullname":"John Doe","phone":"081234567890","qty":2,"is_present":true,"message":"Selamat!"}'

# Get Google OAuth URL
curl http://localhost:3000/api/auth/google
```

### Using JavaScript

```javascript
// Fetch messages
const response = await fetch('/api/messages');
const data = await response.json();

// Submit RSVP
const response = await fetch('/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullname: 'John Doe',
    phone: '081234567890',
    qty: 2,
    is_present: true,
    message: 'Selamat!'
  })
});
```

## Security Considerations

1. **Environment Variables**: Jangan expose sensitive data ke client
2. **Input Validation**: Semua input divalidasi di API routes
3. **Error Handling**: Error details tidak expose sensitive information
4. **CORS**: API routes hanya accessible dari same origin
5. **Rate Limiting**: Consider implement rate limiting untuk production

## Future Enhancements

1. **Caching**: Implement Redis atau in-memory caching
2. **Rate Limiting**: Add rate limiting untuk prevent abuse
3. **Logging**: Add comprehensive logging
4. **Monitoring**: Add health check endpoints
5. **Authentication**: Add JWT authentication untuk admin features
