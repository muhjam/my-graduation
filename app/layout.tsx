import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Undangan Wisuda - Muhamad Jamaludin',
  description: 'Undangan wisuda sarjana teknik informatika',
  keywords: 'wisuda, undangan, sarjana, teknik informatika',
  authors: [{ name: 'Muhamad Jamaludin' }],
  openGraph: {
    title: 'Undangan Wisuda - Muhamad Jamaludin',
    description: 'Undangan wisuda sarjana teknik informatika',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-inter bg-cream-50 text-gray-800 antialiased">
        {children}
      </body>
    </html>
  )
}
