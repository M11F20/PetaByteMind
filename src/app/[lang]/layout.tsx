import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { Providers } from '../providers';
import { LANGUAGES, SITE_META, SITE_URL, isLanguage } from '@/lib/i18n';

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: '#0B0E11',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};
  const meta = SITE_META[lang];
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    icons: { icon: '/favicon.jpg' },
    alternates: {
      canonical: `/${lang}`,
      languages: { en: '/en', ar: '/ar', 'x-default': '/en' },
    },
    openGraph: {
      type: 'website',
      url: `/${lang}`,
      siteName: 'PetaByteMind',
      title: meta.title,
      description: meta.description,
      locale: lang === 'ar' ? 'ar_IQ' : 'en_US',
      alternateLocale: lang === 'ar' ? ['en_US'] : ['ar_IQ'],
    },
    twitter: { card: 'summary', title: meta.title, description: meta.description },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-signal-pure font-sans antialiased selection:bg-cyan-hyper/30 selection:text-signal-pure">
        <Providers language={lang}>{children}</Providers>
      </body>
    </html>
  );
}
