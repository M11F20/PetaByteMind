'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Direction } from '@/types';

interface DirectionContextValue {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.cmd': '01 CMD',
    'nav.cmd_label': 'Command Center',
    'nav.vault': '02 VAULT',
    'nav.vault_label': 'The Knowledge Vault',
    'nav.dossier': '03 DOSSIER',
    'nav.dossier_label': 'Engineering Dossier',
    'nav.network': '04 NETWORK',
    'nav.network_label': 'The Global Network',
    
    // Telemetry
    'telemetry.build': 'BUILD: PASSING // v1.0.4',
    'telemetry.slack': 'SLACK: 1,420 NODES ONLINE',
    'telemetry.modules': 'MODULES: 24 ACTIVE',
    'telemetry.rec': 'REC',
    'telemetry.search_hint': 'PRESS CMD+K TO DISPATCH',

    // Hero Viewport
    'hero.badge': 'FLAGSHIP ESSAY // EPISODE 01',
    'hero.title': 'THE ENGINEER AS A FILMMAKER',
    'hero.subtitle': 'Deconstructing high-concurrency systems through cinematic timeline editing, zero-copy architecture, and mechanical sympathy.',
    'hero.cta': 'LAUNCH MASTER TIMELINE',
    'hero.meta_time': '34:12 RUNTIME',
    'hero.meta_res': '4K AV1 // 60 FPS',
    'hero.status': 'VIEWPORT SYNCHRONIZED',

    // System Map
    'map.title': 'INTERACTIVE SYSTEM TOPOLOGY',
    'map.subtitle': 'Direct architectural graph connecting core computational philosophies and runtime paradigms.',
    'map.click_hint': 'CLICK NODE TO INSPECT TELEMETRY',
    'inspector.title': 'NODE TELEMETRY INSPECTOR',
    'inspector.complexity': 'COMPLEXITY INDEX',
    'inspector.latency': 'BENCHMARK LATENCY',
    'inspector.stack': 'CORE RUNTIME STACK',
    'inspector.audience': 'INTENDED RECIPIENT',
    'inspector.artifact': 'ARTIFACT LINK',

    // Vault
    'vault.title': 'THE KNOWLEDGE VAULT',
    'vault.subtitle': 'Synchronized companion essays, annotated code snapshots, and zero-compromise mechanical breakdowns.',
    'vault.filter_all': '00 // ALL LAYERS',
    'vault.filter_vibe': '01 // VIBE-CODING PRIMER',
    'vault.filter_fullstack': '02 // FULL-STACK ARCH',
    'vault.filter_systems': '03 // SYSTEMS DESIGN',
    'vault.filter_silicon': '04 // SILICON LIMITS',
    'vault.architecture_schematic': 'SYSTEM BUS & DATAFLOW SCHEMATIC',
    'vault.code_snapshot': 'TIMESTAMPED KERNEL SNAPSHOT',

    // Dossier
    'dossier.title': 'ENGINEERING DOSSIER',
    'dossier.subtitle': 'Academic research portfolio, peer-reviewed benchmarks, and institutional credentials for Graduate Admissions & Principal R&D Labs.',
    'dossier.target': 'PREPARED FOR: NA GRADUATE COMMITTEES & SENIOR RESEARCH DIRECTORS',
    'dossier.case_studies': 'SYSTEMS CASE STUDIES',
    'dossier.benchmarks': 'EMPIRICAL BENCHMARKS',
    'dossier.publications': 'IEEE / ACM CITATION TIMELINE',

