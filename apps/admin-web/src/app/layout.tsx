import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fresher2Work Admin Portal — Moderation & Operations',
  description: 'Executive platform operations, profile moderation, employer verification and revenue ledger.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/brand/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
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
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-[#4ad1c7]/20 selection:text-[#1f357c]">
        {children}
      </body>
    </html>
  );
}
