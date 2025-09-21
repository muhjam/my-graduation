# Website Undangan Wisuda

Website undangan wisuda yang dibuat dengan Next.js 15, Tailwind CSS, dan integrasi Google Sheets untuk menyimpan data.

## Fitur

- ✅ **Undangan Personal** - Menampilkan nama tamu dari query parameter `?kepada=`
- ✅ **Album Foto** - Upload dan tampilkan foto dengan caption
- ✅ **Form RSVP** - Konfirmasi kehadiran dengan pesan ucapan
- ✅ **Tema Cream White** - Desain elegan dengan warna cream
- ✅ **Responsive Design** - Optimal di semua perangkat
- ✅ **Google Sheets Integration** - Data tersimpan di Google Sheets

## Teknologi

- **Next.js 15** - React framework dengan App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Google Sheets API** - Backend data storage
- **Lucide React** - Icon library

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` dengan konfigurasi Anda:
   ```
   NEXT_PUBLIC_OAUTH_REDIRECT_URL=http://localhost:3000/auth/google/callback
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/your_script_id/exec
   ```

3. **Setup Google Sheets:**
   - Buat Google Sheets dengan 2 sheet: `messages` dan `photos`
   - Deploy Google Apps Script dengan kode dari `google-script.js`
   - Update URL script di environment variables

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Struktur Data

### Sheet "messages"
- `id` - Unique identifier
- `fullname` - Nama lengkap tamu
- `phone` - Nomor telepon
- `qty` - Jumlah kehadiran
- `is_present` - Status kehadiran (true/false)
- `message` - Ucapan dari tamu
- `created_at` - Timestamp pembuatan
- `updated_at` - Timestamp update

### Sheet "photos"
- `id` - Unique identifier
- `image` - URL gambar
- `caption` - Caption foto
- `uploadedBy` - Nama pengupload
- `createdAt` - Timestamp upload

## Deployment

### Vercel (Recommended)

1. Push code ke GitHub repository
2. Connect repository ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy

### Manual Build

```bash
npm run build
npm start
```

## Customization

### Mengubah Data Undangan

Edit file `data/mockData.ts`:

```typescript
export const invitationData: InvitationData = {
  graduateName: "Nama Lulusan",
  degree: "Gelar",
  university: "Nama Universitas",
  // ... lainnya
};
```

### Mengubah Warna Tema

Edit `tailwind.config.js` untuk mengubah warna cream:

```javascript
colors: {
  cream: {
    50: '#fefdfb',
    100: '#fdf9f3',
    // ... sesuaikan dengan preferensi
  },
}
```

## Google Script

Google Apps Script sudah diupdate untuk mendukung field dynamic. Script akan otomatis membuat kolom baru berdasarkan data yang dikirim.

## License

MIT License