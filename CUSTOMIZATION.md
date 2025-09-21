# Customization Guide - Website Undangan Wisuda

## Mengubah Data Undangan

### 1. Data Lulusan

Edit file `data/mockData.ts`:

```typescript
export const invitationData: InvitationData = {
  graduateName: "Nama Lulusan Anda",
  degree: "Sarjana Teknik Informatika",
  university: "Nama Universitas Anda",
  graduationDate: "Sabtu, 15 Februari 2025",
  graduationTime: "08.00 WIB",
  venue: "Auditorium Utama",
  address: "Jl. Teknologi No. 123, Jakarta Selatan",
  message: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara wisuda putra/putri kami.",
  familyName: "Keluarga Besar [Nama Keluarga]"
};
```

### 2. Foto Sample

Ubah foto sample di `data/mockData.ts`:

```typescript
export const samplePhotos: Photo[] = [
  {
    id: "1",
    image: "https://your-image-url.com/photo1.jpg",
    caption: "Caption foto Anda",
    uploadedBy: "Nama Pengupload",
    createdAt: "2025-01-15T10:00:00Z"
  },
  // ... tambahkan foto lainnya
];
```

### 3. Pesan Sample

Ubah pesan sample di `data/mockData.ts`:

```typescript
export const sampleMessages: Message[] = [
  {
    id: "1",
    fullname: "Nama Tamu",
    phone: "081234567890",
    qty: 2,
    is_present: true,
    message: "Ucapan selamat Anda",
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z"
  },
  // ... tambahkan pesan lainnya
];
```

## Mengubah Warna Tema

### 1. Warna Cream

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fefdfb',   // Lightest
          100: '#fdf9f3',
          200: '#faf2e6',
          300: '#f6e8d1',
          400: '#f0d9b5',
          500: '#e8c896',  // Base
          600: '#deb574',
          700: '#d19e4f',
          800: '#b8853f',
          900: '#9a6f35',  // Darkest
        },
      },
    },
  },
}
```

### 2. Warna Alternatif

Untuk tema warna lain, ganti palette cream:

```javascript
// Tema Biru
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  }
}

// Tema Hijau
colors: {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  }
}
```

## Mengubah Font

### 1. Font Utama

Edit `app/layout.tsx`:

```typescript
import { Inter, Playfair_Display, Poppins } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

// Ganti dengan font lain
const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});
```

### 2. Font Serif

```typescript
// Font serif alternatif
const merriweather = Merriweather({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});
```

## Mengubah Layout

### 1. Header Section

Edit `components/Header.tsx`:

```typescript
// Ubah struktur header
<div className="relative min-h-screen flex items-center justify-center">
  {/* Background pattern */}
  <div className="absolute inset-0 bg-gradient-to-br from-cream-50 to-cream-100">
    {/* Custom background elements */}
  </div>
  
  {/* Content */}
  <div className="relative z-10 text-center">
    {/* Custom content */}
  </div>
</div>
```

### 2. Section Order

Edit `app/page.tsx` untuk mengubah urutan section:

```typescript
return (
  <main className="min-h-screen">
    <Header {...headerProps} />
    
    {/* Ubah urutan section */}
    <MessageSection {...messageProps} />
    <PhotoAlbum {...photoProps} />
    <InvitationMessage {...invitationProps} />
    
    <footer>...</footer>
  </main>
);
```

## Menambah Section Baru

### 1. Buat Komponen Baru

```typescript
// components/NewSection.tsx
'use client';

interface NewSectionProps {
  title: string;
  content: string;
}

export default function NewSection({ title, content }: NewSectionProps) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-playfair text-4xl font-bold text-gray-800 mb-6">
          {title}
        </h2>
        <p className="text-lg text-gray-600">
          {content}
        </p>
      </div>
    </section>
  );
}
```

### 2. Import dan Gunakan

```typescript
// app/page.tsx
import NewSection from '@/components/NewSection';

// Di dalam component
<NewSection 
  title="Judul Section Baru"
  content="Konten section baru"
/>
```

## Mengubah Animasi

### 1. CSS Animations

Edit `app/globals.css`:

```css
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Hover effects */
.hover-lift {
  transition: transform 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
}
```

### 2. Tailwind Animations

```typescript
// Gunakan di komponen
<div className="animate-bounce hover:animate-pulse">
  Content dengan animasi
</div>
```

## Mengubah Responsive Design

### 1. Breakpoints

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
}
```

### 2. Responsive Classes

```typescript
// Contoh responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="text-sm md:text-base lg:text-lg">
    Responsive text
  </div>
</div>
```

## Menambah Fitur Baru

### 1. Countdown Timer

```typescript
// components/CountdownTimer.tsx
'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center space-x-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-cream-600">{timeLeft.days}</div>
        <div className="text-sm text-gray-600">Hari</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-cream-600">{timeLeft.hours}</div>
        <div className="text-sm text-gray-600">Jam</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-cream-600">{timeLeft.minutes}</div>
        <div className="text-sm text-gray-600">Menit</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-cream-600">{timeLeft.seconds}</div>
        <div className="text-sm text-gray-600">Detik</div>
      </div>
    </div>
  );
}
```

### 2. Share Button

```typescript
// components/ShareButton.tsx
'use client';

import { Share2 } from 'lucide-react';

export default function ShareButton() {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Undangan Wisuda',
        text: 'Undangan wisuda sarjana teknik informatika',
        url: window.location.href,
      });
    } else {
      // Fallback untuk browser yang tidak support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-cream-600 hover:bg-cream-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
    >
      <Share2 className="w-4 h-4" />
      <span>Bagikan</span>
    </button>
  );
}
```

## Tips Customization

1. **Backup Original:**
   - Selalu backup file original sebelum mengubah
   - Gunakan Git untuk version control

2. **Test Responsive:**
   - Test di berbagai ukuran layar
   - Gunakan browser dev tools

3. **Performance:**
   - Optimize images sebelum upload
   - Gunakan lazy loading untuk foto

4. **Accessibility:**
   - Pastikan kontras warna cukup
   - Gunakan alt text untuk images
   - Test dengan screen reader

5. **SEO:**
   - Update metadata di `app/layout.tsx`
   - Gunakan structured data jika diperlukan
