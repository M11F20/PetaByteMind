'use client';

import React from 'react';
import type { Language } from '@/types';
import { DirectionProvider } from '@/context/DirectionContext';
import { WorkspaceProvider } from '@/context/WorkspaceContext';
import { ClockProvider } from '@/context/ClockContext';
import { LiveTelemetryProvider } from '@/context/LiveTelemetryContext';
import { WebVitalsReporter } from '@/components/system/WebVitalsReporter';

export function Providers({ children, language }: { children: React.ReactNode; language: Language }) {
  return (
    <DirectionProvider initialLanguage={language}>
      <WorkspaceProvider>
        <ClockProvider>
          <LiveTelemetryProvider>
            <WebVitalsReporter />
            {children}
          </LiveTelemetryProvider>
        </ClockProvider>
      </WorkspaceProvider>
    </DirectionProvider>
  );
}
