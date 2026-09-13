import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FresherToWork Admin Portal — Moderation & Operations',
  description: 'Operations, profile moderation, verification and revenue ledger.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