    // Network
    'network.title': 'THE GLOBAL NETWORK',
    'network.subtitle': 'High-velocity technical bridge connecting MENA builders with North American engineering ecosystems.',
    'network.intake_title': 'SLACK INTAKE PIPELINE PROTOCOL',
    'network.spotlights': 'ACTIVE CORRIDOR BUILD SPOTLIGHTS',
    'network.verify_handle': 'VERIFY HANDLE & DISPATCH',
  },
  ar: {
    // Navigation
    'nav.cmd': '01 CMD',
    'nav.cmd_label': 'مركز القيادة',
    'nav.vault': '02 VAULT',
    'nav.vault_label': 'خزينة المعرفة',
    'nav.dossier': '03 DOSSIER',
    'nav.dossier_label': 'الملف الهندسي الأكاديمي',
    'nav.network': '04 NETWORK',
    'nav.network_label': 'شبكة المهندسين',
    
    // Telemetry (Labels in Latin/English, descriptions adapted)
    'telemetry.build': 'BUILD: PASSING // v1.0.4',
    'telemetry.slack': 'SLACK: 1,420 NODES ONLINE',
    'telemetry.modules': 'MODULES: 24 ACTIVE',
    'telemetry.rec': 'REC',
    'telemetry.search_hint': 'اضغط CMD+K للبحث والتنقل',

    // Hero Viewport
    'hero.badge': 'FLAGSHIP ESSAY // EPISODE 01',
    'hero.title': 'المهندس كصانع أفلام: فلسفة النظم والعتاد',
    'hero.subtitle': 'تفكيك الأنظمة عالية التوازي من خلال مونتاج الخط الزمني السينمائي، وهياكل النسخ الصفري، والتعاطف الميكانيكي.',
    'hero.cta': 'تشغيل الخط الزمني الرئيسي',
    'hero.meta_time': '34:12 RUNTIME',
    'hero.meta_res': '4K AV1 // 60 FPS',
    'hero.status': 'VIEWPORT SYNCHRONIZED',

    // System Map
    'map.title': 'مخطط طبولوجيا النظم التفاعلي',
    'map.subtitle': 'رسم بياني هيكلي يربط بين الفلسفات الحاسوبية وأنماط بيئات التشغيل الحية.',
    'map.click_hint': 'انقر على العقدة لفحص بيانات القياس',
    'inspector.title': 'محلل القياس عن بُعد للعقدة',
    'inspector.complexity': 'COMPLEXITY INDEX',
    'inspector.latency': 'BENCHMARK LATENCY',
    'inspector.stack': 'حزمة التشغيل الأساسية',
    'inspector.audience': 'المتلقي المستهدف',
    'inspector.artifact': 'رابط الوثيقة البرمجية',

    // Vault
    'vault.title': 'خزينة المعرفة الهندسية',
    'vault.subtitle': 'مقالات مرافقة متزامنة، لقطات شفرة برمجية موثقة زمنياً، وتحليلات عتادية عميقة.',
    'vault.filter_all': '00 // كل الطبقات',
    'vault.filter_vibe': '01 // تمهيد البرمجة السريعة',
    'vault.filter_fullstack': '02 // معمارية النظم المتكاملة',
    'vault.filter_systems': '03 // تصميم النظم الموزعة',
    'vault.filter_silicon': '04 // حدود السيليكون والذاكرة',
    'vault.architecture_schematic': 'مخطط تدفق البيانات وناقل النظم',
    'vault.code_snapshot': 'لقطة الشفرة البرمجية الموقوتة',

    // Dossier
    'dossier.title': 'الملف الهندسي الأكاديمي',
    'dossier.subtitle': 'محفظة الأبحاث المنشورة، ومعايير الأداء المقارنة، والاعتمادات للجان القبول ومختبرات البحث والتطوير المتقدمة.',
    'dossier.target': 'موجّه إلى: لجان الدراسات العليا ومدراء مراكز الأبحاث في أمريكا الشمالية',
    'dossier.case_studies': 'دراسات حالة النظم الهندسية',
    'dossier.benchmarks': 'مقاييس الأداء التجريبية الموثقة',
    'dossier.publications': 'تسلسل المنشورات الأكاديمية بتنسيق IEEE / ACM',

    // Network
    'network.title': 'الشبكة العالمية للمهندسين',
    'network.subtitle': 'جسر هندسي متسارع يربط نخبة المطورين في الشرق الأوسط وشمال أفريقيا ببيئات الهندسة في أمريكا الشمالية.',
    'network.intake_title': 'بروتوكول الانضمام لمجتمع سلاك',
    'network.spotlights': 'مشاريع حية ومشاركات متميزة في ممر الربط الهندسي',
    'network.verify_handle': 'تحقق من المعرّف وأرسل الطلب',
  },
};

const DirectionContext = createContext<DirectionContextValue | null>(null);

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    // Check saved language preference or system preference
    const saved = localStorage.getItem('petabyte_lang') as Language;
    if (saved === 'en' || saved === 'ar') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('petabyte_lang', lang);
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ar' : 'en';
    setLanguage(next);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('dir', direction);
      document.documentElement.setAttribute('lang', language);
    }
  }, [direction, language]);

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <DirectionContext.Provider
      value={{
        language,
        direction,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </DirectionContext.Provider>
  );
}

export function useDirection() {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
}
