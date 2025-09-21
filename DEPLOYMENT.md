# Deployment Guide - Website Undangan Wisuda

## Setup Google Sheets

1. **Buat Google Sheets baru:**
   - Buka [Google Sheets](https://sheets.google.com)
   - Buat spreadsheet baru dengan nama "Wisuda Data"
   - Buat 2 sheet: `messages` dan `photos`

2. **Setup Google Apps Script:**
   - Buka [Google Apps Script](https://script.google.com)
   - Buat project baru
   - Copy kode dari file `google-script.js` ke dalam script editor
   - Simpan project dengan nama "Wisuda API"

3. **Deploy Google Apps Script:**
   - Klik "Deploy" > "New deployment"
   - Pilih type "Web app"
   - Set execute as "Me"
   - Set access to "Anyone"
   - Klik "Deploy"
   - Copy URL deployment

## Setup Google OAuth (Optional - untuk upload foto)

1. **Buat Google Cloud Project:**
   - Buka [Google Cloud Console](https://console.cloud.google.com)
   - Buat project baru atau pilih existing project

2. **Enable APIs:**
   - Enable Google Drive API
   - Enable Google+ API (untuk user info)

3. **Create OAuth Credentials:**
   - Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback` (development)
     - `https://your-domain.vercel.app/auth/google/callback` (production)

4. **Copy credentials:**
   - Copy Client ID dan Client Secret

## Environment Variables

Buat file `.env.local` dengan konfigurasi berikut:

```env
NEXT_PUBLIC_OAUTH_REDIRECT_URL=http://localhost:3000/auth/google/callback
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/your_script_id/exec
```

## Deployment ke Vercel

### Method 1: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login ke Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set environment variables:**
   ```bash
   vercel env add NEXT_PUBLIC_GOOGLE_SCRIPT_URL
   vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID
   vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
   vercel env add NEXT_PUBLIC_OAUTH_REDIRECT_URL
   ```

### Method 2: GitHub Integration

1. **Push ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/wisuda.git
   git push -u origin main
   ```

2. **Connect ke Vercel:**
   - Buka [Vercel Dashboard](https://vercel.com/dashboard)
   - Klik "New Project"
   - Import repository dari GitHub
   - Set environment variables di dashboard

3. **Deploy:**
   - Vercel akan otomatis deploy setiap kali ada push ke main branch

## Custom Domain (Optional)

1. **Add domain di Vercel:**
   - Go to project settings
   - Add custom domain
   - Follow DNS setup instructions

2. **Update OAuth redirect URI:**
   - Update redirect URI di Google Cloud Console
   - Update environment variable `NEXT_PUBLIC_OAUTH_REDIRECT_URL`

## Testing

1. **Test local development:**
   ```bash
   npm run dev
   ```
   - Buka `http://localhost:3000`
   - Test dengan query parameter: `?kepada=Nama%20Tamu`

2. **Test production build:**
   ```bash
   npm run build
   npm start
   ```

3. **Test Google Sheets integration:**
   - Submit form RSVP
   - Check data di Google Sheets

## Troubleshooting

### Common Issues:

1. **CORS Error:**
   - Pastikan Google Apps Script deployed dengan access "Anyone"
   - Check URL script di environment variables

2. **OAuth Error:**
   - Pastikan redirect URI sesuai dengan domain
   - Check Client ID dan Secret

3. **Build Error:**
   - Pastikan semua dependencies terinstall
   - Check TypeScript errors

4. **Google Sheets tidak update:**
   - Check Google Apps Script logs
   - Pastikan sheet name sesuai (`messages`, `photos`)

### Debug Mode:

Enable debug mode dengan menambahkan di `.env.local`:
```env
NODE_ENV=development
```

## Monitoring

1. **Vercel Analytics:**
   - Enable di project settings
   - Monitor performance dan errors

2. **Google Apps Script Logs:**
   - Check execution logs di Google Apps Script dashboard

3. **Google Sheets:**
   - Monitor data masuk di sheets
   - Check untuk error atau missing data

## Backup

1. **Code backup:**
   - Push ke GitHub repository
   - Tag releases untuk version control

2. **Data backup:**
   - Export Google Sheets secara berkala
   - Setup Google Drive backup

## Security Notes

1. **Environment Variables:**
   - Jangan commit `.env.local` ke repository
   - Gunakan Vercel environment variables untuk production

2. **Google Script:**
   - Set access ke "Anyone" hanya jika diperlukan
   - Consider rate limiting untuk production

3. **OAuth:**
   - Rotate credentials secara berkala
   - Monitor OAuth usage di Google Cloud Console
