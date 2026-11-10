import type { Metadata } from 'next';

type Props = {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.username || 'Candidate';
  const cleanName = decodeURIComponent(username)
    .replace(/^@/, '')
    .replace(/[_-]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ') || 'Candidate';

  const title = `${cleanName} — Verified Talent Passport | Fresher2Work`;
  const description = `View ${cleanName}'s verified proof of work, technical competencies, and hiring availability on Fresher2Work. Zero agency commission hiring.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://fresher2work.com/u/${username}`,
      siteName: 'Fresher2Work Talent Passport',
      images: [
        {
          url: '/brand/logo.png',
          width: 1200,
          height: 630,
          alt: `${cleanName} Talent Passport`,
        },
      ],
      locale: 'en_IN',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/brand/logo.png'],
    },
  };
}

export default function TalentPassportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

