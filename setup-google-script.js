#!/usr/bin/env node

/**
 * Script untuk membantu setup Google Apps Script
 * Jalankan dengan: node setup-google-script.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Setup Google Apps Script untuk Website Undangan Wisuda\n');

console.log('📋 Langkah-langkah yang perlu dilakukan:\n');

console.log('1. 📝 Buat Google Apps Script:');
console.log('   - Buka: https://script.google.com');
console.log('   - Klik "New Project"');
console.log('   - Ganti nama menjadi "Wisuda API"\n');

console.log('2. 📄 Copy kode Google Script:');
console.log('   - Copy seluruh kode dari file: google-script.js');
console.log('   - Paste ke dalam script editor\n');

console.log('3. 📊 Setup Google Sheets:');
console.log('   - Buka: https://sheets.google.com');
console.log('   - Buat spreadsheet baru dengan nama "WISUDA-JAMJAM"');
console.log('   - Buat 2 sheet: "messages" dan "photos"');
console.log('   - Set header untuk sheet "messages":');
console.log('     A1: id, B1: fullname, C1: is_present, D1: message, E1: created_at, F1: updated_at');
console.log('   - Set header untuk sheet "photos":');
console.log('     A1: id, B1: image, C1: caption, D1: uploadedBy, E1: createdAt\n');

console.log('4. 🔗 Deploy Google Script:');
console.log('   - Di Google Apps Script, klik "Deploy" > "New deployment"');
console.log('   - Pilih type: "Web app"');
console.log('   - Set execute as: "Me"');
console.log('   - Set access: "Anyone"');
console.log('   - Klik "Deploy"');
console.log('   - Copy URL deployment yang diberikan\n');

rl.question('📋 Apakah Anda sudah menyelesaikan langkah-langkah di atas? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    rl.question('🔗 Masukkan URL deployment Google Script: ', (scriptUrl) => {
      if (scriptUrl && scriptUrl.includes('script.google.com')) {
        console.log('\n✅ URL Google Script diterima!');
        console.log('\n📝 Update file .env.local dengan URL berikut:');
        console.log(`NEXT_PUBLIC_GOOGLE_SCRIPT_URL=${scriptUrl}\n`);
        
        console.log('🧪 Test Google Script:');
        console.log(`curl "${scriptUrl}?sheet=messages"`);
        console.log('\n📤 Test POST request:');
        console.log(`curl -X POST "${scriptUrl}?sheet=messages" \\`);
        console.log('  -H "Content-Type: application/json" \\');
        console.log('  -d \'{"action":"rsvp","data":{"fullname":"Test User","is_present":true,"message":"Test message"}}\'\n');
        
        console.log('🎉 Setup selesai! Sekarang data akan tersimpan ke Google Sheets.');
      } else {
        console.log('\n❌ URL tidak valid. Pastikan URL dari Google Apps Script deployment.');
      }
      rl.close();
    });
  } else {
    console.log('\n📋 Silakan selesaikan langkah-langkah di atas terlebih dahulu.');
    console.log('💡 Anda bisa menjalankan script ini lagi setelah setup selesai.');
    rl.close();
  }
});

rl.on('close', () => {
  console.log('\n👋 Terima kasih!');
});
