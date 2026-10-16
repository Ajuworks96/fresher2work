import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Fresher2Work — India\'s Dedicated Proof-of-Work Fresher Hiring Ecosystem',
  description: 'Search, filter and discover verified freshers based on proof of work, projects and technical skills.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/brand/favicon.png', type: 'image/png' },
      { url: '/brand/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/brand/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/brand/apple-touch-icon.png" />
      </head>
      <body className="flex min-h-screen flex-col bg-[#FAFAF8] text-slate-900 antialiased selection:bg-[#4ad1c7]/20 selection:text-[#1f357c]">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
