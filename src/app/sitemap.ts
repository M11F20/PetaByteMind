import type { MetadataRoute } from 'next';
import { LANGUAGES, SITE_URL } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  return LANGUAGES.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    changeFrequency: 'weekly',
    priority: lang === 'en' ? 1 : 0.9,
    alternates: { languages: { en: `${SITE_URL}/en`, ar: `${SITE_URL}/ar` } },
  }));
}
