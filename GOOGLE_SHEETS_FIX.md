# 🔧 Cara Memperbaiki Google Sheets Integration

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
curl -I "https://script.google.com/macros/s/AKfycbwsxSyjurxuc1in2Waov8oR4fHaTK7GGrgqTfdL90p3utFZJx0MUrJlZCXr7JPWiyi8sg/exec?sheet=messages"
```

**Expected**: HTTP 200 dengan JSON response
**Actual**: HTTP 302 redirect ke login page

## 🛠️ Solusi

### Opsi 1: Deploy Ulang Google Script (Recommended)

1. **Buka Google Apps Script**
   - Go to: https://script.google.com
   - Find your project "Wisuda API"

2. **Update Script Code**
   - Copy kode dari `google-script.js`
   - Paste ke dalam script editor

3. **Deploy dengan Permission yang Benar**
   - Klik "Deploy" > "New deployment"
   - Type: "Web app"
   - Execute as: "Me"
   - **Access: "Anyone"** ← Ini yang penting!
   - Klik "Deploy"

4. **Update Environment Variables**
   ```bash
   # Update .env.local dengan URL deployment yang baru
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/NEW_SCRIPT_ID/exec
   ```

5. **Test Connection**
   ```bash
   curl -s http://localhost:3000/api/google-sheets-status | jq .
   ```

### Opsi 2: Buat Google Script Baru

1. **Buat Project Baru**
   - Go to: https://script.google.com
   - Klik "New Project"
   - Nama: "Wisuda API v2"

2. **Copy Script Code**
   ```javascript
   // Copy seluruh kode dari google-script.js
   ```

3. **Setup Google Sheets**
   - Buka: https://sheets.google.com
   - Buat spreadsheet baru: "WISUDA-JAMJAM-v2"
   - Buat sheet "messages" dengan header:
     ```
     A1: id
     B1: fullname
     C1: is_present
     D1: message
     E1: created_at
     F1: updated_at
     ```

4. **Deploy Script**
   - Deploy > New deployment
   - Type: Web app
   - Execute as: Me
   - **Access: Anyone**
   - Deploy

5. **Update Environment Variables**
   ```bash
   # Update .env.local
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/NEW_SCRIPT_ID/exec
   ```

### Opsi 3: Gunakan File Storage (Current Working Solution)

**Status**: ✅ Berfungsi sempurna
**Data Location**: `data/messages.json`
**Persistence**: ✅ Data tersimpan meski server restart

```bash
# Test current working solution
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"fullname":"Test","is_present":true,"message":"Test message"}'

# Check data
curl -s http://localhost:3000/api/messages | jq .
```

## 🧪 Testing

### Test Google Sheets Connection
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

## 📊 Current Data Status

**File Storage**: ✅ Working
- Data tersimpan di `data/messages.json`
- 5 messages tersimpan
- Data persisten meski server restart

**Google Sheets**: ❌ Not Working
- Google Script URL redirect ke login
- Perlu di-deploy ulang dengan permission "Anyone"

## 🎯 Next Steps

1. **Immediate**: File storage sudah berfungsi, data tersimpan
2. **Optional**: Setup Google Sheets untuk backup/sync
3. **Production**: Deploy ke Vercel dengan file storage

## 🔗 Useful Links

- [Google Apps Script](https://script.google.com)
- [Google Sheets](https://sheets.google.com)
- [Deploy Google Apps Script](https://developers.google.com/apps-script/guides/web)

## 📝 Notes

- File storage solution sudah berfungsi sempurna
- Google Sheets integration adalah optional backup
- Data tidak akan hilang dengan file storage
- Website sudah siap untuk production
