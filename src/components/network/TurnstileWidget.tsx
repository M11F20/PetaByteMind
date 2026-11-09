'use client';

import { useEffect, useEffectEvent, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
// Cloudflare's documented always-pass test key; production injects the real key at build time.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = SCRIPT_SRC;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => {
      scriptPromise = null;
      reject(new Error('turnstile load failed'));
    };
    document.head.appendChild(el);
  });
  return scriptPromise;
}

interface Props {
  onToken: (token: string | null) => void;
  language: 'en' | 'ar';
  resetSignal: number;
}

export function TurnstileWidget({ onToken, language, resetSignal }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);
  const emitToken = useEffectEvent(onToken);

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          theme: 'dark',
          size: 'flexible',
          language,
          callback: (t: string) => emitToken(t),
          'expired-callback': () => emitToken(null),
          'error-callback': () => emitToken(null),
        });
      })
      .catch(() => emitToken(null));

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [language]);

  useEffect(() => {
    if (resetSignal && widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetSignal]);

  return <div ref={ref} className="min-h-[65px]" data-testid="turnstile" />;
}
