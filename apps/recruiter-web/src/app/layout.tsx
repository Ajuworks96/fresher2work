import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';

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
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
