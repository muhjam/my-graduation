# Google Drive API Setup Guide

## Masalah yang Ditemukan
Error "Method doesn't allow unregistered callers" menunjukkan bahwa Google Drive API belum diaktifkan atau dikonfigurasi dengan benar di Google Cloud Console.

## Langkah-langkah Perbaikan

### 1. Aktifkan Google Drive API
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih project yang sudah dibuat sebelumnya
3. Pergi ke **APIs & Services** > **Library**
4. Cari "Google Drive API"
5. Klik **Enable**

### 2. Konfigurasi OAuth Consent Screen
1. Pergi ke **APIs & Services** > **OAuth consent screen**
2. Pastikan status adalah "Published" atau "Testing"
3. Jika masih "Draft", klik **Publish App**
4. Tambahkan scope yang diperlukan:
   - `https://www.googleapis.com/auth/drive`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/userinfo.email`

### 3. Verifikasi Credentials
1. Pergi ke **APIs & Services** > **Credentials**
2. Pastikan OAuth 2.0 Client ID sudah dikonfigurasi dengan benar
3. Authorized redirect URIs harus mencakup:
   - `http://localhost:3000/auth/google/callback`

### 4. Test Kembali
Setelah konfigurasi selesai:
1. User perlu login ulang untuk mendapatkan access token dengan scope yang baru
2. Test upload foto kembali

## Scope yang Diperlukan
- `https://www.googleapis.com/auth/drive` - Full access to Google Drive
- `https://www.googleapis.com/auth/userinfo.profile` - User profile info
- `https://www.googleapis.com/auth/userinfo.email` - User email

## Troubleshooting
Jika masih error:
1. Pastikan Google Drive API sudah diaktifkan
2. Pastikan OAuth consent screen sudah published
3. Pastikan redirect URI sudah benar
4. User perlu login ulang setelah perubahan scope
