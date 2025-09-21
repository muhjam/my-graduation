
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
  