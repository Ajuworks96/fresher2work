import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FresherToWork Recruiter — Discover Top Fresher Talent',
  description: 'Search, filter and discover verified freshers based on proof of work, projects and skills.',
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
