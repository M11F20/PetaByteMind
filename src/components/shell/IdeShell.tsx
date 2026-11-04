'use client';

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useDirection } from '@/context/DirectionContext';
import { TelemetryBar } from './TelemetryBar';
import { CommandRail } from './CommandRail';
import { BottomStatusBar } from './BottomStatusBar';
import { CommandPalette } from './CommandPalette';
import { CommandCenterWorkspace } from '@/components/workspaces/CommandCenterWorkspace';
import { VaultWorkspace } from '@/components/workspaces/VaultWorkspace';
import { DossierWorkspace } from '@/components/workspaces/DossierWorkspace';
import { NetworkWorkspace } from '@/components/workspaces/NetworkWorkspace';

export function IdeShell() {
  const { activeWorkspace } = useWorkspace();
  const { direction, language } = useDirection();

  const renderActiveWorkspace = () => {
    switch (activeWorkspace) {
      case 'cmd':
        return <CommandCenterWorkspace />;
      case 'vault':
        return <VaultWorkspace />;
      case 'dossier':
        return <DossierWorkspace />;
      case 'network':
        return <NetworkWorkspace />;
      default:
        return <CommandCenterWorkspace />;
    }
  };

  return (
    <div
      dir={direction}
      lang={language}
      className="w-screen h-screen flex flex-col bg-void text-signal-pure overflow-hidden font-sans select-none antialiased"
    >
      {/* Top Telemetry & Path Bar */}
      <TelemetryBar />

      {/* Main IDE Center: Command Rail + Workspace Viewport */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        <CommandRail />
        <main className="flex-1 h-full overflow-hidden bg-void flex flex-col relative">
          {renderActiveWorkspace()}
        </main>
      </div>

      {/* Bottom DaVinci-Style Telemetry & Status Bar */}
      <BottomStatusBar />

      {/* Cmd+K Command Palette Modal */}
      <CommandPalette />
    </div>
  );
}
