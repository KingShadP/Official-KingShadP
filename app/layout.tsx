import type {Metadata, Viewport} from 'next';
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CustomCursor } from '@/components/CustomCursor';
import { AmbientAudio } from '@/components/AmbientAudio';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const viewport: Viewport = {
  themeColor: '#B21F36',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { SmoothScroll } from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'Official KingShadP',
  description: 'The luxury cinematic vault and official digital residence of KingShadP.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KingShadP',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${cormorant.variable} ${sans.variable} ${mono.variable} antialiased bg-void text-platinum font-sans relative`} suppressHydrationWarning>
        <SmoothScroll />
        <CustomCursor />
        <AmbientAudio />
        <div className="atmosphere fixed inset-0 z-[-1]" />
        {children}
      </body>
    </html>
  );
}
