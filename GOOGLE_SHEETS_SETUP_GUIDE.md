# 🔧 Panduan Setup Google Sheets untuk Website Undangan Wisuda

## 🚨 Masalah Saat Ini

Google Sheets integration tidak berfungsi karena:

```
Status: invalid_response
Error: Unexpected token '<', "<!doctype "... is not valid JSON
Response: <!doctype html><html lang="en-US" dir="ltr">...
```

**Ini berarti Google Script URL mengembalikan HTML login page, bukan JSON data.**

## 🔍 Diagnosis Masalah

### 1. Cek Status Google Sheets
```bash
curl -s http://localhost:3000/api/google-sheets-status | jq .
```

### 2. Cek Google Script URL
```bash
curl -I "https://script.google.com/macros/s/AKfycbwTLSa0OMngLU1cqs_lzKvOZcMgjCVIQidAZLSKXWHjQYtFEs8Rp1WC9FuJ3Hqn74fcaw/exec?sheet=messages"
```

**Expected**: HTTP 200 dengan JSON response
**Actual**: HTTP 302 redirect ke login page

## 🛠️ Solusi Lengkap

### Langkah 1: Setup Google Apps Script

1. **Buka Google Apps Script**
   - Go to: https://script.google.com
   - Klik "New Project"
   - Nama project: "Wisuda API"

2. **Copy Script Code**
   - Copy seluruh kode dari file `google-script.js`
   - Paste ke dalam script editor

3. **Setup Google Sheets**
   - Buka: https://sheets.google.com
   - Buat spreadsheet baru dengan nama "WISUDA-JAMJAM"
   - Buat sheet "messages" dengan header:
     ```
     A1: id
     B1: fullname
     C1: is_present
     D1: message
     E1: created_at
     F1: updated_at
     ```

### Langkah 2: Deploy Google Script

1. **Deploy Script**
   - Di Google Apps Script, klik "Deploy" > "New deployment"
   - Type: "Web app"
   - Execute as: "Me"
   - **Access: "Anyone"** ← Ini yang sangat penting!
   - Klik "Deploy"

2. **Copy URL Deployment**
   - Copy URL yang diberikan setelah deploy
   - Format: `https://script.google.com/macros/s/SCRIPT_ID/exec`

### Langkah 3: Update Environment Variables

1. **Update .env.local**
   ```bash
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID/exec
   ```

2. **Restart Server**
   ```bash
   pkill -f "next dev"
   nvm use 20 && npm run dev
   ```

### Langkah 4: Test Integration

1. **Test Google Sheets Connection**
   ```bash
   curl -s http://localhost:3000/api/google-sheets-status | jq .
   ```

2. **Test POST Request**
   ```bash
   curl -X POST http://localhost:3000/api/messages \
     -H "Content-Type: application/json" \
     -d '{"fullname":"Test User","is_present":true,"message":"Test message"}'
   ```

3. **Test GET Request**
   ```bash
   curl -s http://localhost:3000/api/messages | jq .
   ```

## 🧪 Testing Commands

### Test Google Script URL Langsung
```bash
# Test GET request
curl "YOUR_GOOGLE_SCRIPT_URL?sheet=messages"

# Expected response:
{"data": [...]}

# Test POST request
curl -X POST "YOUR_GOOGLE_SCRIPT_URL?sheet=messages" \
  -H "Content-Type: application/json" \
  -d '{"action":"rsvp","data":{"fullname":"Test","is_present":true,"message":"Test"}}'

# Expected response:
{"success": true, "data": {...}}
```

### Test API Integration
```bash
# Test API endpoint
curl -s http://localhost:3000/api/google-sheets-status | jq .

# Expected response:
{
  "success": true,
  "status": "connected",
  "message": "Google Sheets connection successful"
}
```

## 🔧 Troubleshooting

### Error: "Moved Temporarily"
- **Cause**: Google Script tidak di-deploy dengan permission "Anyone"
- **Solution**: Deploy ulang dengan access "Anyone"

### Error: "Invalid action"
- **Cause**: Action yang dikirim tidak sesuai
- **Solution**: Pastikan action adalah "rsvp" untuk messages

### Error: "Sheet not found"
- **Cause**: Sheet "messages" tidak ada di Google Sheets
- **Solution**: Buat sheet "messages" dengan header yang benar

### Error: "Unexpected token '<'"
- **Cause**: Google Script URL redirect ke login page
- **Solution**: Deploy ulang dengan permission "Anyone"

## 📊 Expected Results

### Successful Google Sheets Integration:
```json
{
  "success": true,
  "status": "connected",
  "message": "Google Sheets connection successful",
  "data": {
    "data": [
      {
        "id": "1",
        "fullname": "Test User",
        "is_present": true,
        "message": "Test message",
        "created_at": "2025-09-21T08:00:00Z",
        "updated_at": "2025-09-21T08:00:00Z"
      }
    ]
  }
}
```

### Successful POST Request:
```json
{
  "success": true,
  "data": {
    "id": "1758444000000",
    "fullname": "Test User",
    "is_present": true,
    "message": "Test message",
    "created_at": "2025-09-21T08:00:00Z",
    "updated_at": "2025-09-21T08:00:00Z"
  },
  "message": "Message saved successfully to Google Sheets"
}
```

## 🎯 Next Steps

1. **Setup Google Apps Script** dengan permission "Anyone"
2. **Deploy Script** dan dapatkan URL deployment
3. **Update Environment Variables** dengan URL yang baru
4. **Test Integration** dengan commands di atas
5. **Verify Data** di Google Sheets

## 🔗 Useful Links

- [Google Apps Script](https://script.google.com)
- [Google Sheets](https://sheets.google.com)
- [Deploy Google Apps Script](https://developers.google.com/apps-script/guides/web)

## 📝 Notes

- **Permission "Anyone"** adalah kunci utama untuk membuat Google Script bisa diakses tanpa login
- **URL Deployment** harus di-copy dengan benar setelah deploy
- **Environment Variables** harus di-update dan server di-restart
- **Testing** harus dilakukan step by step untuk memastikan setiap bagian berfungsi
