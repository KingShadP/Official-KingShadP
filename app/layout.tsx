import type {Metadata} from 'next';
import { Cormorant_Garamond, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CustomCursor } from '@/components/CustomCursor';
import { AmbientAudio } from '@/components/AmbientAudio';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
});

const space = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'DIVINE ARCHIVE | KINGSHADP',
  description: 'The luxury cinematic vault and official digital residence of KingShadP.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${cormorant.variable} ${space.variable} ${mono.variable} antialiased bg-void text-ivory font-sans relative`} suppressHydrationWarning>
        <CustomCursor />
        <AmbientAudio />
        <div className="atmosphere fixed inset-0 z-[-1]" />
        {children}
      </body>
    </html>
  );
}
