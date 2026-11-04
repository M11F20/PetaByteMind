'use client';

import React from 'react';
import { DirectionProvider } from '@/context/DirectionContext';
import { WorkspaceProvider } from '@/context/WorkspaceContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DirectionProvider>
      <WorkspaceProvider>
        {children}
      </WorkspaceProvider>
    </DirectionProvider>
  );
}
