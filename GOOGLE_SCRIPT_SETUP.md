# Setup Google Apps Script untuk Website Undangan Wisuda

## Langkah-langkah Setup Google Script

### 1. Buat Google Apps Script Baru

1. Buka [Google Apps Script](https://script.google.com)
2. Klik "New Project"
3. Ganti nama project menjadi "Wisuda API"

### 2. Copy Kode Google Script

Copy seluruh kode dari file `google-script.js` ke dalam script editor:

```javascript
function doGet(e) {
    const sheetName = (e && e.parameter && e.parameter.sheet) ? e.parameter.sheet : 'messages';
    const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  
    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({ error: 'Sheet not found' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  
    const data = [];
    const rlen = sheet.getLastRow();
    const clen = sheet.getLastColumn();
    
    if (rlen <= 1) {
      return ContentService.createTextOutput(
        JSON.stringify({ data: [] })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    const rows = sheet.getRange(1, 1, rlen, clen).getValues();
  
    for (let i = 1; i < rows.length; i++) {
      let record = {};
      for (let j = 0; j < clen; j++) {
        record[rows[0][j]] = rows[i][j];
      }
      data.push(record);
    }
  
    return ContentService.createTextOutput(
      JSON.stringify({ data: data })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  

function doPost(e) {
    try {
      const data = JSON.parse(e.postData.contents);
      const action = data.action;
      const sheetName = e.parameter.sheet;
  
      switch (action) {
        case 'create':
          return handleCreate(data.data, sheetName);
        case 'update':
          return handleUpdate(data.id, data.data, sheetName);
        case 'delete':
          return handleDelete(data.id, sheetName);
        case 'rsvp':
          return handleRSVP(data.data, sheetName);
        case 'upload_photo':
          return handlePhotoUpload(data.data, sheetName);
        default:
          throw new Error('Invalid action: ' + action);
      }
    } catch (error) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  function getOrCreateSheet(sheetName) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    return sheet;
  }
  
  function handleCreate(data, sheetName) {
    const sheet = getOrCreateSheet(sheetName);
    const headers = sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      : [];
  
    const keys = Object.keys(data);
    const newHeaders = [...headers];
  
    keys.forEach(key => {
      if (!newHeaders.includes(key)) {
        newHeaders.push(key);
      }
    });
  
    if (newHeaders.length > headers.length) {
      sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    }
  
    const newRow = newHeaders.map(header => data[header] || '');
    sheet.appendRow(newRow);
  
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  function handleUpdate(id, data, sheetName) {
    const sheet = getOrCreateSheet(sheetName);
    const rlen = sheet.getLastRow();
    const clen = sheet.getLastColumn();
    const rows = sheet.getRange(1, 1, rlen, clen).getValues();
    const headers = rows[0];
    const idColumnIndex = headers.indexOf('id');
  
    if (idColumnIndex === -1) throw new Error('ID column not found');
  
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][idColumnIndex] === id) {
        rowIndex = i + 1;
        break;
      }
    }
  
    if (rowIndex === -1) throw new Error('Record not found with ID: ' + id);
  
    const keys = Object.keys(data);
    const newHeaders = [...headers];
    keys.forEach(key => {
      if (!newHeaders.includes(key)) {
        newHeaders.push(key);
      }
    });
  
    if (newHeaders.length > headers.length) {
      sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    }
  
    const oldRow = sheet.getRange(rowIndex, 1, 1, newHeaders.length).getValues()[0];
    const updatedRow = newHeaders.map(header => {
      return data[header] !== undefined ? data[header] : oldRow[newHeaders.indexOf(header)] || '';
    });
  
    sheet.getRange(rowIndex, 1, 1, updatedRow.length).setValues([updatedRow]);
  
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  function handleDelete(id, sheetName) {
    const sheet = getOrCreateSheet(sheetName);
    const rlen = sheet.getLastRow();
    const clen = sheet.getLastColumn();
    const rows = sheet.getRange(1, 1, rlen, clen).getValues();
    const headers = rows[0];
    const idColumnIndex = headers.indexOf('id');
  
    if (idColumnIndex === -1) throw new Error('ID column not found');
  
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][idColumnIndex] === id) {
        rowIndex = i + 1;
        break;
      }
    }
  
    if (rowIndex === -1) throw new Error('Record not found with ID: ' + id);
  
    sheet.deleteRow(rowIndex);
  
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Record deleted successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  function handleRSVP(data, sheetName) {
    // Add timestamp fields if not present
    if (!data.created_at) {
      data.created_at = new Date().toISOString();
    }
    if (!data.updated_at) {
      data.updated_at = new Date().toISOString();
    }
    
    return handleCreate(data, sheetName);
  }

  function handlePhotoUpload(data, sheetName) {
    // Add timestamp fields if not present
    if (!data.createdAt) {
      data.createdAt = new Date().toISOString();
    }
    
    return handleCreate(data, sheetName);
  }
```

### 3. Setup Google Sheets

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama "WISUDA-JAMJAM"
3. Buat 2 sheet:
   - Sheet 1: Rename menjadi "messages"
   - Sheet 2: Rename menjadi "photos"

#### Sheet "messages" - Header:
```
A1: id
B1: fullname  
C1: is_present
D1: message
E1: created_at
F1: updated_at
```

#### Sheet "photos" - Header:
```
A1: id
B1: image
C1: caption
D1: uploadedBy
E1: createdAt
```

### 4. Link Google Script dengan Google Sheets

1. Di Google Apps Script, klik "Resources" > "Libraries"
2. Klik "Add a library"
3. Masukkan ID spreadsheet Anda (dari URL Google Sheets)
4. Klik "Save"

### 5. Deploy Google Script

1. Di Google Apps Script, klik "Deploy" > "New deployment"
2. Pilih type: "Web app"
3. Set execute as: "Me"
4. Set access: "Anyone"
5. Klik "Deploy"
6. Copy URL deployment yang diberikan

### 6. Update Environment Variables

Update file `.env.local` dengan URL deployment yang baru:

```env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID/exec
```

### 7. Test Integration

```bash
# Test GET request
curl "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?sheet=messages"

# Test POST request
curl -X POST "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?sheet=messages" \
  -H "Content-Type: application/json" \
  -d '{"action":"rsvp","data":{"fullname":"Test User","is_present":true,"message":"Test message"}}'
```

## Troubleshooting

### Error: "Sheet not found"
- Pastikan sheet "messages" dan "photos" sudah dibuat di Google Sheets
- Pastikan nama sheet sesuai (case sensitive)

### Error: "Invalid action"
- Pastikan action yang dikirim adalah "rsvp" untuk messages
- Pastikan action yang dikirim adalah "upload_photo" untuk photos

### Error: "Moved Temporarily"
- URL Google Script tidak valid
- Deploy ulang Google Script dan dapatkan URL yang baru

### Data tidak tersimpan
- Cek permission Google Script (harus "Anyone")
- Cek apakah Google Sheets bisa diakses
- Cek console log untuk error details

## Testing

Setelah setup selesai, test dengan:

1. Submit form RSVP di website
2. Cek apakah data muncul di Google Sheets
3. Cek console browser untuk error
4. Cek Google Apps Script logs

## Production Notes

- Pastikan Google Script deployed dengan access "Anyone"
- Monitor Google Apps Script quota
- Setup error handling yang proper
- Consider rate limiting untuk production
