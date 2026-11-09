import type { Language } from '@/types';

export const LANGUAGES: readonly Language[] = ['en', 'ar'] as const;
export const SITE_URL = 'https://petabytemind.com';

export function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value);
}

export const SITE_META: Record<Language, { title: string; description: string }> = {
  en: {
    title: 'PetaByteMind // Cinematic IDE & Systems Portfolio',
    description:
      'Systems architecture studies, annotated kernel-level code, live edge telemetry, and a MENA ↔ North America engineering network — presented as a cinematic IDE.',
  },
  ar: {
    title: 'PetaByteMind // بيئة تطوير سينمائية ومحفظة هندسة النظم',
    description:
      'دراسات معمارية للنظم، شفرات برمجية موثقة على مستوى النواة، قياسات حية من الحافة، وشبكة هندسية تربط الشرق الأوسط وشمال أفريقيا بأمريكا الشمالية.',
  },
};
